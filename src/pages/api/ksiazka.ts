// ============================================================================
// 📕 /api/ksiazka — zapis na listę premierową książki „Z obu stron stołu”
// ----------------------------------------------------------------------------
// 14.10.2026. Formularz na /ksiazka/ → MailerLite, grupa „Ksiazka-premiera”
// (id 201320469525169413). POST /subscribers to upsert: istniejący
// subskrybent newslettera dostaje tylko nową grupę, nic nie traci.
//
// Świadomie BEZ zapisu do newslettera („Checklista — lead magnet”): zapisujący
// się z /ksiazka/ prosił o informację o premierze, nie o cotygodniowe maile.
// Mail potwierdzający / strona premierowa w MailerLite — osobne zadanie (20.10).
//
// Zabezpieczenia jak w /api/firmy: pułapka na boty (`www`, musi zostać puste),
// twarde limity długości, wymagana zgoda. Bez Supabase — jedynym celem jest
// lista w MailerLite; jeśli MailerLite nie odpowie, mówimy to wprost.
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { przepusc, zaDuzo } from '../../lib/ratelimit';

const GRUPA = '201320469525169413'; // „Ksiazka-premiera” (id grupy nie jest sekretem)
// 2.11.2026: darmowy rozdział 1 (PDF) za zapis → grupa „Ksiazka-fragment” (automat w MailerLite).
const GRUPA_FRAGMENT = '203021825808008668';
const KLUCZ_ML = import.meta.env.MAILERLITE_API_KEY;

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });
const tekst = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const czyMail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!(await przepusc('ksiazka', clientAddress))) return zaDuzo();
  if (!KLUCZ_ML) return json({ error: 'Zapis chwilowo niedostępny. Spróbuj za kilka minut.' }, 503);

  let b: any;
  try { b = await request.json(); } catch { return json({ error: 'Nieprawidłowe dane.' }, 400); }

  if (tekst(b.www, 200) !== '') return json({ ok: true }); // bot

  const email = tekst(b.email, 160).toLowerCase();
  const imie = tekst(b.imie, 80);
  if (!czyMail(email)) return json({ error: 'Sprawdź adres e-mail.' }, 400);
  const fragment = b.cel === 'fragment';
  if (b.zgoda !== true) return json({ error: fragment ? 'Zaznacz zgodę — bez niej nie mogę wysłać rozdziału.' : 'Zaznacz zgodę — bez niej nie mogę wysłać informacji o premierze.' }, 400);

  const fields: Record<string, string> = {};
  if (imie) fields.name = imie;
  // 4.11.2026: dwa darmowe fragmenty (/rozdzial → 1, /rozdzial/podwyzka → 9). Pole MailerLite
  // `fragment` decyduje, który PDF wysyła mail D0 automatu „Ksiazka-fragment”.
  // UTM z adresu strony → pola utm_* (pomiar: reklama → zapis → sprzedaż).
  if (fragment) fields.fragment = b.fragment === '9' ? '9' : '1';
  const u = b.utm && typeof b.utm === 'object' ? b.utm : {};
  for (const k of ['source', 'campaign', 'content'] as const) {
    const v = tekst(u[k], 120);
    if (v) fields['utm_' + k] = v;
  }

  try {
    const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${KLUCZ_ML}` },
      body: JSON.stringify({ email, fields, groups: [fragment ? GRUPA_FRAGMENT : GRUPA] }),
    });
    if (!r.ok) return json({ error: 'Nie udało się zapisać. Spróbuj jeszcze raz albo napisz na kontakt@michalbezstresu.pl.' }, 502);
  } catch {
    return json({ error: 'Nie udało się zapisać. Spróbuj jeszcze raz albo napisz na kontakt@michalbezstresu.pl.' }, 502);
  }
  return json({ ok: true });
};
