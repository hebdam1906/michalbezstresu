// ============================================================================
// 📸 /api/panel/premiera-zrzut/ — zrzut grupy MailerLite „Ksiazka-premiera”
// ----------------------------------------------------------------------------
// 15.10.2026. Kto jest na liście premierowej PRZED 2.11, ma prawo do PDF
// z dedykacją (kupno 2–8.11). Cron Vercela robi zrzut 2.11 o 7:00 (PL), a do
// tego czasu można go odpalać ręcznie (panel / PANEL_API_KEY) — każdy zrzut
// dopisuje nowe osoby, nikogo nie usuwa. Po 2.11 7:00 kolejne zrzuty NIE
// dopisują nikogo (okno zamknięte).
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthorized } from '../../../lib/panel-auth';

const GRUPA = '201320469525169413';
const KONIEC = Date.parse('2026-11-02T07:05:00+01:00');

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

function toCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  return !!secret && request.headers.get('authorization') === `Bearer ${secret}`;
}

async function zrzut() {
  if (!supabaseAdmin) return json({ error: 'Brak Supabase' }, 503);
  const key = process.env.MAILERLITE_API_KEY;
  if (!key) return json({ error: 'Brak MAILERLITE_API_KEY' }, 503);
  if (Date.now() > KONIEC) return json({ ok: true, pominieto: 'okno zamknięte 2.11 7:05' });

  const wiersze: { email: string; imie: string | null; dodano: string | null }[] = [];
  let cursor = '';
  for (let i = 0; i < 50; i++) {
    const url = `https://connect.mailerlite.com/api/groups/${GRUPA}/subscribers?limit=1000&filter[status]=active${cursor ? `&cursor=${cursor}` : ''}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' } });
    if (!r.ok) return json({ error: `MailerLite HTTP ${r.status}` }, 502);
    const d: any = await r.json();
    for (const s of d.data || []) {
      wiersze.push({ email: String(s.email).toLowerCase(), imie: s.fields?.name || null, dodano: s.subscribed_at || s.created_at || null });
    }
    cursor = d.meta?.next_cursor || '';
    if (!cursor) break;
  }
  if (wiersze.length) {
    const { error } = await supabaseAdmin.from('premiera_lista').upsert(wiersze, { onConflict: 'email', ignoreDuplicates: true });
    if (error) return json({ error: 'Zapis nieudany', szczegoly: error.message }, 500);
  }
  const { count } = await supabaseAdmin.from('premiera_lista').select('email', { count: 'exact', head: true });
  return json({ ok: true, w_grupie: wiersze.length, na_liscie: count ?? null });
}

export const GET: APIRoute = async ({ request, cookies }) => {
  if (!toCron(request) && !isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  return zrzut();
};
export const POST = GET;
