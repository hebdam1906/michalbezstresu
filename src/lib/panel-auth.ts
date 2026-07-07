// ============================================================================
// 🔒 src/lib/panel-auth.ts — auth dla /panel MBS
// ----------------------------------------------------------------------------
// 2 ścieżki dostępu:
//   1. HASŁO (Mike) — POST /api/panel/login { password } → podpisane cookie 30 dni
//   2. API KEY (Klaudiusz) — nagłówek `Authorization: Bearer <PANEL_API_KEY>`
//
// Env:
//   PANEL_PASSWORD        — hasło do logowania (Mike)
//   PANEL_SESSION_SECRET  — sekret HMAC do podpisu cookie
//   PANEL_API_KEY         — klucz dostępu dla Klaudiusza (AI)
// ============================================================================

import crypto from 'node:crypto';
import type { AstroCookies } from 'astro';

const PANEL_PASSWORD = process.env.PANEL_PASSWORD;
const PANEL_SESSION_SECRET = process.env.PANEL_SESSION_SECRET;
const PANEL_API_KEY = process.env.PANEL_API_KEY;
const COOKIE_NAME = 'mbs_panel';
const COOKIE_TTL_DAYS = 30;

/** Porównanie hasła w czasie stałym (ochrona przed timing-attack). */
export function checkPassword(input: string | undefined): boolean {
  if (!input || !PANEL_PASSWORD) return false;
  const a = Buffer.from(input.trim());
  const b = Buffer.from(PANEL_PASSWORD.trim());
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function signSession(): string {
  if (!PANEL_SESSION_SECRET) throw new Error('PANEL_SESSION_SECRET missing');
  const payload = `mike:${Date.now()}`;
  const sig = crypto.createHmac('sha256', PANEL_SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

export function verifySession(cookieValue: string | undefined): boolean {
  if (!cookieValue || !PANEL_SESSION_SECRET) return false;
  try {
    const decoded = Buffer.from(cookieValue, 'base64url').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [who, ts, sig] = parts;
    const expected = crypto
      .createHmac('sha256', PANEL_SESSION_SECRET)
      .update(`${who}:${ts}`)
      .digest('hex');
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return false;
    const age = Date.now() - parseInt(ts, 10);
    if (age > COOKIE_TTL_DAYS * 24 * 3600 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export function setSessionCookie(cookies: AstroCookies): void {
  cookies.set(COOKIE_NAME, signSession(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_TTL_DAYS * 24 * 3600,
  });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(COOKIE_NAME, { path: '/' });
}

export function readSession(cookies: AstroCookies): boolean {
  return verifySession(cookies.get(COOKIE_NAME)?.value);
}

/** Czy request jest uprawniony (cookie Mike'a LUB Bearer key Klaudiusza). */
export function isAuthorized(request: Request, cookies: AstroCookies): { ok: boolean; who: string } {
  const authHeader = request.headers.get('authorization');
  if (authHeader && PANEL_API_KEY && authHeader === `Bearer ${PANEL_API_KEY}`) {
    return { ok: true, who: 'klaudiusz' };
  }
  if (readSession(cookies)) return { ok: true, who: 'mike' };
  return { ok: false, who: 'unknown' };
}
