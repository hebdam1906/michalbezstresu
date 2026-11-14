// ============================================================================
// 📕 src/lib/sprzedaz.ts — sprzedaż książki (2.11.2026)
// ----------------------------------------------------------------------------
// Źródło: `easycart_zdarzenia` (webhook /api/easycart/).
//  • zakup  = zdarzenie `single_product_bought` (jedno na zamówienie;
//             `product_assigned` przychodzi do tego samego zamówienia i jest pomijane)
//  • zwrot  = `product_access_expired` dla zamówienia książki (tak EasyCart
//             zgłosił zwrot testu 1544088). Zwrócone zamówienia nie liczą się.
//  • testy  = zamówienia sprzed startu sprzedaży, z listy TESTY albo z numerem
//             zaczynającym się od „TEST”.
// Używane przez /api/panel/sprzedaz (kafelek w panelu) i webhook (push ntfy).
// ============================================================================
import { supabaseAdmin } from './supabase';

export const START_SPRZEDAZY = '2026-11-02T06:16:00Z'; // 2.11, 7:16 PL
export const TESTY = new Set(['1544088']);
export const CELE = [
  { data: '2026-11-08', ebooki: 18 },
  { data: '2026-11-15', ebooki: 30 },
];
/* Plan Tornado (14.11.2026, decyzja Michała): cele liczone od 16.11 ze WSZYSTKICH kanałów
   (EasyCart: każdy rodzaj książki + ręczne pola Empik i Amazon PL z panel_sprzedaz_reczna). */
export const TORNADO_START = '2026-11-15T23:00:00Z'; // 16.11.2026 00:00 Warszawa
export const CELE_TORNADO = [
  { data: '2026-11-30', egz: 50 },
  { data: '2026-12-17', egz: 150 },
];
export const KANALY_RECZNE = ['empik', 'amazon_pl'] as const;
export type KanalReczny = (typeof KANALY_RECZNE)[number];

export async function sprzedazReczna(): Promise<Record<KanalReczny, number>> {
  const out: Record<KanalReczny, number> = { empik: 0, amazon_pl: 0 };
  if (!supabaseAdmin) return out;
  const { data, error } = await supabaseAdmin.from('panel_sprzedaz_reczna').select('kanal, sztuki');
  if (error) throw new Error(error.message);
  for (const r of data ?? []) if ((KANALY_RECZNE as readonly string[]).includes(r.kanal)) out[r.kanal as KanalReczny] = Number(r.sztuki) || 0;
  return out;
}

export const toKsiazka = (produkt: string) => /obu stron|stołu|stolu/i.test(produkt || '');
export const toTest = (zamowienie: string, odebrano?: string) =>
  TESTY.has(zamowienie) || /^test/i.test(zamowienie) || (!!odebrano && odebrano < START_SPRZEDAZY);

export type Rodzaj = 'ebook' | 'druk' | 'druk_ebook' | 'bf';
export function rodzaj(produkt: string): Rodzaj {
  const p = (produkt || '').toLowerCase();
  if (/black ?friday|\bbf\b|prezent/.test(p)) return 'bf';
  const druk = /druk|papier|egzemplarz/.test(p);
  const ebook = /ebook|e-book|epub|pdf/.test(p);
  if (druk && ebook) return 'druk_ebook';
  if (druk) return 'druk';
  return 'ebook';
}
export const RODZAJ_NAZWA: Record<Rodzaj, string> = {
  ebook: 'e-book', druk: 'druk z dedykacją', druk_ebook: 'druk + e-book', bf: 'Black Friday',
};

/** Data YYYY-MM-DD w strefie Europe/Warsaw. */
export const dzienPL = (iso: string | Date) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw' }).format(new Date(iso));
export const godzinaPL = (iso: string) =>
  new Intl.DateTimeFormat('pl-PL', { timeZone: 'Europe/Warsaw', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export interface Zakup {
  zamowienie: string; produkt: string; rodzaj: Rodzaj; kwota: number;
  zrodlo: string; kiedy: string; zwrot: boolean;
}

function zrodlo(surowe: any): string {
  const c = surowe?.custom_params ?? {};
  const s = c.utm_source || c.source;
  const m = c.utm_medium;
  if (!s) return 'bezpośrednio';
  return m ? `${s}/${m}` : String(s);
}

/** Wszystkie prawdziwe zakupy książki (bez testów), z oznaczeniem zwrotów. */
export async function zakupyKsiazki(): Promise<Zakup[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from('easycart_zdarzenia')
    .select('odebrano, zdarzenie, zamowienie, produkt, surowe')
    .in('zdarzenie', ['single_product_bought', 'product_access_expired'])
    .gte('odebrano', START_SPRZEDAZY)
    .order('odebrano', { ascending: true });
  if (error) throw new Error(error.message);
  const zwroty = new Set(
    (data ?? []).filter((z) => z.zdarzenie === 'product_access_expired').map((z) => String(z.zamowienie)),
  );
  const widziane = new Set<string>();
  const wynik: Zakup[] = [];
  for (const z of data ?? []) {
    const nr = String(z.zamowienie ?? '');
    if (z.zdarzenie !== 'single_product_bought' || !nr || widziane.has(nr)) continue;
    if (!toKsiazka(z.produkt) || toTest(nr, z.odebrano)) continue;
    widziane.add(nr);
    const s: any = z.surowe ?? {};
    wynik.push({
      zamowienie: nr,
      produkt: z.produkt,
      rodzaj: rodzaj(z.produkt),
      kwota: Number(s.amount_paid ?? s.order_amount ?? 0) || 0,
      zrodlo: zrodlo(s),
      kiedy: z.odebrano,
      zwrot: zwroty.has(nr),
    });
  }
  return wynik;
}

/** Podsumowanie do kafelka w panelu. */
export async function podsumowanieSprzedazy() {
  const zakupy = (await zakupyKsiazki()).filter((z) => !z.zwrot);
  const dzis = dzienPL(new Date());
  const naRodzaj: Record<Rodzaj, number> = { ebook: 0, druk: 0, druk_ebook: 0, bf: 0 };
  const naDzien: Record<string, number> = {};
  const naZrodlo: Record<string, number> = {};
  let przychod = 0;
  for (const z of zakupy) {
    naRodzaj[z.rodzaj]++;
    przychod += z.kwota;
    const d = dzienPL(z.kiedy);
    naDzien[d] = (naDzien[d] ?? 0) + 1;
    naZrodlo[z.zrodlo] = (naZrodlo[z.zrodlo] ?? 0) + 1;
  }
  // dni od 2.11 do dziś (także z zerami), żeby wykres nie miał dziur
  const dni: { data: string; n: number }[] = [];
  for (let t = Date.parse('2026-11-02T12:00:00Z'); dzienPL(new Date(t)) <= dzis; t += 86400000) {
    const d = dzienPL(new Date(t));
    dni.push({ data: d, n: naDzien[d] ?? 0 });
  }
  const ostatnia = zakupy.at(-1);
  const reczne = await sprzedazReczna();
  const easycartTornado = zakupy.filter((z) => z.kiedy >= TORNADO_START).length;
  const tornadoTeraz = easycartTornado + reczne.empik + reczne.amazon_pl;
  return {
    reczne, easycartTornado,
    tornado: CELE_TORNADO.map((c) => ({ ...c, teraz: tornadoTeraz })),
    dzis: naDzien[dzis] ?? 0,
    odStartu: zakupy.length,
    ostatnia: ostatnia ? { kiedy: ostatnia.kiedy, godzina: godzinaPL(ostatnia.kiedy), dzien: dzienPL(ostatnia.kiedy) } : null,
    naRodzaj, przychod: Math.round(przychod * 100) / 100, dni,
    zrodla: Object.entries(naZrodlo).sort((a, b) => b[1] - a[1]),
    cele: CELE.map((c) => ({ ...c, teraz: naRodzaj.ebook })),
  };
}

/** Push ntfy (temat w prywatne.sekrety → ntfy_temat). Nigdy nie rzuca wyjątkiem. */
export async function pushNtfy(tytul: string, tresc: string, tagi = 'books') {
  try {
    if (!supabaseAdmin) return;
    const { data: temat } = await supabaseAdmin.rpc('sekret', { p_nazwa: 'ntfy_temat' });
    if (typeof temat !== 'string' || !temat) return;
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    // publikacja JSON-em (UTF-8 w tytule, emoji): https://docs.ntfy.sh/publish/#publish-as-json
    await fetch('https://ntfy.sh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: temat, title: tytul, message: tresc, tags: tagi.split(',') }),
      signal: ctl.signal,
    }).catch(() => {});
    clearTimeout(t);
  } catch { /* powiadomienie nigdy nie psuje webhooka */ }
}
