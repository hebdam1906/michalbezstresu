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
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';
import { createHash } from 'node:crypto';

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
  if (!supabaseAdmin) return json({ error: 'Formularz chwilowo niedostępny.' }, 503);

  let b: any;
  try { b = await request.json(); } catch { return json({ error: 'Nieprawidłowe dane.' }, 400); }

  // Pułapka na boty. NIE `firma` — patrz komentarz na górze pliku.
  if (tekst(b.www, 200) !== '') return json({ ok: true });

  const imie = tekst(b.imie, 80);
  const firma = tekst(b.firma, 120);
  const email = tekst(b.email, 160).toLowerCase();
  const stanowisko = tekst(b.stanowisko, 120) || null;
  const termin = tekst(b.termin, 120) || null;
  const wiadomosc = tekst(b.wiadomosc, 4000);
  const zgoda = b.zgoda === true;

  if (imie.length < 2) return json({ error: 'Podaj imię i nazwisko.' }, 400);
  if (firma.length < 2) return json({ error: 'Podaj nazwę firmy.' }, 400);
  if (!czyMail(email)) return json({ error: 'Sprawdź adres e-mail.' }, 400);
  if (wiadomosc.length < 20) return json({ error: 'Napisz dwa, trzy zdania o tym, czego potrzebujecie — inaczej nie przygotuję sensownej propozycji.' }, 400);
  if (!zgoda) return json({ error: 'Bez zgody na kontakt nie mogę odpisać.' }, 400);

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
    return json({ error: 'Dostałem już od Was kilka wiadomości — odpiszę na pierwszą. Jeśli to pomyłka, napiszcie wprost na kontakt@michalbezstresu.pl.' }, 429);
  }

  const atr = atrybucja(b.atrybucja);
  const { error } = await supabaseAdmin.from('firmy_zapytania').insert({
    imie, firma, email, stanowisko, wielkosc_grupy, tematy, termin, wiadomosc,
    skad_wiesz, ip_hash, ...atr,
    atrybucja: b.atrybucja && typeof b.atrybucja === 'object' ? b.atrybucja : null,
  });
  if (error) {
    return json({ error: 'Nie udało się zapisać zapytania. Napiszcie proszę wprost na kontakt@michalbezstresu.pl.' }, 500);
  }

  // Autoodpowiedź: dopisujemy do grupy, resztę robi automatyzacja w MailerLite.
  // Grupa jest transakcyjna — nie jest newsletterem i nie miesza się z checklistą.
  if (KLUCZ_ML && GRUPA_ML) {
    try {
      await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KLUCZ_ML}` },
        body: JSON.stringify({ email, fields: { name: imie, company: firma }, groups: [GRUPA_ML] }),
      });
    } catch { /* zapytanie jest w bazie — to wystarczy */ }
  }

  return json({ ok: true });
};
