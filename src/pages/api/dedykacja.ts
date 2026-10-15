// ============================================================================
// ✍️ POST /api/dedykacja/ — PDF z imienną dedykacją (lista premierowa)
// ----------------------------------------------------------------------------
// 15.10.2026. Woła go scenariusz Make po webhooku EasyCart (zakup e-booka).
// Autoryzacja: `Authorization: Bearer $PANEL_API_KEY` (ten sam klucz co panel).
// Body JSON: { email, imie?, zamowienie, data? (ISO) }
// Zasady (Klaudiusz/Michał 15.10):
//   • e-mail był w grupie „Ksiazka-premiera” przed 2.11 → zrzut w premiera_lista,
//   • zakup 2–8.11.2026 (czas PL),
//   • jedno zamówienie = jeden PDF (dedykacje_log).
// Odpowiedź: 200 + application/pdf (Make wysyła mail z Zoho) albo 204 + nagłówek
// X-Dedykacja-Powod (nie wysyłamy nic). Imię: z body albo z zrzutu listy.
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';
import { isAuthorized } from '../../lib/panel-auth';
import { normalizujImie, pdfZDedykacja } from '../../lib/dedykacja';

const OD = Date.parse('2026-11-02T00:00:00+01:00');
const DO = Date.parse('2026-11-09T00:00:00+01:00');

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });
const nic = (powod: string) => new Response(null, { status: 204, headers: { 'X-Dedykacja-Powod': powod } });

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthorized(request, cookies).ok) return json({ error: 'Brak autoryzacji' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak Supabase' }, 503);

  let b: any;
  try { b = await request.json(); } catch { return json({ error: 'Nieprawidłowe dane' }, 400); }
  const email = String(b.email || '').trim().toLowerCase().slice(0, 160);
  const zamowienie = String(b.zamowienie || '').trim().slice(0, 120);
  const test = b.test === true; // test: pomija datę i log (tylko do sprawdzania wyglądu)
  if (!email || !zamowienie) return json({ error: 'Wymagane: email, zamowienie' }, 400);

  const kiedy = b.data ? Date.parse(String(b.data)) : Date.now();
  if (!test && !(kiedy >= OD && kiedy < DO)) return nic('poza-okresem');

  const { data: osoba } = await supabaseAdmin.from('premiera_lista').select('email, imie').eq('email', email).maybeSingle();
  if (!osoba && !test) return nic('nie-na-liscie');

  if (!test) {
    const { data: byl } = await supabaseAdmin.from('dedykacje_log').select('id').eq('zamowienie', zamowienie).maybeSingle();
    if (byl) return nic('juz-wyslano');
  }

  const imie = normalizujImie(b.imie) ?? normalizujImie(osoba?.imie);
  let pdf: Uint8Array;
  try { pdf = await pdfZDedykacja(imie); }
  catch (e: any) { return json({ error: 'Nie udało się wygenerować PDF', szczegoly: String(e?.message || e).slice(0, 200) }, 500); }

  if (!test) {
    await supabaseAdmin.from('dedykacje_log').insert({ zamowienie, email, imie_uzyte: imie, wynik: 'wygenerowano' });
  }
  return new Response(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Z-obu-stron-stolu_z-dedykacja.pdf"',
      'X-Dedykacja-Imie': encodeURIComponent(imie ?? ''),
    },
  });
};
