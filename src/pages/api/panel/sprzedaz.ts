// 📕 GET /api/panel/sprzedaz — kafelek „Książka: sprzedaż” (2.11.2026)
// Liczone na żywo z easycart_zdarzenia (lib/sprzedaz), bez cache'a.
// Autoryzacja jak reszta panelu: cookie Mike'a albo Bearer Klaudiusza.
export const prerender = false;

import type { APIRoute } from 'astro';
import { isAuthorized } from '../../../lib/panel-auth';
import { podsumowanieSprzedazy, KANALY_RECZNE } from '../../../lib/sprzedaz';
import { supabaseAdmin } from '../../../lib/supabase';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const GET: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  try {
    return json({ ok: true, ...(await podsumowanieSprzedazy()) });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
};

// POST {kanal: 'empik'|'amazon_pl', sztuki} — ręczna sprzedaż od 16.11 (Plan Tornado, 14.11.2026)
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'brak supabase' }, 500);
  let b: any; try { b = await request.json(); } catch { return json({ error: 'zły JSON' }, 400); }
  const kanal = String(b?.kanal ?? ''); const sztuki = Math.floor(Number(b?.sztuki));
  if (!(KANALY_RECZNE as readonly string[]).includes(kanal) || !Number.isFinite(sztuki) || sztuki < 0 || sztuki > 100000)
    return json({ error: 'zły kanał albo liczba' }, 400);
  const { error } = await supabaseAdmin.from('panel_sprzedaz_reczna')
    .upsert({ kanal, sztuki, updated_at: new Date().toISOString() }, { onConflict: 'kanal' });
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};
