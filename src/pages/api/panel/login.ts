// 🔒 POST /api/panel/login  { password } → ustawia cookie sesji
export const prerender = false;

import type { APIRoute } from 'astro';
import { checkPassword, setSessionCookie } from '../../../lib/panel-auth';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  if (!checkPassword(body?.password)) {
    return json({ error: 'Nieprawidłowe hasło.' }, 401);
  }
  setSessionCookie(cookies);
  return json({ ok: true });
};
