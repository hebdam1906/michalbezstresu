// ============================================================================
// ❓ /api/pytanie — odbiór anonimowego pytania z formularza na /pytanie
// ----------------------------------------------------------------------------
// Ruch 2 z planu 25.09 („Zadaj pytanie”). Teksty: Klaudiusz,
// `Zadaj-pytanie_teksty-strony-i-polityki_dla-Marcina_25-09.md`.
// Zabezpieczenia jak w /api/konsultacje: limity długości, pole-pułapka `firma`,
// limit 3 wiadomości na godzinę z jednego (zahaszowanego) IP. Bez webhooka Make — patrz niżej.
// E-mail jest OPCJONALNY i celowo NIE trafia do MailerLite — polityka obiecuje,
// że pytający nie ląduje na żadnej liście.
// Zdarzenia Meta/Google: żadne (to nie jest lead ani Contact).
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';
import { createHash } from 'node:crypto';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

const hashIp = (ip: string) => createHash('sha256').update(`mbs:${ip}`).digest('hex').slice(0, 32);
const czyMail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!supabaseAdmin) return json({ error: 'Coś nie zadziałało. Spróbuj za chwilę albo napisz wprost: michal@michalbezstresu.pl.' }, 503);

  let b: any;
  try { b = await request.json(); } catch { return json({ error: 'Nieprawidłowe dane.' }, 400); }

  if (String(b.firma || '').trim() !== '') return json({ ok: true }); // pułapka na boty

  const tresc = String(b.tresc || '').trim();
  const email = String(b.email || '').trim().toLowerCase();
  const zgoda = b.zgoda === true;
  const zrodlo = String(b.zrodlo || '').trim().slice(0, 80) || null;

  if (tresc.length < 50) return json({ error: 'Napisz trochę więcej — przynajmniej dwa, trzy zdania, żebym rozumiał sytuację.' }, 400);
  if (tresc.length > 2000) return json({ error: 'To już cała historia — skróć do najważniejszego (do 2000 znaków).' }, 400);
  if (email && (!czyMail(email) || email.length > 160)) return json({ error: 'Sprawdź adres e-mail — albo zostaw to pole puste.' }, 400);
  if (!zgoda) return json({ error: 'Bez tej zgody nie mogę odpowiedzieć publicznie. Jeśli wolisz prywatnie, napisz na michal@michalbezstresu.pl.' }, 400);

  const ip_hash = hashIp(clientAddress || 'brak');
  const godzine_temu = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await supabaseAdmin
    .from('pytania').select('id', { count: 'exact', head: true })
    .eq('ip_hash', ip_hash).gte('utworzono', godzine_temu);
  if ((count ?? 0) >= 3) {
    return json({ error: 'Mam już od Ciebie kilka pytań — odpowiadam na jedno w tygodniu. Jeśli to pomyłka, napisz na michal@michalbezstresu.pl.' }, 429);
  }

  const { error } = await supabaseAdmin.from('pytania').insert({
    tresc, email: email || null, zgoda_publikacja: true, zrodlo, ip_hash,
  });
  if (error) return json({ error: 'Coś nie zadziałało. Spróbuj za chwilę albo napisz wprost: michal@michalbezstresu.pl.' }, 500);

  // BEZ powiadomienia przez webhook Make (25.09): scenariusz „MbS powiadomienie
  // o nowym zapytaniu” zna tylko typy konsultacje/firmy i wymaga e-maila —
  // pierwsze pytanie (test, bez e-maila) zatrzymało go na błędzie, a z nim
  // powiadomienia o konsultacjach. Na pytania odpowiadamy raz w tygodniu,
  // więc wystarczy lista w panelu. Wrócić do tego, jeśli scenariusz dostanie gałąź „pytanie”.
  return json({ ok: true });
};
