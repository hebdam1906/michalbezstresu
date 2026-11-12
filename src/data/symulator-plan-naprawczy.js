// Symulator „Plan naprawczy” — treść: Klaudiusz, 27.10.2026, zatwierdzona przez Michała bez poprawek
// (`Symulator-PIP_tresc-i-brief_do-akceptacji_27-10.md`). Wdrożenie: 12.11.2026.
// Runda: tytul + sytuacja, 3 odpowiedzi (2/1/0 pkt) z komentarzem, „Z drugiej strony stołu” per runda.
// Kolejność odpowiedzi losuje strona.

const UTM = (c) => `utm_source=symulator&utm_medium=strona&utm_campaign=symulator-pip&utm_content=${c}`;
const WZOR = `/dla-firm/plan-naprawczy-wzor/?${UTM('wzor')}`;
const ODCINEK = `/odcinki/plan-naprawczy-pip/?${UTM('odcinek')}`;
const KONSULTACJA = `/konsultacje/?${UTM('konsultacja')}#pip`;

export const RUNDY = [
  {
    tytul: 'Zaproszenie bez tematu',
    sytuacja: 'Szef wpisuje Ci spotkanie na jutro, 15:00, z HR w zaproszeniu. Bez tematu. Co robisz dziś wieczorem?',
    odpowiedzi: [
      { pkt: 2, tekst: 'Spisuję fakty z ostatnich miesięcy: projekty, terminy, wyniki, maile z podziękowaniami. Idę z kartką.',
        komentarz: 'Nie wiesz, o czym będzie rozmowa, ale wiesz, co zrobiłeś. Kartka z faktami to jedyne przygotowanie, które działa w każdym scenariuszu.' },
      { pkt: 1, tekst: 'Piszę do szefa: „O czym będzie jutrzejsze spotkanie?”.',
        komentarz: 'Można zapytać, ale odpowiedź najczęściej brzmi „porozmawiamy jutro”. Pytanie nie zastąpi przygotowania.' },
      { pkt: 0, tekst: 'Dzwonię do zaufanej osoby z zespołu, żeby się dowiedzieć, co się dzieje.',
        komentarz: 'Plotka jest szybsza niż fakty i prawie zawsze inna. A jeśli to coś poważnego, właśnie poinformowałeś zespół, że się boisz.' },
    ],
    drugaStrona: 'Spotkanie z HR w zaproszeniu prawie zawsze oznacza, że decyzja o formie rozmowy już zapadła. Menedżer też ma przed sobą kartkę. Lepiej, żebyście mieli je obaj.',
  },
  {
    tytul: 'Dokument na stole',
    sytuacja: 'Szef mówi: „Przygotowaliśmy plan naprawczy na 60 dni. Podpisz proszę, że się zapoznałeś”. Co mówisz?',
    odpowiedzi: [
      { pkt: 2, tekst: '„Dziękuję. Chcę się do tego rzetelnie odnieść. Wrócę do Ciebie do czwartku”.',
        komentarz: 'Podpis może poczekać. Dzień czy dwa na przeczytanie to nie słabość, tylko profesjonalizm. A emocje w tym czasie opadną.' },
      { pkt: 1, tekst: 'Podpisuję, żeby nie robić problemów, i mówię, że się postaram.',
        komentarz: 'Zwykle podpis oznacza „zapoznałem się”, a nie „zgadzam się”. Ale nie wiesz tego, dopóki nie przeczytasz, co podpisujesz.' },
      { pkt: 0, tekst: '„Nie podpiszę tego. To jest niesprawiedliwe”.',
        komentarz: 'Może i jest. Ale odmowa na gorąco, bez argumentów, zostaje w notatce z rozmowy jako „brak współpracy”.' },
    ],
    drugaStrona: 'Menedżer, który wręcza plan, najczęściej sam się tej rozmowy boi. Spokojne „wrócę do Ciebie” obniża temperaturę po obu stronach.',
  },
  {
    tytul: 'Ogólniki zamiast kryteriów',
    sytuacja: 'W planie jest: „poprawa jakości pracy i komunikacji”. Bez liczb, bez przykładów. Co robisz?',
    odpowiedzi: [
      { pkt: 2, tekst: 'Pytam: „Po czym poznamy za miesiąc, że jest lepiej?” i proszę o zapisanie odpowiedzi w planie.',
        komentarz: 'Plan bez mierzalnych kryteriów nie ma linii mety. Tego pytania nie da się źle odebrać, a odpowiedź chroni obie strony.' },
      { pkt: 1, tekst: 'Akceptuję, bo i tak nie mam wpływu na treść.',
        komentarz: 'Masz większy, niż myślisz. Ogólny cel jest wygodny dla firmy, bo każdy wynik da się ocenić jako „za mało”.' },
      { pkt: 0, tekst: 'Mówię, że moja komunikacja jest w porządku, a problem leży gdzie indziej.',
        komentarz: 'Dyskusja o tym, kto ma rację, zamyka rozmowę. Dyskusja o kryteriach ją otwiera.' },
    ],
    drugaStrona: 'Dobry plan naprawczy ma sześć elementów: cel, mierzalne kryteria, termin, wsparcie, regularne spotkania i jasne zakończenie. Jeśli któregoś brakuje, menedżer często nawet o tym nie wie.',
  },
  {
    tytul: 'Pierwszy tydzień',
    sytuacja: 'Plan trwa od tygodnia. Co robisz po każdej rozmowie z szefem?',
    odpowiedzi: [
      { pkt: 2, tekst: 'Wysyłam krótki mail: „Dla porządku podsumowuję ustalenia: po pierwsze…, po drugie…”.',
        komentarz: 'Ton służbowy i pomocny. Za 60 dni nikt nie odtworzy rozmów z pamięci, a maile zostaną.' },
      { pkt: 1, tekst: 'Robię notatki w swoim zeszycie.',
        komentarz: 'Lepiej niż nic, ale notatka, której druga strona nie widziała, ma małą wagę. Mail ma datę i odbiorcę.' },
      { pkt: 0, tekst: 'Skupiam się na pracy. Dokumentowanie wygląda, jakbym szykował się do sporu.',
        komentarz: 'Dokumentowanie nie jest wrogością. To dokładnie to, co robi druga strona.' },
    ],
    drugaStrona: 'Menedżer też prowadzi notatki z każdego spotkania w ramach planu. Jeśli Twoje maile są rzeczowe i życzliwe, często to one stają się wspólną wersją wydarzeń.',
  },
  {
    tytul: 'Decyzja czy reakcja',
    sytuacja: 'Trzeci tydzień planu. Wieczorem myślisz: „Złożę wypowiedzenie i będzie po sprawie”. Co robisz?',
    odpowiedzi: [
      { pkt: 2, tekst: 'Zadaję sobie pytanie: czy myślałbym o odejściu tak samo, zanim dostałem plan? I daję sobie 48 godzin.',
        komentarz: 'Jeśli tak, masz przed sobą decyzję i warto ją przeprowadzić dobrze: najpierw nowa umowa, potem wypowiedzenie. Jeśli nie, masz przed sobą reakcję.' },
      { pkt: 1, tekst: 'Zaczynam po cichu szukać pracy, ale plan realizuję na sto procent.',
        komentarz: 'Rozsądne zabezpieczenie. Byle szukanie nie zjadło energii, której potrzebujesz na plan.' },
      { pkt: 0, tekst: 'Składam wypowiedzenie jutro rano.',
        komentarz: 'Decyzja podjęta w emocjach rzadko jest najlepsza. A odejście bez nowej umowy w trakcie planu to najsłabsza pozycja negocjacyjna z możliwych.' },
    ],
    drugaStrona: 'Część planów naprawczych kończy się sukcesem. Menedżerowie pamiętają ludzi, którzy przeszli przez plan z klasą, niezależnie od tego, jak się skończył.',
  },
];

const CTA = [
  { etykieta: 'Pobierz wzór planu naprawczego (PDF, 6 pól, za darmo)', href: WZOR, typ: 'primary', cel: 'wzor' },
  { etykieta: 'Obejrzyj odcinek o planie naprawczym', href: ODCINEK, typ: 'ghost', cel: 'odcinek' },
  { etykieta: 'Porozmawiajmy o Twoim planie — konsultacja 1:1', href: KONSULTACJA, typ: 'ghost', cel: 'konsultacje' },
];

export const WYNIKI = [
  { od: 8, tytul: 'Spokojny i przygotowany.', tekst: 'Prowadzisz tę rozmowę faktami, nie emocjami. To najlepsza pozycja, jaką możesz mieć.', cta: CTA },
  { od: 4, tytul: 'Dobry kierunek, kilka luk.', tekst: 'Masz dobre odruchy, ale w paru miejscach oddajesz pole. Najczęściej chodzi o kryteria i dokumentowanie.', cta: CTA },
  { od: 0, tytul: 'Reagujesz, zanim zdążysz pomyśleć.', tekst: 'To normalne przy takim stresie. Dobra wiadomość: tego da się nauczyć przed rozmową, a nie po niej.', cta: CTA },
];
