// 🔒 /api/panel/publikacje — CRUD kalendarza treści
// GET · POST {tytul,platforma?,status?,data_pub?,link?,notatka?} · PATCH {id,...} · DELETE ?id=
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthorized } from '../../../lib/panel-auth';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

const PLAT = ['yt', 'tt', 'ig', 'fb', 'newsletter', 'blog'];
const STAT = ['pomysl', 'wprodukcji', 'zaplanowane', 'opublikowane'];

function clean(b: any) {
  const u: any = {};
  if (b.tytul !== undefined) { const t = String(b.tytul).trim(); if (t.length < 2 || t.length > 300) return { err: 'tytul 2-300' }; u.tytul = t; }
  if (b.platforma !== undefined) { const p = String(b.platforma).toLowerCase(); if (!PLAT.includes(p)) return { err: 'zła platforma' }; u.platforma = p; }
  if (b.status !== undefined) { if (!STAT.includes(b.status)) return { err: 'zły status' }; u.status = b.status; }
  if (b.data_pub !== undefined) u.data_pub = b.data_pub || null;
  if (b.link !== undefined) u.link = b.link ? String(b.link).trim().slice(0, 500) : null;
  if (b.notatka !== undefined) u.notatka = b.notatka ? String(b.notatka).slice(0, 1000) : null;
  return { u };
}

export const GET: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  const { data, error } = await supabaseAdmin
    .from('panel_publikacje')
    .select('*')
    .order('data_pub', { ascending: true, nullsFirst: false });
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, items: data ?? [] });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  let b: any; try { b = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  if (!b.tytul) return json({ error: 'tytul wymagany' }, 400);
  const { u, err } = clean(b);
  if (err) return json({ error: err }, 400);
  const { data, error } = await supabaseAdmin.from('panel_publikacje').insert(u).select().single();
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
  const { data, error } = await supabaseAdmin.from('panel_publikacje').update(u).eq('id', id).select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true, item: data });
};

export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  const id = Number(url.searchParams.get('id'));
  if (!Number.isInteger(id)) return json({ error: 'zły id' }, 400);
  const { error } = await supabaseAdmin.from('panel_publikacje').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};
