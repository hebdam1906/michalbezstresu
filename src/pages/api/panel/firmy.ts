// 🔒 /api/panel/firmy — zapytania o warsztaty ze strony /dla-firm
// GET → lista (najnowsze pierwsze) · PATCH {id, status?, notatka?}
//
// Powstało, bo przez pierwsze tygodnie tabela `konsultacje_zapytania` nie była
// czytana przez NIC: zapytanie lądowało w bazie i nikt się o nim nie dowiadywał.
// Przy zapytaniach firmowych, gdzie strona obiecuje odpowiedź w jeden dzień
// roboczy, to byłby realny koszt. Tu jest widok, a osobne zadanie codziennie
// sprawdza, czy coś nie leży nieodebrane.
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthorized } from '../../../lib/panel-auth';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

const STATUSY = ['nowe', 'w-kontakcie', 'oferta', 'wygrane', 'odpadlo'];

export const GET: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);

  const { data, error } = await supabaseAdmin
    .from('firmy_zapytania')
    .select('*')
    .order('utworzono', { ascending: false })
    .limit(200);
  if (error) return json({ error: error.message }, 500);

  const items = data ?? [];
  // Skąd przyszedł ruch — zliczone, żeby dało się to czytać bez wchodzenia do bazy.
  const zrodla: Record<string, number> = {};
  for (const z of items) {
    const k = z.utm_source
      ? `${z.utm_source}${z.utm_medium ? ' / ' + z.utm_medium : ''}`
      : z.gclid ? 'google ads (gclid)'
      : z.fbclid ? 'meta (fbclid)'
      : z.referrer ? new URL(z.referrer).host.replace(/^www\./, '')
      : 'wejście bezpośrednie';
    zrodla[k] = (zrodla[k] ?? 0) + 1;
  }

  return json({
    ok: true,
    items,
    nowe: items.filter((z: any) => z.status === 'nowe').length,
    zrodla: Object.entries(zrodla).sort((a, b) => b[1] - a[1]),
  });
};

export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  let b: any; try { b = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const id = Number(b.id);
  if (!Number.isFinite(id)) return json({ error: 'zły id' }, 400);

  const zmiany: Record<string, unknown> = {};
  if (b.status !== undefined) {
    if (!STATUSY.includes(String(b.status))) return json({ error: 'zły status' }, 400);
    zmiany.status = String(b.status);
  }
  if (b.notatka !== undefined) zmiany.notatka = String(b.notatka ?? '').slice(0, 2000) || null;
  if (!Object.keys(zmiany).length) return json({ error: 'nic do zmiany' }, 400);

  const { data, error } = await supabaseAdmin
    .from('firmy_zapytania').update(zmiany).eq('id', id).select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, item: data });
};
