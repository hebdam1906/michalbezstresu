// 🔒 POST /api/panel/logout → czyści cookie sesji
export const prerender = false;

import type { APIRoute } from 'astro';
import { clearSessionCookie } from '../../../lib/panel-auth';

export const POST: APIRoute = async ({ cookies }) => {
  clearSessionCookie(cookies);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
