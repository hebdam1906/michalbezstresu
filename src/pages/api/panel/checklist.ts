// ✅ /api/panel/checklist — stan odhaczeń checklisty produkcyjnej
//
// GET  ?publikacja_id=N  → { punkty: [{klucz, tekst, etap, krytyczny, jak, zrobione}] }
//                          (szablon z kodu + stan z bazy, złożone razem)
// POST { publikacja_id, punkt, zrobione } → przełącza pojedynczy punkt
//
// Szablony punktów mieszkają w src/lib/checklisty.ts — tam się je edytuje.
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthorized } from '../../../lib/panel-auth';
import { punktyDla, krytyczneDla } from '../../../lib/checklisty';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

export const GET: APIRoute = async ({ request, cookies, url }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  const db = supabaseAdmin;
  if (!db) return json({ error: 'Brak konfiguracji Supabase' }, 503);

  const id = Number(url.searchParams.get('publikacja_id'));
  if (!Number.isFinite(id)) return json({ error: 'Brak publikacja_id' }, 400);

  const { data: pub, error: e1 } = await db
    .from('panel_publikacje').select('platforma').eq('id', id).single();
  if (e1 || !pub) return json({ error: 'Nie ma takiej publikacji' }, 404);

  const szablon = punktyDla(pub.platforma);
  if (!szablon.length) return json({ punkty: [], platforma: pub.platforma });

  const { data: stan } = await db
    .from('panel_checklist').select('punkt,zrobione').eq('publikacja_id', id);
  const odhaczone = new Set((stan ?? []).filter((r) => r.zrobione).map((r) => r.punkt));

  return json({
    platforma: pub.platforma,
    punkty: szablon.map((p) => ({ ...p, zrobione: odhaczone.has(p.klucz) })),
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  const db = supabaseAdmin;
  if (!db) return json({ error: 'Brak konfiguracji Supabase' }, 503);

  const b = await request.json().catch(() => null);
  const id = Number(b?.publikacja_id);
  const punkt = String(b?.punkt ?? '').trim();
  if (!Number.isFinite(id) || !punkt) return json({ error: 'Brak publikacja_id lub punkt' }, 400);

  const { error } = await db.from('panel_checklist').upsert(
    { publikacja_id: id, punkt, zrobione: !!b.zrobione, zaktualizowano: new Date().toISOString() },
    { onConflict: 'publikacja_id,punkt' },
  );
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};

/**
 * Czy publikację wolno oznaczyć jako „opublikowane".
 * Używane przez /api/panel/publikacje przy zmianie statusu.
 */
export async function braklujaceKrytyczne(
  db: NonNullable<typeof supabaseAdmin>, id: number, platforma: string,
): Promise<string[]> {
  const wymagane = krytyczneDla(platforma);
  if (!wymagane.length) return [];
  const { data } = await db
    .from('panel_checklist').select('punkt,zrobione').eq('publikacja_id', id);
  const ok = new Set((data ?? []).filter((r) => r.zrobione).map((r) => r.punkt));
  const brak = wymagane.filter((k) => !ok.has(k));
  const teksty = punktyDla(platforma);
  return brak.map((k) => teksty.find((p) => p.klucz === k)?.tekst ?? k);
}
