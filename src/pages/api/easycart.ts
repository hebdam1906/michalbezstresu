// ============================================================================
// 🛒 POST /api/easycart/?k=… — webhook EasyCart (zakup e-booka)
// ----------------------------------------------------------------------------
// 15.10.2026. Ustawiony w EasyCart → produkt „Z obu stron stołu” → Automations
// → Webhook. Klucz w adresie (?k=) = sekret „easycart_hook_key” (Supabase).
// 1. Każde zdarzenie ląduje surowe w `easycart_zdarzenia` (log + lista do
//    losowania 16.11: kolumna zgoda_konkurs).
// 2. Przy zakupie (product_assigned / single_product_bought) sprawdzamy prawo
//    do dedykacji (lib/dedykacja: okno 2–8.11, lista premierowa, jeden PDF na
//    zamówienie). Jeśli tak: PDF → prywatny bucket → link ważny rok →
//    scenariusz Make (sekret „make_dedykacja_hook”) wysyła mail z Zoho (michal@).
// Struktura payloadu EasyCart nie jest udokumentowana co do pola, więc pola
// wyciągamy odpornie (szukamy po nazwach w całym JSON-ie); surowy JSON zostaje.
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase';
import { przygotujDedykacje } from '../../lib/dedykacja';

/** Sekrety trzymamy w Supabase (prywatne.sekrety, funkcja sekret() tylko dla service_role). */
async function sekret(nazwa: string): Promise<string | null> {
  const { data } = await supabaseAdmin!.rpc('sekret', { p_nazwa: nazwa });
  return typeof data === 'string' && data ? data : null;
}

/** Plan B: linki do plików z naszego storage, gdy EasyCart nie dostarcza plików. */
const PLIKI_PLANB = [
  { nazwa: 'Z-obu-stron-stolu_Michal-Hebda.epub', sciezka: 'ksiazka-final.epub' },
  { nazwa: 'Z-obu-stron-stolu_Michal-Hebda.pdf', sciezka: 'ksiazka-final.pdf' },
];
async function planB(a: { email: string; imie: string; zamowienie: string; idLog?: number }) {
  const { data: flaga } = await supabaseAdmin!.from('przelaczniki').select('wlaczone').eq('nazwa', 'planb_wysylka').maybeSingle();
  if (!flaga?.wlaczone) return;
  const oznacz = (w: string) => a.idLog ? supabaseAdmin!.from('easycart_zdarzenia').update({ planb: w }).eq('id', a.idLog) : null;
  const linki: Record<string, string> = {};
  for (const f of PLIKI_PLANB) {
    const { data, error } = await supabaseAdmin!.storage.from('ksiazka-prywatne').createSignedUrl(f.sciezka, 60 * 60 * 24 * 7, { download: f.nazwa });
    if (error || !data?.signedUrl) { await oznacz('blad-linku:' + f.sciezka); return; }
    linki[f.sciezka.endsWith('.epub') ? 'link_epub' : 'link_pdf'] = data.signedUrl;
  }
  const hook = await sekret('make_planb_hook');
  if (!hook) { await oznacz('brak-hooka'); return; }
  const r = await fetch(hook, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: a.email, imie: a.imie.split(/\s+/)[0] ?? '', zamowienie: a.zamowienie, ...linki }),
  }).catch(() => null);
  await oznacz(r && r.ok ? 'wyslano-do-make' : 'blad-make');
}

const PRODUKT_ID = '85908319-6f76-4a7f-aa3b-6c7b15640eb6';
const ok = (b: unknown = { ok: true }) =>
  new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });

/** Pierwsza wartość pola o jednej z nazw (szukanie w głąb). */
function znajdz(o: any, nazwy: string[], gl = 0): any {
  if (!o || typeof o !== 'object' || gl > 6) return undefined;
  for (const n of nazwy) if (o[n] !== undefined && o[n] !== null && o[n] !== '') return o[n];
  for (const v of Object.values(o)) {
    const w = znajdz(v, nazwy, gl + 1);
    if (w !== undefined) return w;
  }
  return undefined;
}

function zgodaKonkurs(o: any): boolean | null {
  const s = JSON.stringify(o).toLowerCase();
  const m = s.match(/"optional[_ ]?consent[a-z_]*"\s*:\s*(true|false)/);
  if (m) return m[1] === 'true';
  return /losowani/.test(s) ? true : null;
}

export const POST: APIRoute = async ({ request, url }) => {
  if (!supabaseAdmin) return new Response(null, { status: 503 });
  const klucz = await sekret('easycart_hook_key');
  if (!klucz || url.searchParams.get('k') !== klucz) return new Response(null, { status: 401 });

  let p: any;
  try { p = JSON.parse((await request.text()).slice(0, 200_000)); } catch { return new Response(null, { status: 400 }); }

  const zdarzenie = String(znajdz(p, ['event', 'type', 'event_type', 'eventName']) ?? '');
  const email = String(znajdz(p, ['customer_email', 'email', 'buyer_email']) ?? '').toLowerCase().trim();
  const imie = String(znajdz(p, ['customer_first_name', 'first_name', 'firstName', 'customer_name', 'name', 'full_name']) ?? '');
  const zamowienie = String(znajdz(p, ['order_id', 'orderId', 'transaction_id', 'checkout_session_id', 'id']) ?? '');
  const produktId = String(znajdz(p, ['product_id', 'productId']) ?? '');
  const produkt = String(znajdz(p, ['product_name', 'productName']) ?? produktId);
  const data = String(znajdz(p, ['created_at', 'paid_at', 'date', 'createdAt']) ?? '');

  const zapis = await supabaseAdmin.from('easycart_zdarzenia').insert({
    zdarzenie, zamowienie, email, imie, produkt, zgoda_konkurs: zgodaKonkurs(p), surowe: p,
  }).select('id').single();
  const idLog = zapis.data?.id;

  const zakup = /product_assigned|single_product_bought|order/i.test(zdarzenie) || !zdarzenie;
  const toEbook = !produktId || produktId === PRODUKT_ID || /obu stron/i.test(produkt);
  if (!zakup || !toEbook || !email || !zamowienie) return ok({ ok: true, dedykacja: 'pominieto' });

  // PLAN B (21.10.2026): jeśli pobieranie z EasyCart nie działa, przełącznik `planb_wysylka`
  // (tabela przelaczniki) włącza wysyłkę linków do EPUB i PDF z naszego bucketu, ważnych 7 dni,
  // przez scenariusz Make (sekret „make_planb_hook”) → mail z Zoho (michal@). Domyślnie WYŁĄCZONE.
  // Błąd planu B nie blokuje dedykacji niżej.
  try { await planB({ email, imie, zamowienie, idLog }); } catch { /* log niżej */ }

  const w = await przygotujDedykacje({ email, imie, zamowienie, data: data || undefined });
  if (idLog) await supabaseAdmin.from('easycart_zdarzenia').update({ dedykacja: w.powod }).eq('id', idLog);
  if (!w.pdf) return ok({ ok: true, dedykacja: w.powod });

  const sciezka = `dedykacje/${zamowienie.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  const up = await supabaseAdmin.storage.from('ksiazka-prywatne').upload(sciezka, w.pdf, { contentType: 'application/pdf', upsert: true });
  if (up.error) return ok({ ok: false, dedykacja: 'blad-zapisu' });
  const { data: link } = await supabaseAdmin.storage.from('ksiazka-prywatne').createSignedUrl(sciezka, 60 * 60 * 24 * 365);

  const hook = await sekret('make_dedykacja_hook');
  if (hook && link?.signedUrl) {
    await fetch(hook, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, imie: w.imie ?? '', link: link.signedUrl, zamowienie }),
    }).catch(() => {});
  }
  return ok({ ok: true, dedykacja: 'wyslano-do-make' });
};
