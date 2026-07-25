// 📊 /api/panel/statystyki — metryki kanałów, materiały, ruch/lejek
//
// GET                       → { metryki, wzrost, materialy, ruch, sync }
// POST { typ: 'metryka'  }  → upsert snapshotu kanału na dany dzień
// POST { typ: 'material' }  → dodanie/aktualizacja wyniku materiału
// POST { typ: 'ruch'     }  → upsert wizyt/zapisów na dany dzień
// DELETE ?typ=material&id=  → usunięcie wpisu
//
// Autoryzacja identyczna jak reszta panelu: cookie Mike'a albo Bearer Klaudiusza.
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthorized } from '../../../lib/panel-auth';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

const PLATFORMY = ['yt', 'tt', 'ig', 'fb', 'newsletter'] as const;
type Platforma = (typeof PLATFORMY)[number];

const isPlatforma = (v: unknown): v is Platforma =>
  typeof v === 'string' && (PLATFORMY as readonly string[]).includes(v);

/** Liczba całkowita >= 0 albo 0, gdy pole nie przyszło. */
const int0 = (v: unknown): number | null => {
  if (v === undefined || v === null || v === '') return 0;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 ? n : null;
};

const isDate = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

// ────────────────────────────────────────────────────────────────────────────
export const GET: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);

  // 60 dni historii wystarcza na wykresy tygodniowe i miesięczne
  const od = new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString().slice(0, 10);

  const [metryki, wzrost, materialy, ruch, sync] = await Promise.all([
    supabaseAdmin.from('panel_metryki').select('*').gte('data', od).order('data', { ascending: true }),
    supabaseAdmin.from('panel_wzrost').select('*').gte('data', od).order('data', { ascending: true }),
    supabaseAdmin.from('panel_materialy').select('*').order('data_pub', { ascending: false, nullsFirst: false }),
    supabaseAdmin.from('panel_ruch').select('*').gte('data', od).order('data', { ascending: true }),
    supabaseAdmin.from('panel_sync_log').select('*').order('uruchomiono', { ascending: false }).limit(10),
  ]);

  const blad = [metryki, wzrost, materialy, ruch, sync].find((r) => r.error);
  if (blad?.error) return json({ error: blad.error.message }, 500);

  return json({
    ok: true,
    metryki: metryki.data ?? [],
    wzrost: wzrost.data ?? [],
    materialy: materialy.data ?? [],
    ruch: ruch.data ?? [],
    sync: sync.data ?? [],
  });
};

// ────────────────────────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);

  let b: any;
  try { b = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const zrodlo = b.zrodlo === 'api' || b.zrodlo === 'chrome' ? b.zrodlo : 'reczne';

  // ── snapshot kanału ───────────────────────────────────────────────────────
  if (b.typ === 'metryka') {
    if (!isPlatforma(b.platforma)) return json({ error: 'zła platforma' }, 400);
    const obserwujacy = int0(b.obserwujacy);
    const wysw = int0(b.wyswietlenia_28);
    const pol = int0(b.polubienia);
    const mat = int0(b.materialy);
    if (obserwujacy === null || wysw === null || pol === null || mat === null)
      return json({ error: 'liczby muszą być całkowite i nieujemne' }, 400);

    const row = {
      data: isDate(b.data) ? b.data : new Date().toISOString().slice(0, 10),
      platforma: b.platforma,
      obserwujacy,
      wyswietlenia_28: wysw,
      polubienia: pol,
      materialy: mat,
      zrodlo,
    };
    const { data, error } = await supabaseAdmin
      .from('panel_metryki')
      .upsert(row, { onConflict: 'data,platforma' })
      .select()
      .single();
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, item: data });
  }

  // ── wynik pojedynczego materiału ──────────────────────────────────────────
  if (b.typ === 'material') {
    const tytul = String(b.tytul ?? '').trim();
    if (tytul.length < 2) return json({ error: 'za krótki tytuł' }, 400);
    if (!isPlatforma(b.platforma)) return json({ error: 'zła platforma' }, 400);
    const wysw = int0(b.wyswietlenia);
    const pol = int0(b.polubienia);
    const kom = int0(b.komentarze);
    if (wysw === null || pol === null || kom === null)
      return json({ error: 'liczby muszą być całkowite i nieujemne' }, 400);

    const row: Record<string, unknown> = {
      tytul: tytul.slice(0, 300),
      platforma: b.platforma,
      data_pub: isDate(b.data_pub) ? b.data_pub : null,
      wyswietlenia: wysw,
      polubienia: pol,
      komentarze: kom,
      link: b.link ? String(b.link).slice(0, 500) : null,
      external_id: b.external_id ? String(b.external_id).slice(0, 120) : null,
      zrodlo,
      zaktualizowano: new Date().toISOString(),
    };

    // Edycja istniejącego wiersza (klik w panelu) vs. nowy wpis
    if (b.id !== undefined) {
      const id = Number(b.id);
      if (!Number.isInteger(id)) return json({ error: 'zły id' }, 400);
      const { data, error } = await supabaseAdmin
        .from('panel_materialy').update(row).eq('id', id).select().single();
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, item: data });
    }

    // Z external_id → upsert (automat nie duplikuje). Bez → zwykły insert.
    const q = row.external_id
      ? supabaseAdmin.from('panel_materialy').upsert(row, { onConflict: 'platforma,external_id' })
      : supabaseAdmin.from('panel_materialy').insert(row);
    const { data, error } = await q.select().single();
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, item: data });
  }

  // ── ruch na stronie + zapisy ──────────────────────────────────────────────
  if (b.typ === 'ruch') {
    const wizyty = int0(b.wizyty);
    const zapisy = int0(b.zapisy);
    if (wizyty === null || zapisy === null)
      return json({ error: 'liczby muszą być całkowite i nieujemne' }, 400);

    const row = {
      data: isDate(b.data) ? b.data : new Date().toISOString().slice(0, 10),
      wizyty,
      zapisy,
      zrodla: typeof b.zrodla === 'object' && b.zrodla !== null ? b.zrodla : {},
      zrodlo,
    };
    const { data, error } = await supabaseAdmin
      .from('panel_ruch').upsert(row, { onConflict: 'data' }).select().single();
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, item: data });
  }

  return json({ error: 'nieznany typ (metryka | material | ruch)' }, 400);
};

// ────────────────────────────────────────────────────────────────────────────
export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);

  const typ = url.searchParams.get('typ');
  const id = Number(url.searchParams.get('id'));
  if (!Number.isInteger(id)) return json({ error: 'zły id' }, 400);

  const tabela =
    typ === 'material' ? 'panel_materialy' :
    typ === 'metryka'  ? 'panel_metryki'   :
    typ === 'ruch'     ? 'panel_ruch'      : null;
  if (!tabela) return json({ error: 'nieznany typ' }, 400);

  const { error } = await supabaseAdmin.from(tabela).delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};
