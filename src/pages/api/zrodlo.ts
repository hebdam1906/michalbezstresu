// ============================================================================
// 🧭 /api/zrodlo — źródło wejścia (UTM, odsyłacz) przy zapisie na listę
// ----------------------------------------------------------------------------
// 22.10.2026 (brief Klaudiusza „źródło zapisu UTM”). Atrybucja.astro wysyła tu
// (sendBeacon) dane z pierwszego wejścia w sesji w chwili, gdy ktoś wysyła
// formularz zapisu: checklista PL/EN, wzór planu naprawczego, książka PL/EN, live.
// Zapis do Supabase `zapisy_zrodla`, tylko pierwszy raz dla pary e-mail +
// formularz (unikalny klucz, kolejne zapisy nie nadpisują źródła).
// Zestawienie: widok `zapisy_wg_zrodla`.
// Uwaga: dla osadzonych formularzy MailerLite liczymy WYSŁANIE formularza,
// nie potwierdzony zapis — porównuj z liczbą subskrybentów w MailerLite.
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { przepusc, zaDuzo } from '../../lib/ratelimit';
import { supabaseAdmin } from '../../lib/supabase';

const FORMULARZE = new Set(['checklista', 'checklista-en', 'plan-naprawczy', 'ksiazka', 'book-en', 'live']);
const t = (v: unknown, max: number) => { const s = String(v ?? '').trim().slice(0, max); return s || null; };
const ok = () => new Response(null, { status: 204 });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!(await przepusc('zrodlo', clientAddress, 10))) return zaDuzo();
  if (!supabaseAdmin) return ok();
  let b: any;
  try { b = JSON.parse(await request.text()); } catch { return new Response(null, { status: 400 }); }
  const formularz = t(b.formularz, 40);
  const email = (t(b.email, 160) || '').toLowerCase();
  if (!formularz || !FORMULARZE.has(formularz) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return new Response(null, { status: 400 });
  const a = b.atr && typeof b.atr === 'object' ? b.atr : {};
  await supabaseAdmin.from('zapisy_zrodla').upsert({
    formularz, email,
    utm_source: t(a.utm_source, 120), utm_medium: t(a.utm_medium, 120), utm_campaign: t(a.utm_campaign, 120),
    utm_content: t(a.utm_content, 120), utm_term: t(a.utm_term, 120),
    referrer: t(a.referrer, 300), strona_wejscia: t(a.strona_wejscia, 300), strona_formularza: t(b.strona, 200),
  }, { onConflict: 'email,formularz', ignoreDuplicates: true });
  return ok();
};

// 30.10.2026: Googlebot pobierał /api/zrodlo GET-em i dostawał 404 (Search Console).
// robots.txt celowo nie ma Disallow (sprawa Google Ads, 7.09), więc zamiast blokady
// zwracamy 405 z nagłówkiem Allow — jasny sygnał, że to endpoint tylko do POST.
export const GET: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: 'POST', 'X-Robots-Tag': 'noindex' } });
