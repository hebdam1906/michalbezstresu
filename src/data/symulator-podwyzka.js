// Symulator rozmowy o podwyżce (v0) — treść: Klaudiusz, brief 5.10.2026
// (`Klaudiusz-do-Marcina_symulator-podwyzki-v0_i-konsultacje-przyklad_05-10.md`).
//
// Bez AI i bez zapisu danych: 5 rund, w każdej 3 odpowiedzi za 2 / 1 / 0 pkt.
// Kolejność odpowiedzi losuje strona (żeby najlepsza nie była zawsze pierwsza),
// więc tutaj kolejność nie ma znaczenia.
//
// POLA ODPOWIEDZI:
//   tekst      to, co mówisz
//   pkt        2 / 1 / 0
//   komentarz  krótka ocena odpowiedzi
//   drugaStrona  „Z drugiej strony stołu" — jak to słyszy przełożona

export const ROZMOWCA = { imie: 'Ewa', rola: 'kierowniczka zespołu' };

export const RUNDY = [
  {
    kwestia: 'Mam piętnaście minut. O czym chcesz porozmawiać?',
    odpowiedzi: [
      {
        tekst: 'O moim wynagrodzeniu. Przygotowałem/am kilka konkretów z ostatniego roku i chcę je Pani pokazać.',
        pkt: 2,
        komentarz: 'Jasny cel w pierwszym zdaniu i sygnał, że jesteś przygotowany/a.',
        drugaStrona: 'Manager od razu wie, w jakim trybie słuchać. „Konkrety” to słowo, które sprawia, że odkłada telefon.',
      },
      {
        tekst: 'Wiem, że to pewnie nie najlepszy moment… ale może kiedyś wrócimy do tematu pieniędzy?',
        pkt: 0,
        komentarz: 'Przepraszające otwarcie samo podsuwa wymówkę „to faktycznie nie najlepszy moment”.',
        drugaStrona: 'Słyszę, że sam/a w to nie wierzysz. Łatwo mi odłożyć temat — i zrobię to.',
      },
      {
        tekst: 'Kolega z działu obok zarabia więcej, a robi mniej.',
        pkt: 0,
        komentarz: 'Porównanie z innymi przenosi rozmowę na plotki i poufność płac, a nie na Twoją wartość.',
        drugaStrona: 'Nie mogę rozmawiać o cudzej pensji. Zaczynam się bronić, zamiast słuchać.',
      },
    ],
  },
  {
    kwestia: 'Budżety na ten rok są już zamknięte.',
    odpowiedzi: [
      {
        tekst: 'Rozumiem. Kiedy zaczyna się planowanie na przyszły rok i co musiałbym/musiałabym pokazać, żeby się w nim znaleźć?',
        pkt: 2,
        komentarz: 'Nie walczysz z faktem — wchodzisz w proces.',
        drugaStrona: 'Podwyżki planuje się miesiące wcześniej. Ktoś, kto pyta o termin i kryteria, trafia na moją listę „do obrony”.',
      },
      {
        tekst: 'To kiedy w końcu będzie dobry moment?',
        pkt: 1,
        komentarz: 'Słuszne pytanie, ale w tonie pretensji.',
        drugaStrona: 'Słyszę frustrację, a nie plan. Odpowiem ogólnikiem.',
      },
      {
        tekst: 'Aha, w porządku. Czyli nie ma tematu.',
        pkt: 0,
        komentarz: 'Kapitulacja po pierwszym „nie”.',
        drugaStrona: 'Pierwsze „nie” to często test. Skoro odpuszczasz, temat wraca za rok — jeśli w ogóle.',
      },
    ],
  },
  {
    kwestia: 'A co konkretnie zmieniło się w Twojej pracy?',
    odpowiedzi: [
      {
        tekst: 'Od marca obsługuję dwóch klientów po odejściu Tomka, a zamknięcie miesiąca skróciliśmy z 7 do 5 dni roboczych.',
        pkt: 2,
        komentarz: 'Liczby i zakres odpowiedzialności, nie przymiotniki.',
        drugaStrona: 'To zdanie mogę wkleić prosto do wniosku do dyrektora. Właśnie odrobiłeś/aś za mnie pracę.',
      },
      {
        tekst: 'Robię dużo więcej, niż mam w zakresie obowiązków.',
        pkt: 1,
        komentarz: 'Pewnie prawda, ale bez dowodu.',
        drugaStrona: '„Więcej” niczego mi nie daje na kalibracji. Zapytam „na przykład?” — i liczę, że masz odpowiedź.',
      },
      {
        tekst: 'Bardzo się staram, często zostaję po godzinach.',
        pkt: 0,
        komentarz: 'Wysiłek to nie wynik.',
        drugaStrona: 'Nadgodziny mogą wręcz zabrzmieć, jakbyś nie radził/a sobie w czasie pracy.',
      },
    ],
  },
  {
    kwestia: 'Dobrze. Ile chciałbyś/chciałabyś dostać?',
    odpowiedzi: [
      {
        tekst: 'Sprawdziłem/am raporty płacowe dla mojego stanowiska w naszym regionie. Celuję w 9 500 zł brutto.',
        pkt: 2,
        komentarz: 'Konkretna kwota oparta na danych. Ty ustawiasz punkt odniesienia.',
        drugaStrona: 'Mam liczbę i źródło — mogę z tym iść wyżej. Bez liczby i tak wymyślę ją sam/a, zwykle niższą.',
      },
      {
        tekst: 'A ile Pani uważa za stosowne?',
        pkt: 0,
        komentarz: 'Oddajesz kotwicę drugiej stronie.',
        drugaStrona: 'Zaproponuję minimum z widełek. Wszystko powyżej musisz już wywalczyć.',
      },
      {
        tekst: 'Właściwie każda podwyżka mnie ucieszy.',
        pkt: 0,
        komentarz: 'Brzmi skromnie, działa przeciwko Tobie.',
        drugaStrona: 'Dosłownie — dostaniesz „każdą”. Czyli najmniejszą.',
      },
    ],
  },
  {
    kwestia: 'Muszę to przemyśleć i porozmawiać z moim przełożonym.',
    odpowiedzi: [
      {
        tekst: 'Jasne. Przygotuję krótkie podsumowanie na jedną stronę, żeby łatwiej było Pani o tym rozmawiać. Czy wrócimy do tematu za dwa tygodnie?',
        pkt: 2,
        komentarz: 'Ułatwiasz jej kolejny krok i ustalasz termin.',
        drugaStrona: 'To ja muszę „sprzedać” Twoją podwyżkę wyżej. Gotowa notatka i termin sprawiają, że sprawa nie utonie w skrzynce.',
      },
      {
        tekst: 'Jeśli się nie uda, będę musiał/a rozważyć inne opcje.',
        pkt: 1,
        komentarz: 'Ultimatum bez oferty w ręku to blef, który łatwo sprawdzić.',
        drugaStrona: 'Zapamiętam to zdanie — niekoniecznie na Twoją korzyść.',
      },
      {
        tekst: 'Dobrze, dziękuję.',
        pkt: 0,
        komentarz: 'Uprzejmie, ale bez następnego kroku.',
        drugaStrona: 'Mam dziesięć pilniejszych spraw. Bez terminu temat po prostu zniknie.',
      },
    ],
  },
];

// Wynik 0–10 → komunikat. `od` = dolna granica przedziału (włącznie).
// CTA: `typ` steruje wyglądem (primary / ghost), `cel` trafia do eventu GA4.
const ODCINEK = '/odcinki/jak-rozmawiac-o-podwyzce/';
export const WYNIKI = [
  {
    od: 8,
    tytul: 'Jesteś gotowy/a do tej rozmowy.',
    tekst: 'Masz dobre odruchy. Sprawdź jeszcze, czy masz wszystko na kartce.',
    cta: [
      { etykieta: 'Pobierz checklistę „Przygotuj się do trudnej rozmowy”', href: '/checklista/', typ: 'primary', cel: 'checklista' },
      { etykieta: 'Przećwicz swoją prawdziwą sytuację — konsultacja 1:1', href: '/konsultacje/', typ: 'ghost', cel: 'konsultacje' },
    ],
  },
  {
    od: 4,
    tytul: 'Dobre podstawy, ale kilka zdań może Cię kosztować.',
    tekst: 'Najwięcej tracisz w rundach, w których wybrałeś/aś odpowiedź za 0 pkt — przewiń w górę i przeczytaj „Z drugiej strony stołu”.',
    cta: [
      { etykieta: 'Obejrzyj odcinek o rozmowie o podwyżce', href: ODCINEK, typ: 'primary', cel: 'odcinek' },
      { etykieta: 'Pobierz checklistę', href: '/checklista/', typ: 'ghost', cel: 'checklista' },
    ],
  },
  {
    od: 0,
    tytul: 'Ta rozmowa mogłaby Cię zaskoczyć.',
    tekst: 'Spokojnie — po to jest trening. Zacznij od odcinka, potem zrób symulator jeszcze raz.',
    cta: [
      { etykieta: 'Obejrzyj odcinek', href: ODCINEK, typ: 'primary', cel: 'odcinek' },
      { etykieta: 'Przygotujmy ją razem — konsultacja', href: '/konsultacje/', typ: 'ghost', cel: 'konsultacje' },
    ],
  },
];
