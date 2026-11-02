// 📕 GET /api/panel/sprzedaz — kafelek „Książka: sprzedaż” (2.11.2026)
// Liczone na żywo z easycart_zdarzenia (lib/sprzedaz), bez cache'a.
// Autoryzacja jak reszta panelu: cookie Mike'a albo Bearer Klaudiusza.
export const prerender = false;

import type { APIRoute } from 'astro';
import { isAuthorized } from '../../../lib/panel-auth';
import { podsumowanieSprzedazy } from '../../../lib/sprzedaz';

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
