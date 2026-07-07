// 🔒 /api/panel/lejek — wzrost listy mailowej w czasie
// GET · POST {subskrybenci,nowi?,data?,notatka?} · DELETE ?id=
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthorized } from '../../../lib/panel-auth';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

export const GET: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  const { data, error } = await supabaseAdmin
    .from('panel_lejek')
    .select('*')
    .order('data', { ascending: true });
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, items: data ?? [] });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  let b: any; try { b = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const sub = Number(b.subskrybenci);
  if (!Number.isInteger(sub) || sub < 0) return json({ error: 'złe subskrybenci' }, 400);
  const nowi = b.nowi !== undefined ? Number(b.nowi) : 0;
  if (!Number.isInteger(nowi)) return json({ error: 'złe nowi' }, 400);
  const row: any = { subskrybenci: sub, nowi };
  if (b.data) row.data = b.data;
  if (b.notatka) row.notatka = String(b.notatka).slice(0, 500);
  const { data, error } = await supabaseAdmin.from('panel_lejek').insert(row).select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, item: data });
};

export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  const id = Number(url.searchParams.get('id'));
  if (!Number.isInteger(id)) return json({ error: 'zły id' }, 400);
  const { error } = await supabaseAdmin.from('panel_lejek').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};
