// Strony odcinków — warstwa SEO nad danymi z `odcinki.js`.
//
// Po co osobny plik: `odcinki.js` opisuje odcinek jako publikację (numer, data,
// link do YT i Spotify). Tutaj mieszka to, czego potrzebuje wyszukiwarka —
// zapytanie, pod które strona jest napisana, nagłówki i treść.
//
// ⚠️ ZASADA NR 1 (Klaudiusz, 2.09): jedna strona = jedno zapytanie główne.
// Zanim dopiszesz nowe `zapytanie`, sprawdź całą tabelę niżej. Przy dziewięciu
// stronach o pokrewnych tematach kanibalizacja jest realna: dwie nasze strony
// zaczynają walczyć ze sobą o ten sam wynik i obie lądują niżej.
//
// ⚠️ ZASADA NR 2: tekst rozdziału książki NIGDY nie trafia tutaj. W drugą stronę
// jest bezpiecznie — strona może być szkicem, z którego wyrasta rozdział.
//
// POLA:
//   nr          numer odcinka; spina stronę z wpisem w `odcinki.js`
//   slug        adres: /odcinki/<slug>. Raz opublikowany — nie zmieniamy.
//   zapytanie   JEDNO główne zapytanie, pod które ta strona jest napisana
//   tytul       <title> i og:title — inny niż tytuł na YouTube (patrz niżej)
//   opis        <meta description>
//   h1          nagłówek na stronie, sformułowany jako pytanie
//   lead        akapity nad filmem (tablica albo pojedynczy tekst), kończy się obietnicą
//   sekcje      [{ h2, tresc: [akapity] }] — H2 jako pytania
//   zapamietaj  3–5 punktów do sekcji „Co zapamiętać"
//   powiazane   dwa numery odcinków, do których ta strona ma linkować. UWAGA: to
//               pole jest tylko planem — linki wstawiamy RĘCZNIE w `tresc`, jako
//               naturalne zdanie. Zasada Klaudiusza: żadnej listy „zobacz też".
//   konsultacje czy pokazujemy CTA do konsultacji obok checklisty
//   cta         { gora, dol } — teksty CTA dla TEJ strony (HTML). Bez tego lecą
//               teksty domyślne z szablonu, a te są feedbackowe: na stronie o PIP
//               wyświetliłaby się obietnica „10 zdań na niesprawiedliwy feedback".
//   notaPrawna  nota w stopce strony (HTML). Obowiązkowa wszędzie tam, gdzie tekst
//               dotyka dokumentów, podpisów i procedur — np. strona o PIP.
//   transkrypcja tablica akapitów (zwykły tekst) z `transkrypcje.js`. Ląduje pod
//               rozwijanym „Transkrypcja całego odcinka" i jako `transcript`
//               w JSON-LD. Wpinamy TYLKO transkrypcje sprawdzone pod kątem
//               anonimowości — bez nazw firm, imion, dat i stanowisk.
//   gotowa      false = strona NIE jest budowana. Przełącz na true dopiero,
//               gdy treść jest zredagowana i zaakceptowana przez Michała.
//
// Dlaczego tytuł tutaj różni się od tytułu na YouTube: YouTube nagradza
// ciekawość („najbardziej zmarnowane 15 minut w korporacji"), Google nagradza
// dopasowanie do pytania, które ktoś wpisał. To dwa różne zadania.

import { transkrypcje } from './transkrypcje.js';

export const stronyOdcinkow = [
  {
    nr: 2,
    slug: 'plan-naprawczy-pip',
    zapytanie: 'plan naprawczy w pracy co to jest',
    tytul: 'Plan naprawczy w pracy — co oznacza PIP i co teraz zrobić',
    opis:
      'Dostałeś plan naprawczy? Wyjaśniam, czym jest PIP, kto go naprawdę pisze i po co — z perspektywy managera, który takie plany prowadził. Plus pierwsze kroki.',
    h1: 'Dostałem plan naprawczy. Co to naprawdę znaczy?',
    lead: [
      "Zaproszenie w kalendarzu: Ty, Twój szef i ktoś z HR. Temat: „rozmowa o wynikach\". Na stole leży dokument, a ktoś wypowiada zdanie, które zapamiętasz na długo — „przygotowaliśmy dla Ciebie plan poprawy\".",
      "Przez dwadzieścia lat pracowałem w korporacjach i jako manager takie plany pisałem oraz prowadziłem. Widziałem z bliska, jak kończą się jedne i drugie — te, które były realną szansą, i te, które były formalnością. Poniżej wyjaśniam, czym plan naprawczy naprawdę jest, po czym poznać, który wariant dostałeś, i co zrobić w pierwszych dniach.",
    ],
    sekcje: [
      {
        h2: "Czym właściwie jest plan naprawczy (PIP)?",
        tresc: [
          "PIP, czyli Performance Improvement Plan, to formalny dokument z celami do osiągnięcia w określonym czasie — zwykle trzydziestu, sześćdziesięciu albo dziewięćdziesięciu dni. Zawiera kryteria oceny, harmonogram spotkań kontrolnych i podpisy obu stron.",
          "Tyle mówi definicja i tyle znajdziesz w każdym poradniku HR.",
          "W praktyce plan naprawczy jest czymś innym: <strong>jest narzędziem procesu, który zaczął się dużo wcześniej niż spotkanie, na którym dostałeś dokument.</strong> I to jest pierwsza rzecz, którą trzeba zrozumieć, żeby przestać czytać go jak osobisty atak.",
        ],
      },
      {
        h2: "Czy plan naprawczy zawsze oznacza zwolnienie?",
        tresc: [
          "Nie. Ale odpowiedź jest bardziej złożona, niż byśmy chcieli.",
          "Z mojego doświadczenia plany naprawcze przychodzą w dwóch odmianach, których nie odróżnisz po okładce — dokument wygląda tak samo.",
          "<strong>Odmiana pierwsza: plan pisany pod sukces.</strong> Firmie zależy, żebyś go zrealizował i został. Cele są konkretne, mierzalne i osiągalne w wyznaczonym czasie. Szef ma w kalendarzu cotygodniowe spotkania z Tobą — i na nie przychodzi.",
          "<strong>Odmiana druga: plan pisany pod dokumentację.</strong> Decyzja w czyjejś głowie już zapadła, a plan porządkuje papiery. Cele są ruchome albo nieostre, kryteria uznaniowe, a rozmowy o postępach jakoś nie mogą się odbyć.",
          "Widziałem plan, który uratował człowieka, i plan, który był tylko odliczaniem. Różnica nie leżała w samym dokumencie, tylko w celach i sposobie ich oceny.",
          "Prawidłowość była wyraźna: jeśli plan powstawał <strong>wspólnie z pracownikiem</strong>, cele dawały się łatwo zmierzyć, a osoba objęta planem uważała je za osiągalne — taki plan zwykle kończył się sukcesem i kontynuowaniem kariery w firmie. Jeśli plan przygotowano inaczej, kryteria oceny były niedopracowane, a cele w opinii pracownika nierealne — zwykle kończyło się odejściem.",
        ],
      },
      {
        h2: "Kto pisze plan naprawczy i po co?",
        tresc: [
          "Plan naprawczy prawie nigdy nie jest pomysłem jednej osoby.",
          "Zanim dokument trafił na stół, zwykle miał już swoją historię. Rozmowy Twojego szefa z jego przełożonym. Konsultację z działem HR. Czasem — jeśli sprawa ciągnie się dłużej albo dotyczy trudnego przypadku — także z prawnikiem.",
          "To ma dla Ciebie trzy praktyczne konsekwencje.",
          "<strong>Po pierwsze: Twój szef nie jest jedynym autorem.</strong> Może być autorem treści, ale forma, terminy i sam fakt, że plan powstał, są zwykle efektem ustaleń, w których uczestniczyły inne osoby. Dlatego przekonanie samego przełożonego rzadko wystarcza, żeby plan zniknął.",
          "<strong>Po drugie: dokument ma cel, który nie zawsze jest wypowiedziany na głos.</strong> Formalnie plan naprawczy służy poprawie wyników. Realnie bywa też sposobem uporządkowania dokumentacji przed decyzją, która już zapadła. Jedno i drugie wygląda tak samo na papierze — dlatego w następnej sekcji podaję pięć pytań, które pozwalają je rozróżnić.",
          "<strong>Po trzecie, i to jest dobra wiadomość: skoro to proces, to ma zasady.</strong> Terminy, spotkania kontrolne, kryteria, ślad w systemie. Proces da się poznać i można się w nim świadomie poruszać — w przeciwieństwie do czyjegoś nastawienia, na które nie masz wpływu.",
          "Nie walczysz więc z człowiekiem. Odpowiadasz procesowi.",
        ],
      },
      {
        h2: "Po czym poznać, że cele w planie są nierealne?",
        tresc: [
          "Zadaj sobie pięć pytań. Odpowiedzi powiedzą Ci więcej niż ton głosu na spotkaniu.",
          "<strong>1. Czy cele są mierzalne?</strong><br />„Popraw jakość raportów\" to nie jest cel, tylko opinia. „Zero błędów krytycznych w trzech kolejnych raportach miesięcznych\" to jest cel.",
          "<strong>2. Czy cele są osiągalne w wyznaczonym czasie?</strong><br />Plan na trzydzieści dni z celami wymagającymi kwartału to matematyka, która nie ma prawa się spiąć.",
          "<strong>3. Czy dostajesz wsparcie?</strong><br />Szkolenie, mentora, czas swojego przełożonego. Plan-szansa zawiera pomoc. Plan-formalność zawiera wyłącznie wymagania.",
          "<strong>4. Czy spotkania kontrolne faktycznie się odbywają?</strong><br />To najprostszy test intencji, jaki istnieje. Jeśli szefowi „wypadają\" kolejne spotkania, masz odpowiedź.",
          "<strong>5. Jak brzmi odpowiedź na pytanie „po czym poznamy, że jest lepiej?\"</strong><br />Konkret to dobry znak. Wymijająca ogólność — zły.",
          "Trzy albo więcej odpowiedzi negatywnych to nie powód do paniki. To informacja: od tego momentu Twoim priorytetem jest nie tylko realizacja planu, ale też zabezpieczenie siebie.",
        ],
      },
      {
        h2: "Co zrobić w pierwszych 48 godzinach?",
        tresc: [
          "W tych pierwszych dwóch dobach ludzie popełniają błędy, których potem nie da się cofnąć. Są trzy najczęstsze.",
          "<strong>Błąd pierwszy: podpisanie czegokolwiek w trakcie spotkania.</strong><br />Masz prawo powiedzieć: „Chcę się z tym dokumentem spokojnie zapoznać. Wrócę z podpisem i ewentualnymi uwagami do końca tygodnia\". To jest normalne, profesjonalne zachowanie.",
          "Dla uczciwości: podpis pod planem naprawczym zwykle potwierdza, że dokument otrzymałeś, a nie że się z nim zgadzasz. Ale nawet wtedy — najpierw czytasz na spokojnie, potem podpisujesz. A jeśli cokolwiek budzi Twoje wątpliwości, to jest dokładnie ten moment na konsultację z prawnikiem specjalizującym się w prawie pracy. Nie „może kiedyś\". Teraz.",
          "<strong>Błąd drugi: emocjonalna kontrofensywa.</strong><br />Długi mail o niesprawiedliwości, wysłany wieczorem w dniu otrzymania planu. Wszystko, co napiszesz, <a href=\"/odcinki/negatywny-feedback-od-szefa\">staje się dokumentem</a>. Twoja pisemna odpowiedź powstanie — ale za dwa, trzy dni, na zimno i z faktami.",
          "<strong>Błąd trzeci, najgroźniejszy: rzucenie papierami.</strong><br />„Skoro tak, to ja dziękuję\". Rozumiem tę emocję doskonale. Ale odejście z dnia na dzień, w gniewie, to zwykle najgorsza finansowo i strategicznie wersja odejścia. Jeśli masz odchodzić — odejdziesz na swoich warunkach, w swoim czasie, z przemyślaną poduszką finansową.",
          "<strong>Co robić zamiast tego?</strong> Przeczytaj dokument dwa razy. Tego samego dnia zrób notatkę z przebiegu spotkania: kto, co powiedział, jakimi słowami. I daj sobie czterdzieści osiem godzin, zanim na cokolwiek odpowiesz.",
        ],
      },
      {
        h2: "Jak przejść przez plan naprawczy? Pięć kroków",
        tresc: [
          "<strong>Krok 1. Doprecyzuj cele na piśmie.</strong><br />Jeśli którykolwiek cel jest nieostry, odpisz spokojnie: „Chcę mieć pewność, że dobrze rozumiem oczekiwania. Czy dobrze przyjmuję, że sukces w punkcie drugim oznacza konkretnie…?\" — i zaproponuj mierzalną wersję. Samo to pytanie zmienia układ sił: albo dostaniesz konkret, albo jego brak zostanie odnotowany.",
          "<strong>Krok 2. Potwierdzaj każde spotkanie kontrolne mailem.</strong><br />Trzy zdania po każdym spotkaniu: co ustalono, co zrobiłeś, co na następny tydzień. Jeśli spotkanie się nie odbyło — też to odnotuj, kulturalnie: „Rozumiem, że dzisiejsze spotkanie nie mogło się odbyć, czy możemy przełożyć je na czwartek?\".",
          "<strong>Krok 3. Dokumentuj wykonanie celów na bieżąco.</strong><br />Osiągnąłeś coś z planu — miej na to dowód: raport, liczbę, mail. Folder prywatny, poza infrastrukturą firmy, uzupełniany co tydzień.",
          "<strong>Krok 4. Równolegle przygotuj plan B.</strong><br />Odśwież CV, uporządkuj kontakty, zorientuj się w rynku. Nie dlatego, że się poddajesz — dlatego, że opcje dają spokój, a spokój daje lepsze wyniki w planie A. To nie jest zdrada wobec pracodawcy. To jest dorosłość.",
          "<strong>Krok 5. Zadbaj o siebie fizycznie.</strong><br />Plan naprawczy to maraton stresu. Sen, ruch i ktoś bliski, komu mówisz na głos, co się dzieje, robią różnicę między przejściem przez to z godnością a wypaleniem po drodze. Jeśli czujesz, że przestajesz sobie radzić, rozmowa ze specjalistą jest siłą, nie słabością.",
          "Cały ten mechanizm — dlaczego firmy dokumentują, co realnie zapisuje manager po rozmowie i jak wygląda gra o awans z drugiej strony stołu — opisuję szerzej w <a href=\"/ksiazka\">książce, nad którą pracuję</a>.",
        ],
      },
      {
        h2: "Czy plan naprawczy da się przetrwać?",
        tresc: [
          "Uczciwa odpowiedź brzmi: tak. Znam takie historie i osobiście widziałem ludzi, którzy wyszli z planu naprawczego obronną ręką i pracowali w tej samej firmie latami.",
          "Ale uczciwość wymaga też drugiej połowy: statystycznie częściej plan naprawczy kończy się rozstaniem.",
          "Dlatego mądra strategia ma zawsze dwa tory. <strong>Pierwszy: grasz o wygraną</strong>, uczciwie i z pełnym zaangażowaniem — bo szansa jest realna, a Twoja postawa w tym okresie buduje również Twoją pozycję na rynku. <strong>Drugi: równolegle budujesz opcje</strong> — bo jeśli mimo wszystko dojdzie do rozstania, wchodzisz w nie przygotowany, z pozycji siły, a nie zaskoczenia.",
          "Warto też przedefiniować, czym jest wygrana. Nie zawsze oznacza „zostaję w firmie\". Czasem wygrana to „odchodzę w swoim tempie, na wynegocjowanych warunkach, prosto do lepszego miejsca\". Obie wersje widziałem i obie są zwycięstwem.",
        ],
      },
    ],
    zapamietaj: [
      "<strong>Plan naprawczy to proces, nie wyrok.</strong> Za dokumentem stoi historia rozmów, konsultacji i procedur — a proces ma zasady, które można poznać.",
      "<strong>Istnieją dwa rodzaje planów</strong>: pisany pod sukces i pisany pod dokumentację. Rozpoznasz je po mierzalności celów i po tym, czy spotkania kontrolne faktycznie się odbywają.",
      "<strong>W pierwszych 48 godzinach</strong>: nie podpisuj pochopnie, nie wysyłaj maila w emocjach, nie rzucaj papierami.",
      "<strong>Od pierwszego dnia dokumentuj postępy</strong> i równolegle buduj plan B. Opcje dają spokój, a spokój poprawia wyniki.",
      "<strong>Przy wątpliwościach co do treści dokumentu</strong> skonsultuj się z prawnikiem od prawa pracy — od razu, nie po fakcie.",
    ],
    powiazane: [4, 1],
    cta: {
      gora:
        '<strong>Darmowa checklista dokumentowania:</strong> wzór notatki po trudnej ' +
        'rozmowie i dziesięć gotowych zdań, które w czasie planu naprawczego są na wagę złota.',
      dol:
        '<strong>Darmowa checklista dokumentowania.</strong> Wzór notatki po trudnej ' +
        'rozmowie i dziesięć gotowych zdań. Dostaniesz ją mailem, za darmo.',
    },
    // Nota prawna jest tu obowiązkowa — tekst mówi o tym, co potwierdza podpis
    // pod dokumentem. Klaudiusz podał jej treść w dokumencie z 3.09.
    notaPrawna:
      'Ten materiał nie jest poradą prawną. Opisuję mechanizmy i praktykę korporacyjną ' +
      'z perspektywy managera. W konkretnej sprawie skontaktuj się z prawnikiem ' +
      'specjalizującym się w prawie pracy.',
    transkrypcja: transkrypcje[2],
    // ⚠️ Pakietu PIP (749 zł) nie promujemy nigdzie, dopóki księgowa nie odpowie
    // w sprawie VAT. To jest strona, na której pokusa jest największa.
    konsultacje: false,
    gotowa: true,   // ✅ zaakceptowane przez Michała 3.09
  },
  {
    nr: 1,
    slug: 'negatywny-feedback-od-szefa',
    zapytanie: 'jak reagować na krytykę od szefa',
    tytul: 'Negatywny feedback od szefa — jak zareagować i odpowiedzieć',
    opis:
      'Dostałeś krytykę od przełożonego? Wyjaśniam, skąd naprawdę bierze się feedback, czego nie mówić w pierwszej reakcji i jak odpowiedzieć na piśmie.',
    h1: 'Negatywny feedback od szefa. Jak zareagować?',
    lead: [
      "Dostałeś od szefa maila z krytyką i palce już wiszą nad klawiaturą, żeby odpisać. Zatrzymaj się — bo ten mail przed chwilą stał się dokumentem. I Twoja odpowiedź też nim będzie.",
      "Przez dwadzieścia lat pracowałem w korporacjach, od specjalisty po senior managera. Siedziałem po obu stronach tego stołu: dawałem takie maile i takie maile dostawałem. Poniżej trzy rzeczy — co ten feedback naprawdę oznacza, czego nie robić w pierwszym odruchu i jak odpowiedzieć tak, żeby za pół roku podziękować sobie za spokój.",
    ],
    sekcje: [
      {
        h2: "Skąd naprawdę bierze się feedback od przełożonego?",
        tresc: [
          "Feedback bardzo rzadko rodzi się w głowie szefa w dniu, w którym go słyszysz.",
          "Za feedbackiem — zwłaszcza pisemnym — prawie zawsze stoi jakiś proces. Presja z góry. Przegląd wyników zespołu. Zbliżająca się ocena roczna. Czasem czyjaś skarga, o której nie wiesz.",
          "Twój szef też ma szefa. I czasem informacja zwrotna, którą dostajesz, jest po prostu zadaniem, które ktoś mu zlecił — pozycją z listy „do zaadresowania przed końcem kwartału\".",
          "Czy to usprawiedliwia byle jaką formę? Nie. Ale zmienia Twoją strategię o sto osiemdziesiąt stopni. Bo nie walczysz z człowiekiem — odpowiadasz procesowi. A procesem, w przeciwieństwie do emocji, da się zarządzać.",
          "<strong>Jedno zdanie do zapamiętania: feedback to rzadko wyrok. Najczęściej to zapis w procesie.</strong>",
        ],
      },
      {
        h2: "Feedback ustny a pisemny — dlaczego to zupełnie różne sytuacje?",
        tresc: [
          "Różnica nie leży w słowach, tylko w formie — i jest kluczowa.",
          "<strong>Feedback ustny</strong>, na spotkaniu jeden na jeden, to rozmowa. Może być trudna, może być niesprawiedliwa, ale jest ulotna. Kończy się, gdy wychodzisz z pokoju.",
          "<strong>Feedback na piśmie</strong> — mail, formularz, wpis w systemie HR — to dokument. On nie znika. Może wrócić przy ocenie rocznej. Przy rozmowie o podwyżce. Przy restrukturyzacji, o której dziś nikt jeszcze nie myśli.",
          "Prosty test, który stosuję od lat: czy to, co właśnie usłyszałem albo przeczytałem, ktoś mógłby za rok wyciągnąć z segregatora? Jeśli tak — traktuj to odpowiednio poważnie.",
          "I jeszcze jedno, o czym mało kto wie. Po rozmowie jeden na jeden szef często coś zapisuje — notatkę dla siebie, wpis w systemie, czasem krótki mail do HR „dla porządku\". To nie jest spisek, tylko standard pracy managera. Sam to robiłem przez lata.",
          "Wniosek jest prosty: skoro firma dokumentuje, Ty też masz do tego prawo.",
        ],
      },
      {
        h2: "Jakich trzech zdań nie mówić w pierwszej reakcji?",
        tresc: [
          "Siedzisz na tej rozmowie, emocje skaczą. Są trzy zdania, które w tej sytuacji pogrążają najbardziej.",
          "<strong>„To nieprawda!\"</strong> — albo jakakolwiek obrona wystrzelona w pierwszych dziesięciu sekundach. Nawet jeśli masz stuprocentową rację, natychmiastowa obrona brzmi jak panika. Pierwsza reakcja ma być pytaniem, nie tarczą.",
          "<strong>„To nie ja, to kolega. To inny zespół. To system.\"</strong> — może to nawet prawda. Ale powiedziane w emocjach brzmi jak zrzucanie winy i tak zostanie zapamiętane. Fakty o tym, co nie zależało od Ciebie, przedstawia się na spokojnie, na piśmie, z dowodami.",
          "<strong>„Skoro tak, to może ja się tu nie nadaję.\"</strong> — najgroźniejsze z całej trójki. Rozumiem, skąd się bierze, ale to zdanie-pułapka. Wypowiedziane w emocjach potrafi zostać zapamiętane — albo, co gorsza, zanotowane — jako sygnał, że sam myślisz o odejściu.",
          "<strong>Co zamiast tego?</strong> Jedno uniwersalne zdanie, które otwiera każdą taką rozmowę we właściwą stronę: <em>„Chcę to dobrze zrozumieć. Możesz podać konkretny przykład?\"</em>",
          "Konkret jest Twoim najlepszym sprzymierzeńcem. Ogólników — takich jak „bądź bardziej proaktywny\" — nie da się ani naprawić, ani rzeczowo odeprzeć. Konkret można i jedno, i drugie.",
        ],
      },
      {
        h2: "Jak odpowiedzieć na feedback na piśmie?",
        tresc: [
          "Pięć kroków, w tej kolejności.",
          "<strong>Krok 1. Wysłuchaj albo przeczytaj do końca.</strong> Bez przerywania, bez zgadzania się i bez zaprzeczania. A potem dopytaj o konkrety: przykłady, daty, oczekiwania. Samo dopytywanie zmienia dynamikę rozmowy — pokazuje, że traktujesz sprawę poważnie, a nie emocjonalnie.",
          "<strong>Krok 2. Nie odpowiadaj tego samego dnia.</strong> To najważniejszy krok z całej piątki. Powiedz: „Dziękuję za tę rozmowę. Chcę się do niej rzetelnie odnieść — wrócę do Ciebie do środy\". To nie jest słabość, tylko profesjonalizm. Najlepsza odpowiedź na krytykę przez pierwsze dwadzieścia cztery godziny to żadna odpowiedź.",
          "<strong>Krok 3. Tego samego dnia zrób notatkę dla siebie.</strong> Kto, co powiedział, kiedy, jakimi słowami, przy kim. Pięć minut. Pamięć przekłamuje szczegóły szybciej, niż nam się wydaje — a szczegóły to cała wartość.",
          "<strong>Krok 4. Odpowiedz na piśmie, według prostej struktury.</strong> Podziękowanie za rozmowę. Co przyjmujesz i nad czym będziesz pracować. Z czym się nie zgadzasz — już nie emocjami, tylko faktami. I na końcu prośba o doprecyzowanie oczekiwań.",
          "<strong>Krok 5. Ustal, jak będzie mierzona poprawa.</strong> Zapytaj wprost: „Po czym poznamy za miesiąc, że jest lepiej?\". Bez odpowiedzi na to pytanie feedback może wracać w nieskończoność, bo nikt nie ustawił linii mety.",
        ],
      },
      {
        h2: "Kiedy feedback jest sygnałem czegoś poważniejszego?",
        tresc: [
          "W większości przypadków feedback to po prostu feedback. Nawet ten niezręczny, nawet ten niesprawiedliwy. Ale są sygnały, przy których warto mieć oczy szeroko otwarte:",
          "<ul><li>pisemny feedback, który pojawia się nagle, nie wiadomo skąd, po latach dobrych ocen,</li><li>prośby o potwierdzanie na piśmie rzeczy, które zawsze załatwiało się ustnie,</li><li>zmiana tonu, której nie umiesz sobie wytłumaczyć.</li></ul>",
          "Pojedynczy sygnał nie znaczy nic. Wzorzec znaczy dużo. A jeśli widzisz wzorzec, od dziś dokumentujesz wszystko systematycznie.",
          "A jeśli ta sytuacja dzieje się u Ciebie właśnie teraz i wolisz omówić konkrety zamiast ogólnych zasad — <a href=\"/konsultacje\">tak wygląda konsultacja</a>.",
          "Czasem pisemny feedback bywa też pierwszym krokiem do planu naprawczego — i wtedy warto wiedzieć, <a href=\"/odcinki/plan-naprawczy-pip\">czym taki plan naprawdę jest</a>.",
        ],
      },
    ],
    zapamietaj: [
      "<strong>Feedback to proces, nie wyrok.</strong> Za pisemną krytyką prawie zawsze stoi coś, co zaczęło się wcześniej.",
      "<strong>Pisemny traktuj poważniej niż ustny.</strong> Rozmowa się kończy, dokument zostaje.",
      "<strong>Nigdy nie odpowiadaj w dniu, w którym emocje są najwyżej.</strong> Dwadzieścia cztery godziny zwłoki to najtańsze zabezpieczenie, jakie masz.",
      "<strong>Zawsze pytaj o konkret.</strong> Ogólnika nie da się ani naprawić, ani odeprzeć.",
      "<strong>Ustal miarę poprawy.</strong> Bez linii mety ten sam feedback wróci za kwartał.",
    ],
    cta: {
      gora:
        '<strong>Darmowa checklista:</strong> wzór notatki po trudnej rozmowie i dziesięć ' +
        'gotowych zdań na niesprawiedliwy feedback — wszystko, o czym mówię niżej, do ręki.',
      dol:
        '<strong>Darmowa checklista.</strong> Wzór notatki po trudnej rozmowie i dziesięć ' +
        'gotowych zdań na niesprawiedliwy feedback. Dostaniesz ją mailem, za darmo.',
    },
    transkrypcja: transkrypcje[1],
    powiazane: [2, 4],
    konsultacje: true,
    gotowa: true,   // ✅ zaakceptowane przez Michała 3.09
  },

  // ── Kolejne strony. Zapytania i slugi zatwierdzone przez Klaudiusza 2.09,
  //    nie zmieniamy ich bez sprawdzenia całej mapy. Treść dochodzi etapami.
  //    Ocena roczna (#5) wchodzi jako TRZECIA, w pierwszym tygodniu października
  //    — ma być wysoko w grudniu, kiedy zaczyna się sezon ocen.
  {
    nr: 5, slug: 'niesprawiedliwa-ocena-roczna',
    zapytanie: 'niesprawiedliwa ocena roczna co zrobić',
    tytul: '', opis: '', h1: '', lead: '', sekcje: [], zapamietaj: [],
    powiazane: [1, 2], konsultacje: true, gotowa: false,
  },
  {
    nr: 3, slug: 'mobbing-w-pracy-gdzie-granica',
    zapytanie: 'czy to już mobbing w pracy',
    tytul: '', opis: '', h1: '', lead: '', sekcje: [], zapamietaj: [],
    powiazane: [4, 6], konsultacje: false, gotowa: false,
  },
  {
    nr: 4, slug: 'jak-dokumentowac-sytuacje-w-pracy',
    zapytanie: 'jak dokumentować sytuacje w pracy',
    tytul: '', opis: '', h1: '', lead: '', sekcje: [], zapamietaj: [],
    powiazane: [1, 3], konsultacje: true, gotowa: false,
  },
  {
    nr: 6, slug: 'wypalenie-czy-zmeczenie',
    zapytanie: 'wypalenie zawodowe czy zwykłe zmęczenie',
    tytul: '', opis: '', h1: '', lead: '', sekcje: [], zapamietaj: [],
    // ⚠️ Temat wrażliwy: nota edukacyjna w pierwszej linii, CTA tylko do checklisty.
    powiazane: [3, 7], konsultacje: false, gotowa: false,
  },
  {
    nr: 7, slug: 'rozmowa-1-na-1-z-szefem',
    zapytanie: 'jak przygotować się do rozmowy 1:1 z szefem',
    tytul: '', opis: '', h1: '', lead: '', sekcje: [], zapamietaj: [],
    powiazane: [1, 5], konsultacje: true, gotowa: false,
  },
  {
    nr: 8, slug: 'spotkanie-z-hr-bez-tematu',
    zapytanie: 'zaproszenie na spotkanie z HR co to znaczy',
    tytul: '', opis: '', h1: '', lead: '', sekcje: [], zapamietaj: [],
    powiazane: [2, 4], konsultacje: true, gotowa: false,
  },
  {
    nr: 9, slug: 'jak-rozmawiac-o-podwyzce',
    zapytanie: 'jak rozmawiać o podwyżce z szefem',
    tytul: '', opis: '', h1: '', lead: '', sekcje: [], zapamietaj: [],
    powiazane: [5, 10], konsultacje: true, gotowa: false,
  },
  {
    nr: 10, slug: 'awans-w-korporacji',
    zapytanie: 'kiedy zapada decyzja o awansie',
    tytul: '', opis: '', h1: '', lead: '', sekcje: [], zapamietaj: [],
    powiazane: [9, 5], konsultacje: true, gotowa: false,
  },
];

/** Strony realnie budowane — tylko te z kompletną treścią. */
export const stronyGotowe = stronyOdcinkow.filter((s) => s.gotowa);
