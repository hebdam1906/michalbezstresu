// ============================================================================
// 🔴 /api/live — zapis na LinkedIn Live 5.11.2026, 19:00
// ----------------------------------------------------------------------------
// 19.10.2026 (brief Klaudiusza i20). Formularz na /live/ → MailerLite:
//  - grupa „Live-5-11” (id 201774856487831284) — potwierdzenie + przypomnienie
//    5.11 17:00 (automatyzacja w MailerLite, treści od Klaudiusza do 22.10),
//  - grupa „Checklista — lead magnet” (id 192331437972653709) — nowi zapisani
//    dostają checklistę (decyzja Klaudiusza). Istniejący subskrybent: upsert
//    tylko dokłada grupy, niczego nie traci, sekwencja się nie powtarza.
// Bez double opt-in (jak lista premierowa). Zabezpieczenia jak /api/ksiazka.
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { przepusc, zaDuzo } from '../../lib/ratelimit';

const GRUPY = ['201774856487831284', '192331437972653709']; // Live-5-11, Checklista (id grup nie są sekretem)
const KLUCZ_ML = import.meta.env.MAILERLITE_API_KEY;

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });
const tekst = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const czyMail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!(await przepusc('live', clientAddress))) return zaDuzo();
  if (!KLUCZ_ML) return json({ error: 'Zapis chwilowo niedostępny. Spróbuj za kilka minut.' }, 503);

  let b: any;
  try { b = await request.json(); } catch { return json({ error: 'Nieprawidłowe dane.' }, 400); }

  if (tekst(b.www, 200) !== '') return json({ ok: true }); // bot

  const email = tekst(b.email, 160).toLowerCase();
  const imie = tekst(b.imie, 80);
  if (!czyMail(email)) return json({ error: 'Sprawdź adres e-mail.' }, 400);
  if (b.zgoda !== true) return json({ error: 'Zaznacz zgodę — bez niej nie mogę wysłać linku do transmisji.' }, 400);

  const fields: Record<string, string> = {};
  if (imie) fields.name = imie;

  try {
    const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${KLUCZ_ML}` },
      body: JSON.stringify({ email, fields, groups: GRUPY }),
    });
    if (!r.ok) return json({ error: 'Nie udało się zapisać. Spróbuj jeszcze raz albo napisz na kontakt@michalbezstresu.pl.' }, 502);
  } catch {
    return json({ error: 'Nie udało się zapisać. Spróbuj jeszcze raz albo napisz na kontakt@michalbezstresu.pl.' }, 502);
  }
  return json({ ok: true });
};
