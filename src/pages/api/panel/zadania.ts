// 🔒 /api/panel/zadania — CRUD zadań (kanban)
// GET → lista · POST {tresc,owner} · PATCH {id,status?,tresc?,owner?} · DELETE ?id=
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthorized } from '../../../lib/panel-auth';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

const OWNERS = ['mike', 'marcin', 'klaudiusz', 'team'];
const STATUSES = ['todo', 'inprogress', 'done'];

export const GET: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  const { data, error } = await supabaseAdmin
    .from('panel_zadania')
    .select('*')
    .order('id', { ascending: true });
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, items: data ?? [] });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = isAuthorized(request, cookies);
  if (!auth.ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  let b: any; try { b = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const tresc = String(b.tresc || '').trim();
  const owner = String(b.owner || 'mike').trim().toLowerCase();
  if (tresc.length < 2 || tresc.length > 500) return json({ error: 'tresc 2-500' }, 400);
  if (!OWNERS.includes(owner)) return json({ error: 'zły owner' }, 400);
  const { data, error } = await supabaseAdmin
    .from('panel_zadania')
    .insert({ tresc, owner, status: 'todo', created_by: auth.who })
    .select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, item: data });
};

export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  let b: any; try { b = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const id = Number(b.id);
  if (!Number.isInteger(id)) return json({ error: 'zły id' }, 400);
  const u: any = { updated_at: new Date().toISOString() };
  if (b.status !== undefined) { if (!STATUSES.includes(b.status)) return json({ error: 'zły status' }, 400); u.status = b.status; }
  if (b.owner !== undefined) { const o = String(b.owner).toLowerCase(); if (!OWNERS.includes(o)) return json({ error: 'zły owner' }, 400); u.owner = o; }
  if (b.tresc !== undefined) { const t = String(b.tresc).trim(); if (t.length < 2 || t.length > 500) return json({ error: 'tresc 2-500' }, 400); u.tresc = t; }
  const { data, error } = await supabaseAdmin.from('panel_zadania').update(u).eq('id', id).select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, item: data });
};

export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  const id = Number(url.searchParams.get('id'));
  if (!Number.isInteger(id)) return json({ error: 'zły id' }, 400);
  const { error } = await supabaseAdmin.from('panel_zadania').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};
