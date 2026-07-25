// 📧 /api/panel/subskrybenci — lista zapisów na newsletter (na żywo z MailerLite)
//
// GET ?limit=25 → { razem, items: [{ email, imie, data, zrodlo }] }
//
// ŚWIADOMA DECYZJA: adresy NIE są zapisywane w naszej bazie. Panel pyta
// MailerLite przy każdym otwarciu zakładki. Mniej kopii danych osobowych =
// mniej rzeczy, które można zgubić. Jedyne, co ląduje w Supabase, to LICZBY.
export const prerender = false;

import type { APIRoute } from 'astro';
import { isAuthorized } from '../../../lib/panel-auth';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

export const GET: APIRoute = async ({ request, cookies, url }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);

  const key = process.env.MAILERLITE_API_KEY;
  if (!key) return json({ error: 'Brak MAILERLITE_API_KEY — patrz ETAP4_STATYSTYKI.md' }, 503);

  const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 25, 1), 100);

  const r = await fetch(
    `https://connect.mailerlite.com/api/subscribers?limit=${limit}&filter[status]=active&sort=-subscribed_at`,
    { headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' } },
  );
  const d = await r.json().catch(() => null);
  if (!r.ok) return json({ error: d?.message || `MailerLite HTTP ${r.status}` }, 502);

  const items = (d?.data ?? []).map((s: any) => ({
    email: s?.email ?? '—',
    imie: s?.fields?.name ?? null,
    data: s?.subscribed_at ? String(s.subscribed_at).slice(0, 10) : null,
  }));

  return json({ ok: true, razem: Number(d?.meta?.total ?? items.length), items });
};
