// 🔒 /api/panel/rozdzialy — tracker rozdziałów książki
// GET · POST {nr,tytul,status?,slowa?,notatka?} · PATCH {id,...} · DELETE ?id=
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthorized } from '../../../lib/panel-auth';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

const STAT = ['szkic', 'wpisaniu', 'gotowy'];

function clean(b: any) {
  const u: any = {};
  if (b.nr !== undefined) { const n = Number(b.nr); if (!Number.isInteger(n) || n < 0) return { err: 'zły nr' }; u.nr = n; }
  if (b.tytul !== undefined) { const t = String(b.tytul).trim(); if (t.length < 1 || t.length > 300) return { err: 'tytul 1-300' }; u.tytul = t; }
  if (b.status !== undefined) { if (!STAT.includes(b.status)) return { err: 'zły status' }; u.status = b.status; }
  if (b.slowa !== undefined) { const s = Number(b.slowa); if (!Number.isInteger(s) || s < 0) return { err: 'złe slowa' }; u.slowa = s; }
  if (b.notatka !== undefined) u.notatka = b.notatka ? String(b.notatka).slice(0, 1000) : null;
  return { u };
}

export const GET: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  const { data, error } = await supabaseAdmin
    .from('panel_rozdzialy')
    .select('*')
    .order('nr', { ascending: true });
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, items: data ?? [] });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  let b: any; try { b = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  if (b.tytul === undefined || b.nr === undefined) return json({ error: 'nr i tytul wymagane' }, 400);
  const { u, err } = clean(b);
  if (err) return json({ error: err }, 400);
  const { data, error } = await supabaseAdmin.from('panel_rozdzialy').insert(u).select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, item: data });
};

export const PATCH: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  let b: any; try { b = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const id = Number(b.id);
  if (!Number.isInteger(id)) return json({ error: 'zły id' }, 400);
  const { u, err } = clean(b);
  if (err) return json({ error: err }, 400);
  u.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('panel_rozdzialy').update(u).eq('id', id).select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, item: data });
};

export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  const id = Number(url.searchParams.get('id'));
  if (!Number.isInteger(id)) return json({ error: 'zły id' }, 400);
  const { error } = await supabaseAdmin.from('panel_rozdzialy').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};
