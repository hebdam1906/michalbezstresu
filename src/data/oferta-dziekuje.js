/**
 * Oferta książki na /dziekuje (brief Klaudiusza 18.10.2026).
 *
 * Stan liczony po czasie Warszawy, NA SERWERZE (dziekuje.astro ma
 * prerender = false). Dzięki temu przed 2.11 w HTML-u nie ma ani ceny,
 * ani linku do EasyCart (status w PUP do 31.10 — zero sprzedaży publicznie).
 *
 *   A — do 2.11.2026 7:59      lista premierowa, bez ceny
 *   B — 2.11 8:00 – 15.11 23:59 39 zł „do 15 listopada”
 *   C — 16.11 0:00 – 30.11 23:59 39 zł „tylko na tej stronie” — kod POTWIERDZONE10
 *                               (−10 zł od ceny sklepowej 49 zł, wpięty w link ?promo=)
 *   D — od 1.12 0:00           49 zł, zwykła cena (kod wygasa 30.11 23:59 w EasyCart)
 *
 * 13.11.2026 (brief Klaudiusza „oferta po potwierdzeniu”): double opt-in jest
 * wyłączony, więc /dziekuje JEST stroną po zakończonym zapisie — oferta
 * przesunięta wyżej, nowy tekst, kod do 30.11. Decyzja Michała 13.11.
 *
 * Granice wpisane jako UTC: 2.11 8:00 CET = 7:00 UTC, 16.11 0:00 CET = 15.11 23:00 UTC
 * (od 25.10 Polska jest już na czasie zimowym, UTC+1).
 */
export const START_SPRZEDAZY = Date.UTC(2026, 10, 2, 7, 0, 0);   // 2.11.2026 08:00 Warszawa
export const KONIEC_CENY_39 = Date.UTC(2026, 10, 15, 23, 0, 0);  // 16.11.2026 00:00 Warszawa
export const KONIEC_KODU = Date.UTC(2026, 10, 30, 23, 0, 0);     // 1.12.2026 00:00 Warszawa

/** Podgląd stanu poza produkcją: zmienna środowiskowa OFERTA_DZIEKUJE_STAN=A|B|C. */
export function stanOferty(teraz = Date.now(), wymuszony) {
  if (['A', 'B', 'C', 'D'].includes(wymuszony)) return wymuszony;
  if (teraz < START_SPRZEDAZY) return 'A';
  if (teraz < KONIEC_CENY_39) return 'B';
  if (teraz < KONIEC_KODU) return 'C';
  return 'D';
}

/* ⚠️ Adres checkoutu produktu 4 (slug z 21.09: michalbezstresu/z-obu-stron-stolu-ebook).
   Do potwierdzenia przy zakupie testowym 29.10 — produkt jest jeszcze w Szkicu. */
export const LINK_EBOOK =
  'https://cart.easy.tools/checkout/michalbezstresu/z-obu-stron-stolu-ebook' +
  '?utm_source=dziekuje&utm_medium=site&utm_campaign=premiera';

/* Stan C (16–30.11): ten sam produkt z kodem POTWIERDZONE10 wpiętym w link.
   Parametr `promo` wg dokumentacji Easytools („Link to Cart with Discount Code”).
   Kod działa tylko na wariant 49 zł — sprawdzić 16.11 rano, że koszyk pokazuje 39 zł. */
export const LINK_EBOOK_KOD =
  'https://cart.easy.tools/checkout/michalbezstresu/z-obu-stron-stolu-ebook' +
  '?promo=POTWIERDZONE10&utm_source=dziekuje&utm_medium=site&utm_campaign=checklista';
