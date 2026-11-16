// Symulator „Ocena roczna” — treść: Klaudiusz, 16.11.2026, zatwierdzona przez Michała bez poprawek
// (`Symulator-ocena-roczna_tresc-i-brief_do-akceptacji_16-11.md`). Wdrożenie: 16.11.2026.
// Kolejność odpowiedzi losuje strona. CTA 1 = webinar 3.12 (po 5.12 podmienić na nagranie/checklistę).

const WEBINAR = '/webinar/?utm_source=symulator&utm_medium=strona&utm_campaign=webinar-03-12&utm_content=symulator-ocena';
const KSIAZKA = '/ksiazka/?utm_source=symulator&utm_medium=strona&utm_campaign=tornado&utm_content=symulator-ocena';
const KONSULTACJA = '/konsultacje/?utm_source=symulator&utm_medium=strona&utm_campaign=konsultacje&utm_content=symulator-ocena';
export const KSIAZKA_HREF = KSIAZKA;

export const RUNDY = [
  {
    tytul: 'Trzy tygodnie przed rozmową',
    sytuacja: 'W kalendarzu pojawia się „Rozmowa roczna” za trzy tygodnie. Co robisz w tym tygodniu?',
    odpowiedzi: [
      { pkt: 2, tekst: 'Spisuję na jednej stronie, co zrobiłam/em w tym roku: projekty z datami, liczby, które się poprawiły, sprawy załatwione bez eskalacji, opinie z innych zespołów. Wysyłam szefowi przed rozmową.',
        komentarz: 'Jedna strona konkretów trafia do szefa, zanim ktokolwiek napisze ocenę. To jedyny moment, w którym naprawdę masz wpływ na wynik.' },
      { pkt: 1, tekst: 'Zaczynam wypełniać formularz samooceny dzień przed terminem, z pamięci.',
        komentarz: 'Z pamięci wychodzą przymiotniki: „zaangażowanie”, „dobra współpraca”. Przymiotniki nie bronią się na kalibracji. Daty i liczby tak.' },
      { pkt: 0, tekst: 'Nic. Szef wie, co robię, po to jest szefem.',
        komentarz: 'Szef pamięta listopad i to, co poszło źle. Jeśli nie przypomnisz marca, marzec w tej rozmowie nie istnieje.' },
    ],
    drugaStrona: 'Ocena zapada na kalibracji, zwykle na dwa, trzy tygodnie przed Twoją rozmową. Na jedną osobę przypada tam minuta, dwie. Twój menedżer dostaje tyle czasu, ile ma o Tobie konkretów.',
  },
  {
    tytul: 'Pytanie w samoocenie',
    sytuacja: 'W formularzu jest pole „Największe osiągnięcie w tym roku”. Co wpisujesz?',
    odpowiedzi: [
      { pkt: 2, tekst: '„Zamknięcie migracji X dwa dni przed terminem, bez błędów po stronie klienta. Potwierdzenie: mail od Y z 14.03.”',
        komentarz: 'Projekt, data, wynik i świadek. Takie zdanie menedżer może przeczytać na głos na kalibracji. Nic nie musi dopisywać.' },
      { pkt: 1, tekst: '„Duże zaangażowanie w projekt migracji i wsparcie zespołu w trudnym okresie.”',
        komentarz: 'Prawda, ale nie do obrony. „Duże” i „trudny” to Twoja opinia. Kalibracja pyta: co konkretnie, kiedy, z jakim skutkiem.' },
      { pkt: 0, tekst: 'Zostawiam puste albo wpisuję „jak w zeszłym roku, sumienna praca”.',
        komentarz: 'Puste pole menedżer wypełni sam, z tego, co pamięta. A pamięta ostatnie sześć tygodni.' },
    ],
    drugaStrona: 'Dobry menedżer prosi zespół o cotygodniowy status: zrobione, w toku, zagrożone. Jeśli Twój o to nie prosi, wysyłaj go i tak. W listopadzie to z niego powstaje Twoja ocena.',
  },
  {
    tytul: 'Wynik niższy, niż się spodziewasz',
    sytuacja: 'Szef mówi: „Dostajesz »spełnia oczekiwania«. Liczyłem na więcej, ale limit ocen wyżej był bardzo mały”. Co mówisz?',
    odpowiedzi: [
      { pkt: 2, tekst: '„Rozumiem. Chcę to dobrze zrozumieć: które z moich wyników były brane pod uwagę i czego zabrakło do oceny wyżej?”',
        komentarz: 'Nie podważasz oceny, pytasz o kryteria. Odpowiedź na to pytanie to Twój plan na przyszły rok i podstawa do rozmowy o podwyżce.' },
      { pkt: 1, tekst: '„OK, trudno”. I kończę rozmowę jak najszybciej.',
        komentarz: 'Oszczędzasz sobie nerwów dziś, ale wychodzisz bez informacji, co zmienić. Za rok ta sama rozmowa.' },
      { pkt: 0, tekst: '„To niesprawiedliwe. Pracowałam/em więcej niż ktokolwiek w zespole”.',
        komentarz: 'Może i tak. Ale porównanie z innymi na gorąco zamyka rozmowę, a w notatce zostaje „trudno przyjmuje feedback”.' },
    ],
    drugaStrona: 'Zdanie o limicie zwykle jest prawdziwe. Menedżer wrócił z dogrywki, w której musiał kilka ocen obniżyć. Pytanie „czego zabrakło” daje mu szansę powiedzieć, co naprawdę zdecydowało. Oburzenie tę szansę zabiera.',
  },
  {
    tytul: '„Nie ma budżetu”',
    sytuacja: 'Pytasz o podwyżkę. Słyszysz: „Nie ma budżetu w tym roku”. Co mówisz?',
    odpowiedzi: [
      { pkt: 2, tekst: '„Rozumiem. Co musiałoby się zmienić, żebyśmy wrócili do tej rozmowy, i kiedy? Chcę to zapisać.”',
        komentarz: '„Nie ma budżetu” rzadko znaczy „nigdy”. Zamieniasz „nie” na kryteria i termin, a to już jest ustalenie, nie odmowa.' },
      { pkt: 1, tekst: '„Dobrze, to może w przyszłym roku”.',
        komentarz: 'Zostawiasz termin po stronie szefa. W przyszłym roku budżet będzie podzielony w marcu, a Ty zapytasz w grudniu.' },
      { pkt: 0, tekst: '„W takim razie zacznę rozglądać się za czymś innym”.',
        komentarz: 'Groźba bez oferty w ręku to najsłabsza pozycja. A menedżer właśnie usłyszał, że nie warto w Ciebie inwestować.' },
    ],
    drugaStrona: 'Budżet na podwyżki jest planowany jesienią, dzielony zimą. Prośba złożona po ocenach trafia w moment, gdy pula jest już rozdana. Menedżer, który naprawdę chce Ci dać podwyżkę, potrzebuje od Ciebie argumentów na wrzesień, nie na grudzień.',
  },
  {
    tytul: 'Dzień po rozmowie',
    sytuacja: 'Rozmowa za Tobą. Co robisz następnego dnia?',
    odpowiedzi: [
      { pkt: 2, tekst: 'Wysyłam krótki mail: „Dziękuję za rozmowę. Dla porządku podsumowuję: ocena…, czego zabrakło…, do czego wracamy w [miesiąc]…”.',
        komentarz: 'Ustalenia z rozmowy żyją krótko. Mail z datą i odbiorcą żyje do następnej oceny. I jest Twoim argumentem za rok.' },
      { pkt: 1, tekst: 'Zapisuję wnioski dla siebie i wracam do pracy.',
        komentarz: 'Dobre dla Ciebie, niewidoczne dla szefa. Za rok będziecie pamiętać różne wersje tej rozmowy.' },
      { pkt: 0, tekst: 'Opowiadam zespołowi, jak niesprawiedliwa była ocena.',
        komentarz: 'Zespół Ci przytaknie i to wróci do menedżera w ciągu tygodnia. W innej formie.' },
    ],
    drugaStrona: 'Menedżer po sezonie ocen ma za sobą kilkanaście trudnych rozmów. Mail, który porządkuje ustalenia bez pretensji, wyróżnia Cię bardziej niż cokolwiek, co można powiedzieć w pokoju.',
  },
];

const CTA = [
  { etykieta: 'Bezpłatny webinar 3.12, 19:00: „Ocena roczna: co zrobić, zanim usiądziesz do rozmowy”', href: WEBINAR, typ: 'primary', cel: 'webinar' },
  { etykieta: 'Książka „Z obu stron stołu” (druk z dedykacją lub e-book)', href: KSIAZKA, typ: 'ghost', cel: 'ksiazka-cta' },
  { etykieta: 'Konsultacja 1:1 przed Twoją rozmową', href: KONSULTACJA, typ: 'ghost', cel: 'konsultacje' },
];

export const WYNIKI = [
  { od: 8, tytul: 'Przygotowana/y, zanim ktokolwiek usiądzie do stołu.', tekst: 'Dostarczasz konkrety wtedy, gdy ocena się tworzy, a w rozmowie pytasz o kryteria zamiast bronić się przed wynikiem. Tak wygląda wpływ na ocenę.', cta: CTA },
  { od: 4, tytul: 'Dobre odruchy w rozmowie, za późno przed nią.', tekst: 'W pokoju radzisz sobie nieźle, ale ocena zapada wcześniej. Najczęściej brakuje jednej strony wyników wysłanej trzy tygodnie przed i maila dzień po.', cta: CTA },
  { od: 0, tytul: 'Reagujesz na wynik zamiast na niego wpływać.', tekst: 'To normalne, nikt nas tego nie uczy. Dobra wiadomość: każdy z pięciu momentów da się przećwiczyć przed rozmową.', cta: CTA },
];
