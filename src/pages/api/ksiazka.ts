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

const GRUPA = '201320469525169413'; // „Ksiazka-premiera” (id grupy nie jest sekretem)
const KLUCZ_ML = import.meta.env.MAILERLITE_API_KEY;

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });
const tekst = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const czyMail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export const POST: APIRoute = async ({ request }) => {
  if (!KLUCZ_ML) return json({ error: 'Zapis chwilowo niedostępny. Spróbuj za kilka minut.' }, 503);

  let b: any;
  try { b = await request.json(); } catch { return json({ error: 'Nieprawidłowe dane.' }, 400); }

  if (tekst(b.www, 200) !== '') return json({ ok: true }); // bot

  const email = tekst(b.email, 160).toLowerCase();
  const imie = tekst(b.imie, 80);
  if (!czyMail(email)) return json({ error: 'Sprawdź adres e-mail.' }, 400);
  if (b.zgoda !== true) return json({ error: 'Zaznacz zgodę — bez niej nie mogę wysłać informacji o premierze.' }, 400);

  const fields: Record<string, string> = {};
  if (imie) fields.name = imie;

  try {
    const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${KLUCZ_ML}` },
      body: JSON.stringify({ email, fields, groups: [GRUPA] }),
    });
    if (!r.ok) return json({ error: 'Nie udało się zapisać. Spróbuj jeszcze raz albo napisz na kontakt@michalbezstresu.pl.' }, 502);
  } catch {
    return json({ error: 'Nie udało się zapisać. Spróbuj jeszcze raz albo napisz na kontakt@michalbezstresu.pl.' }, 502);
  }
  return json({ ok: true });
};
