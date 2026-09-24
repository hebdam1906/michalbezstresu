// ============================================================================
// 🏢 /api/firmy — odbiór zapytania o warsztaty ze strony /dla-firm
// ----------------------------------------------------------------------------
// Drugi (po /api/konsultacje) publiczny endpoint w projekcie. Zabezpieczenia te
// same: twarde limity długości, pułapka na boty i limit zapytań z jednego IP.
//
// ⚠️ UWAGA, KTÓRA JUŻ RAZ O MAŁO NIE KOSZTOWAŁA NAS WSZYSTKICH LEADÓW:
// w /api/konsultacje pułapką na boty jest pole o nazwie `firma`. Tutaj `firma`
// to REALNE, WYMAGANE pole formularza — dyrektor HR wpisuje w nie nazwę swojej
// firmy. Gdyby ktoś skopiował tamten wzorzec, każde zapytanie firmowe zostałoby
// uznane za bota, wyrzucone do kosza, a nadawca zobaczyłby „wysłano".
// Pułapka nazywa się tu `www` i MUSI zostać pusta.
//
// Zapytanie ląduje w Supabase (tabela `firmy_zapytania`) — to jest droga główna
// i ona decyduje o odpowiedzi. Autoodpowiedź wysyła MailerLite z osobnej grupy
// „Firmy — zapytania"; grupa jest transakcyjna, nie newsletterowa (patrz
// update-32 do Klaudiusza). Jak MailerLite padnie, zapytanie i tak jest zapisane.
//
// 🇬🇧 JĘZYK (24.09.2026): ten sam endpoint obsługuje polski formularz z /dla-firm
// i angielski z /en/contact. Formularz EN wysyła `jezyk: 'en'` i wtedy:
//   • komunikaty błędów wracają PO ANGIELSKU — inaczej Brytyjczyk dostaje
//     „Podaj nazwę firmy" i nie wie, co poprawić,
//   • POMIJAMY MailerLite. Automatyzacja w grupie „Firmy — zapytania" wysyła
//     polską autoodpowiedź; wysłanie jej anglojęzycznej osobie wyglądałoby
//     gorzej niż brak odpowiedzi. Decyzja Michała z 24.09: na razie bez
//     autorespondera EN, Michał odpisuje osobiście (tak mówi strona
//     podziękowania /en/thank-you).
//   • język leci do powiadomienia i do `atrybucja.jezyk`, żeby było widać
//     w bazie, w jakim języku odpisać.
// Gdyby kiedyś powstała grupa „Firmy — zapytania EN" z angielskim automatem,
// wystarczy podać jej id w `MAILERLITE_GRUPA_FIRMY_EN` i odkomentować gałąź niżej.
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';
import { createHash } from 'node:crypto';

import { powiadom } from '../../lib/powiadom';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

const GRUPA_ML = import.meta.env.MAILERLITE_GRUPA_FIRMY; // id grupy „Firmy — zapytania"
const KLUCZ_ML = import.meta.env.MAILERLITE_API_KEY;

function hashIp(ip: string) {
  return createHash('sha256').update(`mbs:${ip}`).digest('hex').slice(0, 32);
}
function czyMail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}
const tekst = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

/* Komunikaty w dwóch językach. Klucz jest po polsku, bo polski formularz był
   pierwszy i jest głównym. `m(jezyk).klucz` zwraca gotowy tekst. */
const KOMUNIKATY = {
  pl: {
    niedostepny: 'Formularz chwilowo niedostępny.',
    zledane: 'Nieprawidłowe dane.',
    imie: 'Podaj imię i nazwisko.',
    firma: 'Podaj nazwę firmy.',
    email: 'Sprawdź adres e-mail.',
    wiadomosc: 'Napisz dwa, trzy zdania o tym, czego potrzebujecie — inaczej nie przygotuję sensownej propozycji.',
    zgoda: 'Bez zgody na kontakt nie mogę odpisać.',
    limit: 'Dostałem już od Was kilka wiadomości — odpiszę na pierwszą. Jeśli to pomyłka, napiszcie wprost na kontakt@michalbezstresu.pl.',
    zapis: 'Nie udało się zapisać zapytania. Napiszcie proszę wprost na kontakt@michalbezstresu.pl.',
  },
  en: {
    niedostepny: 'The form is temporarily unavailable.',
    zledane: 'Invalid data.',
    imie: 'Please give your full name.',
    firma: 'Please give your company name.',
    email: 'Please check the email address.',
    wiadomosc: 'Two or three sentences about what you need — without them I cannot put together a sensible proposal.',
    zgoda: 'Without your consent to be contacted I cannot reply.',
    limit: 'I have already received a few messages from you — I will reply to the first one. If this is a mistake, write to me directly at kontakt@michalbezstresu.pl.',
    zapis: 'Saving your enquiry failed. Please write to me directly at kontakt@michalbezstresu.pl.',
  },
} as const;
const m = (j: 'pl' | 'en') => KOMUNIKATY[j];

/* Listy wartości. Cokolwiek spoza listy traktujemy jak brak — nie blokujemy
   przez to zapytania, bo strata jednej danej jest tańsza niż stracony lead. */
const WIELKOSC = ['do-10', '10-20', '20-50', 'powyzej-50', 'nie-wiem'];
const TEMATY = ['trudne-rozmowy', 'ocena-feedback', 'rozmowy-1-1', 'inne'];
// ⚠️ Ta sama lista co w /api/konsultacje — Checkpoint 31.10 liczy oba formularze razem.
const SKAD = ['youtube', 'newsletter', 'grupa-fb', 'polecenie', 'reklama', 'inne'];

/** Atrybucja z przeglądarki: bierzemy tylko znane pola i ucinamy długość. */
function atrybucja(a: any) {
  const p = (k: string, max = 300) => (a && a[k] ? String(a[k]).trim().slice(0, max) : null);
  return {
    utm_source: p('utm_source', 120),
    utm_medium: p('utm_medium', 120),
    utm_campaign: p('utm_campaign', 200),
    utm_content: p('utm_content', 200),
    utm_term: p('utm_term', 200),
    gclid: p('gclid', 200),
    fbclid: p('fbclid', 200),
    referrer: p('referrer', 500),
    strona_wejscia: p('strona_wejscia', 300),
  };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // Tu jeszcze nie znamy języka (body nieodczytane), więc komunikat jest dwujęzyczny.
  if (!supabaseAdmin) {
    return json({ error: 'Formularz chwilowo niedostępny. · The form is temporarily unavailable.' }, 503);
  }

  let b: any;
  try { b = await request.json(); } catch {
    return json({ error: 'Nieprawidłowe dane. · Invalid data.' }, 400);
  }

  // Pułapka na boty. NIE `firma` — patrz komentarz na górze pliku.
  if (tekst(b.www, 200) !== '') return json({ ok: true });

  // Język formularza. Wszystko poza 'en' traktujemy jak polski.
  const jezyk: 'pl' | 'en' = tekst(b.jezyk, 2).toLowerCase() === 'en' ? 'en' : 'pl';
  const k = m(jezyk);

  const imie = tekst(b.imie, 80);
  const firma = tekst(b.firma, 120);
  const email = tekst(b.email, 160).toLowerCase();
  const stanowisko = tekst(b.stanowisko, 120) || null;
  const termin = tekst(b.termin, 120) || null;
  const wiadomosc = tekst(b.wiadomosc, 4000);
  const zgoda = b.zgoda === true;

  if (imie.length < 2) return json({ error: k.imie }, 400);
  if (firma.length < 2) return json({ error: k.firma }, 400);
  if (!czyMail(email)) return json({ error: k.email }, 400);
  if (wiadomosc.length < 20) return json({ error: k.wiadomosc }, 400);
  if (!zgoda) return json({ error: k.zgoda }, 400);

  const wielkosc_grupy = WIELKOSC.includes(tekst(b.wielkosc_grupy, 40)) ? tekst(b.wielkosc_grupy, 40) : null;
  const tematy = Array.isArray(b.tematy)
    ? [...new Set(b.tematy.map((t: unknown) => tekst(t, 40)).filter((t: string) => TEMATY.includes(t)))]
    : [];
  const skadWybor = tekst(b.skad, 40);
  const skadInne = tekst(b.skad_inne, 120);
  const skad_wiesz = SKAD.includes(skadWybor)
    ? (skadWybor === 'inne' && skadInne ? `inne: ${skadInne}` : skadWybor)
    : null;

  const ip_hash = hashIp(clientAddress || 'brak');

  // Limit: 3 zapytania na godzinę z jednego adresu.
  const godzine_temu = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await supabaseAdmin
    .from('firmy_zapytania')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ip_hash)
    .gte('utworzono', godzine_temu);
  if ((count ?? 0) >= 3) {
    return json({ error: k.limit }, 429);
  }

  const atr = atrybucja(b.atrybucja);
  const { error } = await supabaseAdmin.from('firmy_zapytania').insert({
    imie, firma, email, stanowisko, wielkosc_grupy, tematy, termin, wiadomosc,
    skad_wiesz, ip_hash, ...atr,
    /* `jezyk` wchodzi do JSON-a atrybucji, a nie osobną kolumną — nie wymaga
       migracji tabeli, a w Supabase widać go w `atrybucja->>jezyk`. */
    atrybucja: { ...(b.atrybucja && typeof b.atrybucja === 'object' ? b.atrybucja : {}), jezyk },
  });
  if (error) {
    return json({ error: k.zapis }, 500);
  }

  // Autoodpowiedź: dopisujemy do grupy, resztę robi automatyzacja w MailerLite.
  // Grupa jest transakcyjna — nie jest newsletterem i nie miesza się z checklistą.
  // ⚠️ TYLKO PL. Automatyzacja w tej grupie wysyła polską autoodpowiedź — patrz
  // komentarz o języku na górze pliku. Dla EN świadomie nie robimy nic.
  if (jezyk === 'pl' && KLUCZ_ML && GRUPA_ML) {
    try {
      await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KLUCZ_ML}` },
        body: JSON.stringify({ email, fields: { name: imie, company: firma }, groups: [GRUPA_ML] }),
      });
    } catch { /* zapytanie jest w bazie — to wystarczy */ }
  }

  // Sygnał do Michała — patrz komentarz w src/lib/powiadom.ts.
  await powiadom({
    typ: 'firmy',
    imie,
    email,
    tresc: wiadomosc,
    extra: { firma, stanowisko, wielkosc_grupy, tematy, termin, skad_wiesz, jezyk },
  });

  return json({ ok: true });
};
