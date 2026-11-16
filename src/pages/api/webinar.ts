// ============================================================================
// 🔴 /api/webinar — zapis na webinar 3.12.2026, 19:00 „Ocena roczna”
// ----------------------------------------------------------------------------
// 16.11.2026 (brief Klaudiusza 13.11, teksty 14.11). Formularz na /webinar/ →
// MailerLite: grupa „Webinar-03-12” (204293884463809708) — potwierdzenie
// i przypomnienia (automatyzacja + kampanie), oraz „Checklista — lead magnet”
// (192331437972653709) jak na /live/. Upsert: istniejący subskrybent tylko
// dostaje grupy. Zabezpieczenia jak /api/live.
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { przepusc, zaDuzo } from '../../lib/ratelimit';

const GRUPY = ['204293884463809708', '192331437972653709']; // Webinar-03-12, Checklista
const KLUCZ_ML = import.meta.env.MAILERLITE_API_KEY;

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });
const tekst = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const czyMail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!(await przepusc('webinar', clientAddress))) return zaDuzo();
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
