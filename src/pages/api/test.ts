// ============================================================================
// 🧭 /api/test — zapis z testu „Która trudna rozmowa Cię czeka?” (5.11.2026)
// ----------------------------------------------------------------------------
// Odpowiedzi → wynik liczony TU z src/data/test-rozmowa.js (nie ufamy tekstom
// z przeglądarki) → MailerLite, grupa „Test-rozmowa” (203292150430959194).
// Pola: rozmowa, strona, kiedy, trudnosc, historia + gotowe teksty wyniku
// (wynik_tytul, wynik_a, wynik_b, wynik_c, wynik_rozdzial) do maila z wynikiem
// w automacie „Test-rozmowa”, + fragment (podwyzka → 9, reszta → 1) i UTM.
// wynik_b = „Trzy zdania na start” TYLKO dla strona = pracownik, inaczej puste.
// Zabezpieczenia jak /api/ksiazka: pułapka `www`, limity, ratelimit.
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { przepusc, zaDuzo } from '../../lib/ratelimit';
import { wynik, PYTANIA } from '../../data/test-rozmowa.js';

const GRUPA = '203292150430959194'; // „Test-rozmowa”
const KLUCZ_ML = import.meta.env.MAILERLITE_API_KEY;

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });
const tekst = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const czyMail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const BLAD = 'Nie udało się zapisać. Spróbuj jeszcze raz albo napisz na kontakt@michalbezstresu.pl.';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!(await przepusc('test', clientAddress))) return zaDuzo();
  if (!KLUCZ_ML) return json({ error: 'Zapis chwilowo niedostępny. Spróbuj za kilka minut.' }, 503);

  let b: any;
  try { b = await request.json(); } catch { return json({ error: 'Nieprawidłowe dane.' }, 400); }
  if (tekst(b.www, 200) !== '') return json({ ok: true }); // bot

  const email = tekst(b.email, 160).toLowerCase();
  const imie = tekst(b.imie, 80);
  if (!czyMail(email)) return json({ error: 'Sprawdź adres e-mail.' }, 400);

  const o: Record<string, string> = {};
  for (const p of PYTANIA) {
    const v = tekst(b.odp?.[p.pole], 20);
    if (!p.opcje.some(([k]) => k === v)) return json({ error: 'Odpowiedz na wszystkie pytania.' }, 400);
    o[p.pole] = v;
  }
  const w = wynik(o);
  if (!w) return json({ error: 'Odpowiedz na wszystkie pytania.' }, 400);

  const fields: Record<string, string> = {
    ...o,
    fragment: w.pdf,
    wynik_tytul: w.nazwa,
    wynik_a: w.akapit,
    wynik_b: w.zdania.length ? 'Trzy zdania na start: ' + w.zdania.map((z, i) => `${i + 1}) ${z}`).join(' ') : '',
    wynik_c: `${w.stronaTekst} ${w.dopisek}`,
    wynik_rozdzial: w.rozdzial,
  };
  if (imie) fields.name = imie;
  const u = b.utm && typeof b.utm === 'object' ? b.utm : {};
  for (const k of ['source', 'campaign', 'content'] as const) {
    const v = tekst(u[k], 120);
    if (v) fields['utm_' + k] = v;
  }

  try {
    const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${KLUCZ_ML}` },
      body: JSON.stringify({ email, fields, groups: [GRUPA] }),
    });
    if (!r.ok) return json({ error: BLAD }, 502);
  } catch {
    return json({ error: BLAD }, 502);
  }
  return json({ ok: true });
};
