// ============================================================================
// 📨 /api/konsultacje — odbiór zapytania z formularza na /konsultacje
// ----------------------------------------------------------------------------
// PUBLICZNY endpoint (bez logowania) — jedyny taki w projekcie. Stąd trzy
// zabezpieczenia, których nie ma w /api/panel/*:
//   1. twarde limity długości pól,
//   2. pole-pułapka `firma` (honeypot) — boty je wypełniają, ludzie nie widzą,
//   3. prosty limit: to samo IP nie wyśle więcej niż 3 zapytań na godzinę.
//
// Zapytanie ląduje w Supabase (nic nie ginie), a osobie pytającej autoodpowiedź
// wysyła MailerLite — dlatego dopisujemy ją też do grupy „Konsultacje".
// Jeśli MailerLite się nie uda, zapytanie i tak jest zapisane: to jest droga
// główna, tamto dodatek.
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';
import { createHash } from 'node:crypto';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

const GRUPA_ML = import.meta.env.MAILERLITE_GRUPA_KONSULTACJE; // id grupy w MailerLite
const KLUCZ_ML = import.meta.env.MAILERLITE_API_KEY;

/** Skrót IP, nie samo IP — do wyłapania zalewu, bez trzymania adresu. */
function hashIp(ip: string) {
  return createHash('sha256').update(`mbs:${ip}`).digest('hex').slice(0, 32);
}

function czyMail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!supabaseAdmin) return json({ error: 'Formularz chwilowo niedostępny.' }, 503);

  let b: any;
  try { b = await request.json(); } catch { return json({ error: 'Nieprawidłowe dane.' }, 400); }

  // 2. Pułapka na boty — pole ukryte w CSS. Człowiek go nie wypełni.
  if (String(b.firma || '').trim() !== '') return json({ ok: true });

  const imie = String(b.imie || '').trim();
  const email = String(b.email || '').trim().toLowerCase();
  const sytuacja = String(b.sytuacja || '').trim();
  const kod = String(b.kod || '').trim().slice(0, 40) || null;
  const zgoda = b.zgoda === true;

  /* „Skąd o mnie wiesz?" — pole wymagane w formularzu (atrybut required),
     ale tutaj celowo NIE blokuje wysyłki: gdyby ktoś miał w cache starszą
     wersję strony albo wybór nie doszedł, wolimy stracić tę jedną daną niż
     całe zapytanie o konsultację. Wartość spoza listy traktujemy jak brak. */
  const SKAD_DOZWOLONE = ['youtube', 'newsletter', 'grupa-fb', 'polecenie', 'reklama', 'inne'];
  const skad = String(b.skad || '').trim();
  const skadInne = String(b.skad_inne || '').trim().slice(0, 120);
  const skad_wiesz = SKAD_DOZWOLONE.includes(skad)
    ? (skad === 'inne' && skadInne ? `inne: ${skadInne}` : skad)
    : null;

  if (imie.length < 2 || imie.length > 80) return json({ error: 'Podaj imię (2–80 znaków).' }, 400);
  if (!czyMail(email) || email.length > 160) return json({ error: 'Sprawdź adres e-mail.' }, 400);
  if (sytuacja.length < 20) return json({ error: 'Napisz dwa, trzy zdania o sytuacji — inaczej nie będę wiedział, czy mogę pomóc.' }, 400);
  if (sytuacja.length > 4000) return json({ error: 'To już cała historia — skróć do najważniejszego, resztę omówimy na rozmowie.' }, 400);
  if (!zgoda) return json({ error: 'Bez zgody na kontakt nie mogę odpisać.' }, 400);

  const ip_hash = hashIp(clientAddress || 'brak');

  // 3. Limit: 3 zapytania na godzinę z jednego adresu.
  const godzine_temu = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await supabaseAdmin
    .from('konsultacje_zapytania')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ip_hash)
    .gte('utworzono', godzine_temu);
  if ((count ?? 0) >= 3) {
    return json({ error: 'Dostałem już od Ciebie kilka wiadomości — odpiszę na pierwszą. Jeśli to pomyłka, napisz wprost na michal@michalbezstresu.pl.' }, 429);
  }

  const { error } = await supabaseAdmin.from('konsultacje_zapytania').insert({
    imie, email, sytuacja, kod_rabatowy: kod, ip_hash, skad_wiesz,
    zrodlo: String(b.zrodlo || '').slice(0, 200) || null,
  });
  if (error) return json({ error: 'Nie udało się zapisać zapytania. Napisz proszę wprost na michal@michalbezstresu.pl.' }, 500);

  // Autoodpowiedź leci z MailerLite — my tylko dopisujemy osobę do grupy.
  // Celowo bez `await` na wyniku decydującym o odpowiedzi: jak padnie, trudno.
  if (KLUCZ_ML && GRUPA_ML) {
    try {
      await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KLUCZ_ML}` },
        body: JSON.stringify({ email, fields: { name: imie }, groups: [GRUPA_ML] }),
      });
    } catch { /* zapytanie jest już w bazie — to wystarczy */ }
  }

  return json({ ok: true });
};
