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
// ⚠️ ZASADA NR 3 (Klaudiusz, 3.09): obserwacje tak, opowiedziane historie nie.
// Granica biegnie między obserwacją a opowieścią:
//   ✅ obserwacja — jedno-dwa zdania, bez sceny, bez bohatera, bez przebiegu
//      wydarzeń („Widziałem plan, który uratował człowieka, i plan, który był
//      tylko odliczaniem"). Buduje wiarygodność, a Google premiuje treść,
//      w której widać realne doświadczenie autora.
//   ❌ opowiedziana historia — scena, konkretna osoba, dialog, przebieg w czasie,
//      puenta. To zostaje w książce i to jest to, za co ludzie płacą.
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
//   pomost      JEDNO zdanie (HTML) pod sekcją „Co zapamiętać", otwierające
//               następny temat, z linkiem wewnętrznym. Ma otwierać pytanie, a nie
//               sprzedawać — decyzja Klaudiusza z 3.09. Podsumowania NIE zastępuje:
//               „Co zapamiętać" zostaje, bo Google chętnie wyciąga je do wyników.
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

// ⚠️ KOLEJNOŚĆ I ADRESY — ustalone z Klaudiuszem 14.09, jedna strona co dwa tygodnie:
//   1.10  odc. 5  niesprawiedliwa-ocena-roczna
//   8.10  odc. 9  jak-rozmawiac-o-podwyzce
//  15.10  odc.10  dlaczego-nie-dostalem-awansu
//  29.10  odc. 3  mobbing-w-pracy-gdzie-granica
//  12.11  odc. 6  wypalenie-czy-zmeczenie
//  26.11  odc.11  nowy-szef-w-zespole
//  10.12  odc.12  zmiana-pracy-kiedy-odejsc
//   7.01  odc. 4  jak-dokumentowac-sytuacje-w-pracy
//  styczeń odc. 7 rozmowa-1-na-1-z-szefem
//
// ✅ 11.10: strona #4 i #7 opublikowane, linki wstawione w #1, #2, #5 (Klaudiusz). Poprzednia notatka:
// ⚠️ ZADANIE NA STYCZEŃ: dopóki strona o dokumentowaniu (odc. 4) nie istnieje,
// NIE wstawiamy do niej linków z pozostałych tekstów — odsyłacz do nieistniejącej
// strony jest gorszy niż jego brak. Po 7.01 wstawiamy je hurtem, przechodząc przez
// strony 1–7. Bez tego kroku zostanie sierota: tekst-węzeł, do którego nikt nie linkuje.

export const stronyOdcinkow = [
  {
    nr: 2,
    slug: 'plan-naprawczy-pip',
    zapytanie: 'plan naprawczy w pracy co to jest',
    // title/description podmienione 23.09.2026 razem z nową sekcją „Jak czytać plan
    // naprawczy, który dostałeś". Copy: Klaudiusz. ⚠️ „zanim podpiszesz cokolwiek"
    // zostaje — jest spójne z tym, co odcinek i książka mówią o podpisie (potwierdzenie
    // odbioru ≠ zgoda). Nie zmieniać na „zanim zaakceptujesz". Poprzednia wersja:
    // 'Plan naprawczy w pracy — co oznacza PIP i co teraz zrobić'.
    tytul: 'Plan naprawczy (PIP) — jak go czytać, zanim podpiszesz cokolwiek',
    opis:
      'Sześć elementów, które ma dobry plan naprawczy — i sześć pytań, które zadajesz, gdy ich brakuje. Jak odróżnić plan od dokumentacji decyzji, która już zapadła.',
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
          "<strong>Błąd drugi: emocjonalna kontrofensywa.</strong><br />Długi mail o niesprawiedliwości, wysłany wieczorem w dniu otrzymania planu. Wszystko, co napiszesz, <a href=\"/odcinki/negatywny-feedback-od-szefa/\">staje się dokumentem</a>. Twoja pisemna odpowiedź powstanie — ale za dwa, trzy dni, na zimno i z faktami.",
          "<strong>Błąd trzeci, najgroźniejszy: rzucenie papierami.</strong><br />„Skoro tak, to ja dziękuję\". Rozumiem tę emocję doskonale. Ale odejście z dnia na dzień, w gniewie, to zwykle najgorsza finansowo i strategicznie wersja odejścia. Jeśli masz odchodzić — odejdziesz na swoich warunkach, w swoim czasie, z przemyślaną poduszką finansową.",
          "<strong>Co robić zamiast tego?</strong> Przeczytaj dokument dwa razy. Tego samego dnia zrób notatkę z przebiegu spotkania: kto, co powiedział, jakimi słowami. I daj sobie czterdzieści osiem godzin, zanim na cokolwiek odpowiesz.",
        ],
      },
      {
        h2: "Jak przejść przez plan naprawczy? Pięć kroków",
        tresc: [
          "<strong>Krok 1. Doprecyzuj cele na piśmie.</strong><br />Jeśli którykolwiek cel jest nieostry, odpisz spokojnie: „Chcę mieć pewność, że dobrze rozumiem oczekiwania. Czy dobrze przyjmuję, że sukces w punkcie drugim oznacza konkretnie…?\" — i zaproponuj mierzalną wersję. Samo to pytanie zmienia układ sił: albo dostaniesz konkret, albo jego brak zostanie odnotowany.",
          "<strong>Krok 2. Potwierdzaj każde spotkanie kontrolne mailem.</strong><br />Trzy zdania po każdym spotkaniu: co ustalono, co zrobiłeś, co na następny tydzień. Jeśli spotkanie się nie odbyło — też to odnotuj, kulturalnie: „Rozumiem, że dzisiejsze spotkanie nie mogło się odbyć, czy możemy przełożyć je na czwartek?\".",
          "<strong>Krok 3. Dokumentuj wykonanie celów na bieżąco.</strong><br />Osiągnąłeś coś z planu — miej na to dowód: raport, liczbę, mail. Folder prywatny, poza infrastrukturą firmy, uzupełniany co tydzień. Jak robić to bezpiecznie, opisuję przy <a href=\"/odcinki/jak-dokumentowac-sytuacje-w-pracy/\">dokumentowaniu sytuacji w pracy</a>.",
          "<strong>Krok 4. Równolegle przygotuj plan B.</strong><br />Odśwież CV, uporządkuj kontakty, zorientuj się w rynku. Nie dlatego, że się poddajesz — dlatego, że opcje dają spokój, a spokój daje lepsze wyniki w planie A. To nie jest zdrada wobec pracodawcy. To jest dorosłość.",
          "<strong>Krok 5. Zadbaj o siebie fizycznie.</strong><br />Plan naprawczy to maraton stresu. Sen, ruch i ktoś bliski, komu mówisz na głos, co się dzieje, robią różnicę między przejściem przez to z godnością a wypaleniem po drodze. Jeśli czujesz, że przestajesz sobie radzić, rozmowa ze specjalistą jest siłą, nie słabością.",
          "Cały ten mechanizm — dlaczego firmy dokumentują, co realnie zapisuje manager po rozmowie i jak wygląda gra o awans z drugiej strony stołu — opisuję szerzej w <a href=\"/ksiazka/\">książce, nad którą pracuję</a>.",
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
      // Sekcja dopisana 23.09.2026. Tekst: Klaudiusz,
      // `Sekcja_jak-czytac-plan-naprawczy_odcinek-02_tresc.md`.
      // Reszta odcinka bez zmian. Ostatni akapit linkuje do nowej strony B2B
      // — obie strony wchodzą jednym commitem, żeby link nie prowadził w pustkę.
      // Śródtytuł „Co z tego wynika" jest pogrubionym akapitem, nie <h3>:
      // renderer `[slug].astro` opakowuje każdy element `tresc` w <p>.
      {
        h2: "Jak czytać plan naprawczy, który dostałeś — punkt po punkcie",
        tresc: [
          "Dostałeś dokument. Zanim zrobisz cokolwiek innego, przeczytaj go tak, jak czytałby go ktoś, kto takie dokumenty pisał. Dobry plan naprawczy ma sześć elementów. Sprawdź, ile z nich jest w Twoim — bo od tego zależy, czy masz przed sobą plan, czy dokumentację decyzji, która już zapadła.",
          "<strong>1. Cel.</strong> Czy jest napisane jednym zdaniem, co ma się zmienić? „Poprawa wyników\" to nie cel, to nastrój. Jeśli celu nie ma albo jest ogólny — Twoje pierwsze pytanie brzmi: <em>„Po czym poznamy, że plan się udał?\"</em>",
          "<strong>2. Kryteria.</strong> Czy da się je zmierzyć? „Terminowość 95% w ujęciu tygodniowym\" — tak. „Większe zaangażowanie\" — nie. Kryterium, którego nie da się sprawdzić na koniec, jest kryterium, o które będzie spór na koniec. Pytanie: <em>„Jaka jest wartość dziś, jaka docelowa i skąd weźmiemy liczby?\"</em>",
          "<strong>3. Termin.</strong> Czy jest data zakończenia — konkretna, nie „około sześciu tygodni\"? Jeśli jej nie ma, plan może trwać, dopóki komuś jest to wygodne. Pytanie: <em>„Do kiedy dokładnie?\"</em>",
          "<strong>4. Wsparcie.</strong> Co firma daje, a nie tylko czego oczekuje: szkolenie, mentor, zmiana zakresu, narzędzie. Plan bez wsparcia to test — a test ma sens tylko wtedy, gdy wynik nie jest znany z góry. Jeśli tej rubryki nie ma, poproś, żeby była: <em>„Co dostanę, żeby to osiągnąć?\"</em>",
          "<strong>5. Spotkania kontrolne.</strong> Czy są zaplanowane z góry, z datami? Jeśli plan mówi „będziemy się spotykać\", a nie mówi kiedy — spotkania nie będą. I to Ty po nich będziesz pisał notatkę: co omówione, co ustalone, wysłaną tego samego dnia. Nie czekaj, aż zrobi to szef.",
          "<strong>6. Co się dzieje na końcu.</strong> Obie wersje, na piśmie: co oznacza spełnienie kryteriów i co oznacza ich niespełnienie. Jeśli dokument mówi tylko o jednej — wiesz, którą stronę ktoś już wybrał.",
          "<strong>Co z tego wynika</strong>",
          "Jeśli w Twoim planie jest pięć albo sześć z tych elementów — masz plan. Traktuj go poważnie, bo ktoś włożył w niego pracę i realnie daje Ci szansę.",
          "Jeśli są dwa albo trzy — masz dokument, który ma wyglądać jak plan. To nie znaczy, że masz się poddać. Znaczy, że Twoim pierwszym ruchem jest doprowadzenie do tego, żeby brakujące elementy się w nim znalazły — na piśmie, po Twoim mailu, z datą. Prośba o kryteria i termin nie jest konfrontacją. Jest jedyną rzeczą, która zamienia teatr w coś, co da się wygrać.",
          "A jeśli nie ma prawie nic — przeczytaj jeszcze raz część tego odcinka o tym, jak wygląda plan, w którym decyzja zapadła wcześniej. I policz, ile jest Cię stać na to, żeby to sprawdzić.",
          "<em>Jeśli jesteś po drugiej stronie tego stołu i to Ty masz wręczyć plan — <a href=\"/dla-firm/plan-naprawczy-wzor/\">tu jest wzór, który jest planem, a nie wyrokiem</a>.</em>",
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
    // Zdanie pomostowe: tekst Klaudiusza z 3.09. Link dopisany 4.09, razem
    // z publikacją strony odcinka 8 — wcześniej wisiał bez linku, bo adres
    // /odcinki/spotkanie-z-hr-bez-tematu jeszcze nie istniał (byłoby 404).
    pomost:
      'A jeśli mimo wszystko dojdzie do rozstania, na stole pojawia się inny dokument ' +
      '— i wtedy różnica między <a href="/odcinki/spotkanie-z-hr-bez-tematu/">wypowiedzeniem ' +
      'a porozumieniem stron</a> zaczyna decydować o pieniądzach.',
    // ⚠️ Pakietu PIP (749 zł) nie promujemy nigdzie, dopóki księgowa nie odpowie
    // w sprawie VAT. To jest strona, na której pokusa jest największa.
    konsultacje: false,
    gotowa: true,   // ✅ zaakceptowane przez Michała 3.09
  },
  {
    nr: 1,
    slug: 'negatywny-feedback-od-szefa',
    zapytanie: 'jak reagować na krytykę od szefa',
    // title/description podmienione 23.09.2026. Search Console pokazało na tej
    // stronie dużo wyświetleń przy niskim CTR — treść strony zostaje bez zmian,
    // zmieniamy tylko to, co widać w wynikach. Copy: Klaudiusz. Cel: CTR > 5%,
    // odczyt w Search Console za 2–3 tygodnie (ok. 14.10). Poprzednia wersja:
    // 'Negatywny feedback od szefa — jak zareagować i odpowiedzieć'.
    tytul: 'Negatywny feedback od szefa — co zrobić w pierwszych 48 h',
    opis:
      'Nie odpowiadaj tego samego dnia. Zapytaj o kryteria, nie o szansę. Zapisz fakty w 5 minut. Trzy kroki po trudnej rozmowie — z perspektywy byłego menedżera.',
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
          "<strong>Feedback ustny</strong>, na <a href=\"/odcinki/rozmowa-1-na-1-z-szefem/\">spotkaniu jeden na jeden</a>, to rozmowa. Może być trudna, może być niesprawiedliwa, ale jest ulotna. Kończy się, gdy wychodzisz z pokoju.",
          "<strong>Feedback na piśmie</strong> — mail, formularz, wpis w systemie HR — to dokument. On nie znika. Może wrócić przy ocenie rocznej. Przy rozmowie o podwyżce. Przy <a href=\"/odcinki/restrukturyzacja-w-firmie-co-robic/\">restrukturyzacji</a>, o której dziś nikt jeszcze nie myśli.",
          "Prosty test, który stosuję od lat: czy to, co właśnie usłyszałem albo przeczytałem, ktoś mógłby za rok wyciągnąć z segregatora? Jeśli tak — traktuj to odpowiednio poważnie.",
          "I jeszcze jedno, o czym mało kto wie. Po rozmowie jeden na jeden szef często coś zapisuje — notatkę dla siebie, wpis w systemie, czasem krótki mail do HR „dla porządku\". To nie jest spisek, tylko standard pracy managera. Sam to robiłem przez lata.",
          "Wniosek jest prosty: skoro firma dokumentuje, Ty też masz do tego prawo — a <a href=\"/odcinki/jak-dokumentowac-sytuacje-w-pracy/\">dokumentowanie sytuacji w pracy</a> jest prostsze, niż się wydaje.",
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
          "A jeśli ta sytuacja dzieje się u Ciebie właśnie teraz i wolisz omówić konkrety zamiast ogólnych zasad — <a href=\"/konsultacje/\">tak wygląda konsultacja</a>.",
          "Czasem pisemny feedback bywa też pierwszym krokiem do planu naprawczego — i wtedy warto wiedzieć, <a href=\"/odcinki/plan-naprawczy-pip/\">czym taki plan naprawdę jest</a>.",
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
    // Zdanie pomostowe: tekst Klaudiusza z 3.09. Tu link działa od razu, bo strona
    // o planie naprawczym jest już opublikowana.
    pomost:
      'Bywa też tak, że pisemny feedback jest pierwszym krokiem do czegoś większego ' +
      '— do planu naprawczego. <a href="/odcinki/plan-naprawczy-pip/">Czym on naprawdę ' +
      'jest, wyjaśniam tutaj</a>.',
    powiazane: [2, 4],
    konsultacje: true,
    gotowa: true,   // ✅ zaakceptowane przez Michała 3.09
  },

  // ── Kolejne strony. Zapytania i slugi zatwierdzone przez Klaudiusza 2.09,
  //    nie zmieniamy ich bez sprawdzenia całej mapy. Treść dochodzi etapami.
  //    Ocena roczna (#5) wchodzi jako TRZECIA, w pierwszym tygodniu października
  //    — ma być wysoko w grudniu, kiedy zaczyna się sezon ocen.
  {
    nr: 5, slug: "niesprawiedliwa-ocena-roczna",
    zapytanie: "niesprawiedliwa ocena roczna co zrobić",
    tytul: "Niesprawiedliwa ocena roczna — co zrobić, zanim potwierdzisz formularz",
    opis: "Dostałeś ocenę, która nie pasuje do Twojego roku? Wyjaśniam, gdzie ta ocena naprawdę zapadła, czego nie robić na rozmowie i jak pracować na następną.",
    h1: "Niesprawiedliwa ocena roczna. Co możesz z nią zrobić?",
    lead: [
      "Rok pracy, nadgodziny, projekty, które się udały — i w formularzu środek skali. Albo niżej. Pierwszy odruch jest zawsze ten sam: udowodnić na rozmowie, że to pomyłka.",
      "Przez dwadzieścia lat pracowałem w korporacjach, od specjalisty po senior managera. Oceny dostawałem i wystawiałem, siedziałem też w salach, w których się je ustala. Poniżej to, co wiem o tym, jak ocena powstaje naprawdę — i co z nią realnie da się zrobić.",
    ],
    sekcje: [
      {
        h2: "Gdzie naprawdę zapada Twoja ocena roczna?",
        tresc: [
          "W większości dużych firm nie na rozmowie z szefem. Zapada wcześniej, na spotkaniu, które nazywa się kalibracją: przełożeni kilku zespołów siadają razem i porównują ludzi między sobą, zwykle w odniesieniu do z góry ustalonego rozkładu ocen.",
          "Rozkład oznacza, że wysokich ocen jest ograniczona liczba. Jeśli w jednym zespole jest trzech świetnych ludzi, a w puli są dwie najwyższe oceny, ktoś dostanie niższą, chociaż na nią nie zasłużył. Nie dlatego, że ktoś go nie lubi. Dlatego, że system liczy procenty.",
          "Na tej sali Twój przełożony ma na Ciebie kilka minut i broni Cię tym, co ma w ręku. <strong>Rozmowa oceniająca, na którą siadasz kilka tygodni później, jest zwykle zakomunikowaniem decyzji, a nie jej podejmowaniem.</strong>",
        ],
      },
      {
        h2: "Czy „spełnia oczekiwania” to zła ocena?",
        tresc: [
          "Środek skali frustruje najbardziej, bo brzmi jak „przeciętny”. W praktyce w wielu firmach to ocena, którą dostaje większość zespołu — w tym ludzie, których przełożony bardzo ceni.",
          "To informacja o tym, jak działa system, a nie wyrok o Tobie. Znaczenia nabiera dopiero wtedy, gdy łączy się z czymś jeszcze: z podwyżką, z awansem albo z tym, co wpisano Ci w „obszary rozwoju”.",
        ],
      },
      {
        h2: "Czy warto kłócić się o ocenę na rozmowie?",
        tresc: [
          "Nie. To najczęstszy i najdroższy błąd.",
          "Twój szef zwykle nie może zmienić oceny na tym spotkaniu — musiałby wrócić na kalibrację i otworzyć temat przy wszystkich. Prosząc go o to, prosisz o coś, czego nie zrobi, a jedyny trwały efekt to wrażenie, że ocenę przyjąłeś emocjonalnie.",
          "Pierwsza reakcja ma być pytaniem, nie obroną — dokładnie tak jak przy <a href=\"/odcinki/negatywny-feedback-od-szefa/\">negatywnym feedbacku od szefa</a>. Pytanie, które naprawdę coś daje, brzmi: <strong>„Co konkretnie musi się wydarzyć, żeby następna ocena była wyższa?”</strong>",
        ],
      },
      {
        h2: "Co sprawdzić w formularzu, zanim go potwierdzisz?",
        tresc: [
          "Formularz oceny to dokument. Wraca przy podwyżce, przy awansie, przy zmianach w strukturze. Zanim klikniesz „potwierdzam”, przeczytaj każdą sekcję.",
          "Najuważniej czytaj „obszary rozwoju”. To jedyna część formularza, która patrzy w przyszłość — i jeśli kiedyś powstanie <a href=\"/odcinki/plan-naprawczy-pip/\">plan naprawczy</a>, to zwykle wyrasta właśnie z tego, co przez kolejne cykle tam wpisywano.",
          "W wielu systemach możesz dodać własny komentarz. Nie musisz. Ale jeśli zgadzasz się z czymś tylko częściowo, krótki, rzeczowy komentarz z faktami jest lepszy niż milczenie.",
        ],
      },
      {
        h2: "Kiedy niesprawiedliwa ocena to sygnał ostrzegawczy?",
        tresc: [
          "Zwykle ocena roczna jest po prostu rytuałem systemu — czasem niesprawiedliwym, często frustrującym, ale rytuałem. Są jednak trzy sytuacje, w których warto mieć oczy otwarte.",
          "<strong>Nagła obniżka po latach dobrych ocen</strong>, bez wcześniejszej rozmowy i bez konkretów. <strong>Ocena sprzeczna z tym, co słyszałeś przez cały rok</strong> — feedback był dobry, wynik nagle nie jest. <strong>Sformułowania w „obszarach rozwoju”, których nikt z Tobą nie omawiał</strong>, a które brzmią, jakby ktoś budował uzasadnienie.",
          "Pojedynczo każda z tych rzeczy może nic nie znaczyć. Razem to wzorzec — a wzorzec warto zacząć spokojnie dokumentować.",
        ],
      },
      {
        h2: "Jak pracować na następną ocenę?",
        tresc: [
          "Cały rok, nie godzinę. Twoim zadaniem jest dać przełożonemu to, czego potrzebuje na kalibracji: liczby, skalę, efekt. Manager z konkretami w ręku wygrywa rozmowę o Twojej ocenie. Manager z „on naprawdę dobrze pracuje” przegrywa.",
          "<strong>Raz w miesiącu, pięć minut:</strong> trzy rzeczy, które dowiozłeś, każda z liczbą. W grudniu nie piszesz samooceny z pamięci, tylko składasz ją z gotowych klocków.",
          "<strong>Samoocenę pisz dla ludzi, którzy Cię nie znają.</strong> Twój szef wie, co robiłeś. Samoocenę czytają — czasem cytują — inni przełożeni na kalibracji. Zamiast „byłem zaangażowany”: co, ile i z jakim efektem dla firmy.",
          "<strong>Po rozmowie oceniającej wyślij krótki mail</strong> z tym, co ustaliliście. Obietnica złożona ustnie ma tendencję do znikania przed kolejnym cyklem. Na piśmie nie znika. A o kolejną ocenę najlepiej zadbać na bieżąco — na <a href=\"/odcinki/rozmowa-1-na-1-z-szefem/\">spotkaniach 1:1 z szefem</a>.",
        ],
      },
    ],
    zapamietaj: [
      "<strong>Ocena zapada na kalibracji, nie na rozmowie.</strong> Na rozmowie dowiadujesz się o decyzji.",
      "<strong>Nie negocjuj oceny w sali.</strong> Zapytaj, co musi się wydarzyć, żeby następna była wyższa.",
      "<strong>„Obszary rozwoju” czytaj najuważniej</strong> — to jedyna część formularza, która patrzy w przyszłość.",
      "<strong>Na następną ocenę pracujesz cały rok:</strong> liczby co miesiąc, samoocena dla obcych, mail po rozmowie.",
    ],
    powiazane: [1, 2],
    pomost: "Ocena rzadko jest celem sama w sobie — zwykle po kilku tygodniach wraca jako argument w <a href=\"/odcinki/jak-rozmawiac-o-podwyzce/\">rozmowie o podwyżce</a>, która toczy się według bardzo podobnych zasad.",
    cta: { gora: "<strong>Darmowa checklista:</strong> wzór notatki po trudnej rozmowie i dziesięć gotowych zdań na sytuacje, w których ocena albo feedback wydają Ci się niesprawiedliwe.", dol: "<strong>Darmowa checklista.</strong> Wzór notatki po trudnej rozmowie i dziesięć gotowych zdań na sytuacje, w których ocena albo feedback wydają Ci się niesprawiedliwe. Dostaniesz ją mailem, za darmo." },
    notaPrawna: "To materiał edukacyjny oparty na doświadczeniu managerskim, a nie porada prawna. Zasady oceniania różnią się między firmami — przed potwierdzeniem lub zakwestionowaniem formularza warto sprawdzić wewnętrzne procedury, a w sprawach spornych skonsultować się z prawnikiem.",
    konsultacje: true,
    gotowa: true,   // treść Klaudiusz 1.10, publikacja na prośbę Michała 1.10
  },
  {
    nr: 3,
    slug: 'mobbing-w-pracy-gdzie-granica',
    zapytanie: 'czy to już mobbing w pracy',
    // Treść: Klaudiusz, 11.10 (z transkrypcji odc. 3, Ksiazka/Odcinek-03_transkrypcja.txt). Historie zostają w książce.
    tytul: 'Czy to już mobbing w pracy? Gdzie przebiega granica',
    opis: 'Wymagający szef czy mobbing? Pięć zachowań, które bolą, ale mobbingiem nie są, trzy wzorce, które już nim są, i test, który pozwala ocenić sytuację na chłodno.',
    h1: 'Czy to już mobbing w pracy, czy tylko wymagający szef?',
    lead: [
      'Jest 23:00, nie śpisz i wpisujesz w telefon: „czy to już mobbing”. Jeśli choć raz tak zrobiłeś, ta strona jest dla Ciebie.',
      'Przez dwadzieścia lat pracowałem w korporacjach, kilkanaście z nich jako manager. Widziałem wymagających szefów, którzy byli najlepszym, co mogło się przydarzyć w czyjejś karierze, i sytuacje, które miały już inną nazwę. Poniżej rozkładam tę granicę na części — tak, żebyś mógł ocenić swoją sytuację na chłodno.'
    ],
    sekcje: [
      {
        h2: 'Czym jest mobbing w pracy?',
        tresc: [
          'Emocje po obu stronach granicy wyglądają tak samo: stres, ścisk w żołądku, niechęć do poniedziałku. Nie odróżnią wymagającego szefa od mobbingu. Odróżnią je fakty i czas.',
          'Kodeks pracy opisuje mobbing jako działania <strong>uporczywe i długotrwałe</strong>, <strong>skierowane przeciwko konkretnej osobie</strong>, które prowadzą do jej poniżenia, ośmieszenia, izolowania lub wyeliminowania z zespołu. Zwróć uwagę, czego w tej definicji nie ma: wysokich wymagań, krytyki ani stresu.',
          '<strong>Mobbing to wzorzec, nie incydent.</strong> Pojedyncza sytuacja, nawet przykra i niesprawiedliwa, to jeszcze nie mobbing. Powtarzające się zachowania wymierzone w Ciebie — to jest to, czemu trzeba się przyjrzeć.'
        ]
      },
      {
        h2: 'Jakie zachowania szefa nie są mobbingiem?',
        tresc: [
          'Pięć rzeczy, które bolą i frustrują, ale mobbingiem nie są. Pomylenie ich z mobbingiem osłabia Twoją pozycję, gdyby kiedyś przyszło Ci mówić o prawdziwym problemie.',
          '<strong>Wysokie wymagania</strong> — szef, który trzyma poprzeczkę wysoko, wykonuje swoją pracę. <strong>Egzekwowanie terminów i rozliczanie z wyników</strong> — nieprzyjemna rozmowa o niedowiezionym projekcie to zarządzanie, nie nękanie. <strong>Krytyka merytoryczna z konkretami</strong> — „ten raport ma trzy błędy, tu, tu i tu” to feedback; o tym, <a href="/odcinki/negatywny-feedback-od-szefa/">jak reagować na krytykę od szefa</a>, piszę osobno. <strong>Zmiany organizacyjne</strong> mieszczące się w Twojej umowie. <strong>Pojedynczy konflikt</strong> — kłótnia, podniesiony głos, jedna niezręczna uwaga.',
          'Wspólny mianownik: wszystkie te rzeczy dotyczą pracy — zadań, wyników, organizacji. <strong>Mobbing dotyczy osoby.</strong>'
        ]
      },
      {
        h2: 'Jakie zachowania mogą być mobbingiem?',
        tresc: [
          'Trzy wzorce, które — jeśli powtarzają się tygodniami i są wymierzone w Ciebie — mają już swoją nazwę.',
          '<strong>Systematyczne poniżanie.</strong> Ośmieszanie przy zespole, komentarze o Tobie, a nie o Twojej pracy, przerywanie za każdym razem, gdy zabierasz głos, „żarty”, po których nikt się nie śmieje.',
          '<strong>Izolowanie.</strong> Przestajesz dostawać zaproszenia na spotkania, na których byłeś zawsze. Informacje potrzebne do pracy Cię omijają, Twoje zadania bez wyjaśnienia trafiają do innych. Z zewnątrz tego nie widać i dlatego ta forma jest tak niedoceniana.',
          '<strong>Zastraszanie.</strong> Groźby wprost albo między wierszami: „zastanów się, czy ci się to opłaca”. Sugestie, że upominanie się o swoje źle się skończy. Sankcje bez podstaw.',
          'O żadnym z tych wzorców nie decyduje pojedyncze zdarzenie. Decydują powtarzalność, czas i to, że celem jesteś Ty, a nie Twoja praca.'
        ]
      },
      {
        h2: 'Jak sprawdzić, czy to mobbing? Test wzorca',
        tresc: [
          'Przez najbliższe cztery tygodnie — nie dwa dni — po każdej trudnej sytuacji zapisz cztery rzeczy: <strong>co się wydarzyło</strong> (fakty, bez interpretacji), <strong>czego dotyczyło</strong> (pracy czy Ciebie jako osoby), <strong>kto był obecny i w jakiej formie</strong> (ustnie, mail, komunikator) oraz <strong>datę i godzinę</strong>.',
          'Po miesiącu nie oceniasz pojedynczych wpisów, tylko częstotliwość i kierunek. Kilka wpisów, różne osoby i różne sytuacje — prawdopodobnie trudny okres w trudnej firmie. Kilkanaście wpisów, jedna osoba i jeden kierunek — to wzorzec, czarno na białym w Twoich notatkach.',
          'Zapisuj też, jak to wpływa na Twoje zdrowie: sen, apetyt, niedzielne wieczory. Jeśli praca odbija się na zdrowiu, nie czekaj na wynik testu. Rozmowa z lekarzem albo psychologiem to nie ostateczność, tylko dbanie o siebie.'
        ]
      },
      {
        h2: 'Co zrobić, jeśli podejrzewasz mobbing?',
        tresc: [
          'Cztery kroki, spokojnie i po kolei.',
          '<strong>Dokumentuj dalej</strong>, systematycznie — każda sytuacja ma notatkę. <strong>Sprawdź procedury w firmie</strong> — większość dużych organizacji ma politykę antymobbingową i wewnętrzną ścieżkę zgłoszeń. Przeczytaj ją, zanim zrobisz jakikolwiek ruch; znajomość procedury to jeszcze nie zgłoszenie. <strong>Nie zostawaj z tym sam</strong> — porozmawiaj z zaufaną osobą w pracy albo poza nią; izolacja wzmacnia to zjawisko, rozmowa je osłabia. <strong>Przy poważnym wzorcu skonsultuj się z prawnikiem od prawa pracy</strong> — z dokumentacją taka rozmowa jest dużo skuteczniejsza.',
          'Czego nie robić: nie oskarżaj publicznie bez dokumentacji, nie odpowiadaj tym samym i nie podejmuj decyzji o odejściu w emocjach. Wszystko na chłodno i na papierze.'
        ]
      }
    ],
    zapamietaj: [
      '<strong>Emocje nie odróżnią trudnego szefa od mobbingu.</strong> Odróżni go wzorzec: uporczywość, czas i kierunek.',
      '<strong>Wymagania, terminy i krytyka z konkretami dotyczą pracy</strong> — to nie mobbing.',
      '<strong>Test wzorca:</strong> cztery tygodnie notatek — co, czego dotyczyło, kto był obecny, kiedy.',
      '<strong>Jeśli wzorzec się potwierdzi:</strong> dokumentacja, procedury, wsparcie, prawnik — w tej kolejności.'
    ],
    powiazane: [1, 2],
    pomost: 'Czasem zamiast nękania przychodzi coś bardziej formalnego — i wtedy warto wiedzieć, <a href="/odcinki/plan-naprawczy-pip/">czym jest plan naprawczy w pracy</a>.',
    cta: {
      gora: '<strong>Darmowa checklista:</strong> wzór notatki „kto, co, kiedy, przy kim” — dokładnie to narzędzie, którego potrzebujesz do testu wzorca.',
      dol: '<strong>Darmowa checklista.</strong> Wzór notatki po trudnej sytuacji: fakty, kontekst, świadkowie, data. Dostaniesz ją mailem, za darmo.'
    },
    notaPrawna:
      'Ten materiał nie jest poradą prawną. Opisuję definicję mobbingu własnymi słowami i praktykę z perspektywy managera. ' +
      'Ocena konkretnej sytuacji należy do prawnika specjalizującego się w prawie pracy. Jeśli sytuacja w pracy wpływa na Twoje zdrowie, ' +
      'porozmawiaj z lekarzem lub psychologiem.',
    konsultacje: false,
    gotowa: true, // zaakceptowane przez Michała 11.10, 00:26
  },
  {
    nr: 4,
    slug: 'jak-dokumentowac-sytuacje-w-pracy',
    zapytanie: 'jak dokumentować sytuacje w pracy',
    // Treść: Klaudiusz, 11.10 (z transkrypcji odc. 4, Ksiazka/Odcinek-04_transkrypcja.txt). Historia o szkoleniach zostaje w książce.
    tytul: 'Jak dokumentować sytuacje w pracy — notatka i mail',
    opis: 'Jak dokumentować sytuacje w pracy bezpiecznie: notatka w pięciu punktach, mail „potwierdzam ustalenia”, gdzie to trzymać i czego nie robić.',
    h1: 'Jak dokumentować sytuacje w pracy, żeby to miało wartość?',
    lead: [
      'Od pierwszego dnia firma dokumentuje wszystko: Twoją umowę, cele, oceny, wyniki, obecność na szkoleniach. Każde spotkanie 1:1 może mieć notatkę, o której nie wiesz. A co masz Ty?',
      'Przez dwadzieścia lat w korporacjach, kilkanaście z nich jako manager, widziałem, jak jedna notatka potrafi rozstrzygnąć spór, który bez niej byłby słowem przeciwko słowu. Poniżej — jak dokumentować tak jak firma: spokojnie, systematycznie i bezpiecznie.'
    ],
    sekcje: [
      {
        h2: 'Czy dokumentowanie rozmów z szefem to paranoja?',
        tresc: [
          'Nie. Kiedy firma wysyła Ci po spotkaniu podsumowanie ustaleń albo HR prosi o potwierdzenie czegoś mailem „dla porządku”, nie uważasz tego za wrogość, tylko za profesjonalizm. Te same zasady w Twoim wykonaniu też nim są.',
          '<strong>Dokumentowanie to symetria, nie atak.</strong> Jedna strona ma dział HR, systemy i procedury, druga — pamięć. A pamięć przekłamuje szczegóły już po dobie. Po tygodniu z rozmowy zostaje wrażenie, po miesiącu — wersja, którą sobie opowiedziałeś.',
          'Dokumentacja działa też w dobrych czasach. Notatki o pochwałach, wynikach i podziękowaniach to materiał na <a href="/odcinki/jak-rozmawiac-o-podwyzce/">rozmowę o podwyżce</a> i na <a href="/odcinki/niesprawiedliwa-ocena-roczna/">ocenę roczną</a>. To prowadzenie własnej księgowości kariery.'
        ]
      },
      {
        h2: 'Co powinna zawierać notatka z rozmowy w pracy?',
        tresc: [
          'Pisz ją tego samego dnia, najlepiej w ciągu godziny. Pięć punktów:',
          '<strong>1. Data i godzina</strong> — pierwsza rzecz, która ginie z pamięci, i pierwsza, o którą ktoś zapyta. <strong>2. Kto</strong> — uczestnicy i kto mógł słyszeć. <strong>3. Co dokładnie padło</strong> — kluczowe zdania w cudzysłowie, możliwie dosłownie. <strong>4. Kontekst</strong> — czego dotyczyła rozmowa i co ją poprzedziło. <strong>5. Ustalenia i polecenia</strong> — co, do kiedy, kto zdecydował.',
          'Bez interpretacji i bez emocji. „Szef był niemiły” to opinia. „Powiedział: »jak ci się nie podoba, to wiesz, gdzie są drzwi«” to fakt. <strong>Fakty bronią się same, opinie osłabiają dokument.</strong>'
        ]
      },
      {
        h2: 'Jak napisać mail „potwierdzam ustalenia”?',
        tresc: [
          'To narzędzie, które zamienia ustne słowo w dokument. Szef wydał polecenie, coś obiecał albo przekazał decyzję „między nami”? W ciągu godziny wysyłasz trzy zdania:',
          '<strong>„Dziękuję za rozmowę. Dla porządku podsumowuję nasze ustalenia: po pierwsze…, po drugie… Daj proszę znać, jeśli coś zrozumiałem inaczej.”</strong>',
          'W obu scenariuszach zyskujesz. Brak odpowiedzi oznacza w praktyce, że treść została przyjęta — ustne ustalenie ma teraz datę i godzinę. Odpowiedź z korektą to też dokument, a przy okazji unikasz nieporozumienia, które za miesiąc mogłoby zostać uznane za Twoją winę.',
          'Forma ma znaczenie: grzecznie, służbowo, bez „w nawiązaniu do niepokojącej rozmowy”. Dokładnie tak, jak firma pisze do Ciebie.'
        ]
      },
      {
        h2: 'Gdzie przechowywać dokumentację z pracy?',
        tresc: [
          '<strong>Nigdy wyłącznie na służbowym sprzęcie.</strong> Służbowy laptop, mail i dysk przestają być Twoje w dniu, w którym tracisz dostęp — a to potrafi stać się z godziny na godzinę.',
          'Trzy dobre opcje: prywatny mail (notatki wysyłane do siebie mają automatyczny znacznik czasu), prywatny folder w chmurze ułożony chronologicznie albo papierowy notes prowadzony po kolei, bez wyrywania kartek.'
        ]
      },
      {
        h2: 'Czego nie robić, dokumentując sytuacje w pracy?',
        tresc: [
          '<strong>Nie wynoś danych firmowych.</strong> Dokumentujesz przebieg sytuacji, które dotyczą Ciebie — nie kopiujesz baz klientów, raportów ani dokumentów poufnych. To może naruszać umowę i prawo i w jednej chwili zamienia Cię z poszkodowanego w sprawcę.',
          '<strong>Nie nagrywaj rozmów bez wiedzy rozmówcy, zanim nie porozmawiasz z prawnikiem.</strong> Konsekwencje bywają różne, a potajemne nagranie potrafi obrócić się przeciwko Tobie. Notatka jest bezpieczniejsza niż dyktafon.',
          '<strong>Nie pokazuj swojej dokumentacji nikomu w firmie.</strong> To nie karta przetargowa na korytarz. Jest dla Ciebie, a jeśli zajdzie potrzeba — dla Twojego prawnika.'
        ]
      },
      {
        h2: 'Jak sprawić, żeby dokumentacja działała?',
        tresc: [
          '<strong>Jedno miejsce, chronologicznie.</strong> Pojedyncza notatka mówi niewiele, ciąg wpisów pokazuje wzorce — a to wzorzec, nie pojedyncze zdarzenie, odróżnia na przykład <a href="/odcinki/mobbing-w-pracy-gdzie-granica/">mobbing od trudnego szefa</a>.',
          '<strong>Pełny obraz, nie akt oskarżenia.</strong> Notuj też dobre rzeczy. Dokumentacja złożona z samych skarg wygląda niewiarygodnie.',
          '<strong>Dokumentacja pracuje w ciszy.</strong> Nie wspominasz o niej i nie grozisz nią. Większość notatek nigdy nie zostanie użyta i to najlepszy scenariusz. Ale kiedy są potrzebne — na rozmowie z HR, u prawnika, przy <a href="/odcinki/plan-naprawczy-pip/">planie naprawczym</a> albo negocjacji odejścia — ich istnienie zmienia wszystko.'
        ]
      }
    ],
    zapamietaj: [
      '<strong>Dokumentowanie to symetria, nie paranoja</strong> — robisz to, co firma robi od Twojego pierwszego dnia.',
      '<strong>Notatka tego samego dnia w pięciu punktach</strong> i mail „potwierdzam ustalenia” załatwiają większość sprawy.',
      '<strong>Wszystko trzymasz poza firmową infrastrukturą</strong>, bez danych firmowych i bez potajemnych nagrań.',
      '<strong>Jedno miejsce, chronologicznie, dobre i złe rzeczy</strong> — i nikomu o tym nie mówisz.'
    ],
    powiazane: [1, 3, 2, 9],
    pomost: 'Najczęściej pierwszą notatkę pisze się po krytyce, która zabolała — dlatego warto wiedzieć, <a href="/odcinki/negatywny-feedback-od-szefa/">jak reagować na negatywny feedback od szefa</a>.',
    cta: {
      gora: '<strong>Darmowa checklista:</strong> wzór notatki w pięciu punktach i gotowy mail „potwierdzam ustalenia” — do użycia od jutra.',
      dol: '<strong>Darmowa checklista.</strong> Wzór notatki po trudnej rozmowie, mail „potwierdzam ustalenia” i 10 gotowych zdań na niesprawiedliwy feedback. Dostaniesz ją mailem, za darmo.'
    },
    notaPrawna:
      'Ten materiał nie jest poradą prawną. Zasady dotyczące danych firmowych, poufności i nagrywania rozmów zależą od przepisów i Twojej umowy — ' +
      'w konkretnej sprawie skontaktuj się z prawnikiem specjalizującym się w prawie pracy.',
    konsultacje: true,
    gotowa: true, // zaakceptowane przez Michała 11.10, 00:30
  },
  {
    nr: 6,
    slug: 'wypalenie-czy-zmeczenie',
    zapytanie: 'wypalenie zawodowe czy zwykłe zmęczenie',
    // Treść: Klaudiusz, 11.10 (z transkrypcji odc. 6, Ksiazka/Odcinek-06_transkrypcja.txt).
    // ⚠️ Temat wrażliwy: nota edukacyjna w pierwszej linii, CTA tylko do checklisty, bez konsultacji.
    // Historia zdrowotna Michała zostaje w odcinku i w książce — tu tylko jedno zdanie, bez szczegółów.
    tytul: 'Wypalenie zawodowe czy zmęczenie? Test urlopu i 7 sygnałów',
    opis: 'Jak odróżnić wypalenie zawodowe od zwykłego zmęczenia: test urlopu, siedem sygnałów, czym wypalenie nie jest i kiedy samopomoc to za mało. Materiał edukacyjny.',
    h1: 'Wypalenie zawodowe czy zwykłe zmęczenie — jak to odróżnić?',
    lead: [
      'Ten tekst to materiał edukacyjny, a nie diagnoza ani porada medyczna. Nie jestem lekarzem ani psychologiem.',
      'Przez dwadzieścia lat w korporacjach widziałem przeciążenie u ludzi w swoich zespołach od razu — i reagowałem. U siebie nie widziałem go przez lata. Piszę o wypaleniu nie jako ekspert, tylko jako ktoś, kto przez nie przeszedł i za późno zrozumiał, co się z nim dzieje.'
    ],
    sekcje: [
      {
        h2: 'Czym wypalenie zawodowe nie jest?',
        tresc: [
          'Wokół wypalenia narosło dużo krzywdzących skrótów. Trzy najczęstsze:',
          '<strong>To nie lenistwo.</strong> Najczęściej wypalają się ci, którzy ciągnęli najmocniej. Lenistwo nie boli. Wypalenie boli — bo chcesz jak dawniej, a nie ma z czego.',
          '<strong>To nie słabość charakteru.</strong> Dopada także ludzi, których nikt by nie podejrzewał — najtwardszych w zespole. Może właśnie dlatego, że twardzi najdłużej nie odpuszczają i najpóźniej proszą o pomoc.',
          '<strong>To nie „za mało urlopu”.</strong> I tu jest najprostszy test, jaki znam.'
        ]
      },
      {
        h2: 'Jak odróżnić wypalenie od zmęczenia? Test urlopu',
        tresc: [
          'Ze zwykłego zmęczenia urlop Cię wyciąga: wracasz wypoczęty i znów Ci się chce. Z wypalenia nie: wracasz, a w niedzielę wieczorem czujesz dokładnie to samo co przed wyjazdem.',
          'Częsty przebieg wygląda tak: najpierw urlopy pomagają, potem pomagają coraz krócej, w końcu przestają. <strong>Jeśli kolejne urlopy „nie działają”, to nie jest wada urlopu.</strong> To sygnał, żeby potraktować sprawę poważnie.',
          'Wypalenie to stan, a nie cecha. A stany się zmieniają — w obie strony.'
        ]
      },
      {
        h2: 'Jakie są objawy wypalenia zawodowego? Siedem sygnałów',
        tresc: [
          'Nie muszą wystąpić wszystkie. Ale im więcej się zgadza i im dłużej to trwa, tym poważniej warto to traktować.',
          '<strong>1. Zmęczenie, którego nie naprawia sen ani weekend.</strong> <strong>2. Cynizm, którego wcześniej u siebie nie znałeś</strong> — praca, która Cię cieszyła, budzi obojętność albo złośliwość. <strong>3. Spadek wiary we własną skuteczność</strong> — robisz to samo co zawsze, a masz poczucie, że nic nie ma sensu. <strong>4. Ciało zaczyna mówić</strong> — bóle głowy, napięcie karku, problemy żołądkowe, infekcja za infekcją. <strong>5. Niedzielny lęk, który przychodzi coraz wcześniej</strong> — najpierw niedziela wieczór, potem niedziela rano, w końcu sobota. <strong>6. Wycofywanie się z ludzi</strong> — odmawiasz, odwołujesz, przekładasz. <strong>7. „Jakoś dotrwać”</strong> — do piątku, do urlopu, do końca roku. Kiedy praca zamienia się w odliczanie, to już przetrwanie.',
          'Pomaga prosty zapis: przez dwa tygodnie notuj, jak naprawdę wyglądają Twoje dni — sen, energia, nastrój przed pracą. Czarno na białym widać to, czego ze środka nie da się dostrzec.'
        ]
      },
      {
        h2: 'Co może pomóc przy wypaleniu?',
        tresc: [
          'Nie ma jednego przepisu. Z doświadczenia — swojego i ludzi, z którymi o tym rozmawiałem — najczęściej pomagają trzy rzeczy.',
          '<strong>Rozmowa ze specjalistą.</strong> Psycholog lub terapeuta pomaga zrobić to, co samemu jest najtrudniejsze: uznać, że czasem można odpuścić i powiedzieć „nie dam rady”. To nie słabość, tylko odpowiedzialność za siebie.',
          '<strong>Mniej na sobie, więcej delegowania.</strong> Asertywność w praktyce: odmawianie, oddawanie zadań, rezygnacja z „sam zrobię najlepiej”. Dla managera delegowanie to nie zrzucanie pracy na innych, tylko podstawowa umiejętność zawodu.',
          '<strong>Cierpliwość.</strong> Wypalenie narasta latami i nie zejdzie w tydzień. To raczej powolne odkręcanie niż przełącznik.'
        ]
      },
      {
        h2: 'Kiedy samopomoc to za mało?',
        tresc: [
          'Jeśli czujesz, że to już nie jest „gorszy okres” — nie masz siły wstać, przestało Cię cieszyć cokolwiek, nie tylko praca, pojawiają się myśli, których się boisz — <strong>to moment na rozmowę z profesjonalistą: lekarzem, psychologiem albo psychiatrą.</strong>',
          'Pójście po pomoc to ta sama decyzja, którą w pracy podejmujesz bez wahania: gdy problem przerasta Twoje narzędzia, wołasz specjalistę. Tak robisz z serwerem, z umową, z podatkami. Zrób tak z sobą.',
          'W nagłym kryzysie zadzwoń pod <strong>112</strong> albo na całodobowy Kryzysowy Telefon Zaufania <strong>116 123</strong>.',
          'A jeśli widzisz te sygnały u kogoś obok — nie wysyłaj mu linku z dopiskiem „to o tobie”. Zapytaj, jak się czuje, i wysłuchaj odpowiedzi do końca.'
        ]
      }
    ],
    zapamietaj: [
      '<strong>Wypalenie to stan, nie cecha</strong> — i częściej dotyka tych, którzy ciągnęli najmocniej.',
      '<strong>Test urlopu:</strong> jeśli wolne przestało pomagać, potraktuj to poważnie.',
      '<strong>Siedem sygnałów:</strong> im więcej się zgadza i im dłużej trwa, tym ważniejsza rozmowa ze specjalistą.',
      '<strong>Prośba o pomoc to nie słabość.</strong> To ta sama decyzja, którą podejmujesz w pracy, gdy problem przerasta Twoje narzędzia.'
    ],
    powiazane: [3, 12],
    pomost: 'Czasem źródłem przeciążenia jest konkretna osoba i powtarzające się zachowania — wtedy warto sprawdzić, <a href="/odcinki/mobbing-w-pracy-gdzie-granica/">gdzie przebiega granica mobbingu</a>.',
    cta: {
      gora: '<strong>Darmowa checklista:</strong> wzór notatki, który działa też w tę stronę — zapisuj przez dwa tygodnie, jak naprawdę wyglądają Twoje dni.',
      dol: '<strong>Darmowa checklista.</strong> Wzór prostej notatki, dzięki któremu zobaczysz czarno na białym to, czego ze środka trudno dostrzec. Dostaniesz ją mailem, za darmo.'
    },
    notaPrawna:
      'To materiał edukacyjny, a nie diagnoza ani porada medyczna. Autor nie jest lekarzem ani psychologiem. ' +
      'Jeśli zauważasz u siebie opisane sygnały, porozmawiaj z lekarzem, psychologiem lub psychiatrą. ' +
      'W nagłym kryzysie: 112 lub Kryzysowy Telefon Zaufania 116 123.',
    konsultacje: false,
    gotowa: true, // zaakceptowane przez Michała 11.10, 00:28
  },
  {
    nr: 7,
    slug: 'rozmowa-1-na-1-z-szefem',
    zapytanie: 'jak przygotować się do rozmowy 1:1 z szefem',
    // Treść: Klaudiusz, 11.10 (z transkrypcji odc. 7, Ksiazka/Odcinek-07_transkrypcja.txt). Historie zostają w książce.
    tytul: 'Rozmowa 1:1 z szefem — jak się przygotować i co powiedzieć',
    opis: 'Jak przygotować się do rozmowy 1:1 z szefem: agenda na 15 minut, jedno pytanie o feedback, jak zgłaszać problemy i co, gdy szef odwołuje spotkania.',
    h1: 'Jak przygotować się do rozmowy 1:1 z szefem?',
    lead: [
      'Co tydzień albo co dwa w kalendarzu wisi to samo spotkanie: piętnaście minut z szefem, jeden na jeden. Szef pyta „co słychać”, Ty relacjonujesz statusy, on kiwa głową. Odhaczone.',
      'Policz: trzydzieści takich spotkań rocznie to ponad siedem godzin sam na sam z osobą, która ma największy wpływ na Twoją ocenę, podwyżkę i spokój w pracy. Przez kilkanaście lat prowadziłem takie rozmowy po stronie managera. Poniżej — jak zrobić z nich najlepsze piętnaście minut tygodnia.'
    ],
    sekcje: [
      {
        h2: 'Po co szefowi spotkania 1:1?',
        tresc: [
          'Dla managera 1:1 to trzy rzeczy naraz: <strong>system wczesnego ostrzegania</strong> (tu wychodzą problemy, zanim urosną), <strong>materiał do oceny</strong> (to, co mówisz, buduje obraz, który potem trafia na <a href="/odcinki/niesprawiedliwa-ocena-roczna/">kalibrację ocen rocznych</a>) i obowiązek, z którego rozlicza go jego przełożony.',
          'Czego na tej liście nie ma? Statusów projektów. Szef ma je w systemach, raportach i na spotkaniach zespołu. <strong>Jeśli Twoje 1:1 to przegląd statusów, spotkanie jest zmarnowane dla Was obu.</strong>',
          'Najlepiej oceniane osoby w moich zespołach traktowały 1:1 jako swoje spotkanie, nie szefa. Przychodziły przygotowane i po każdym spotkaniu wysyłały krótkie podsumowanie. Na kalibracji broniły ich liczby, a nie wrażenie.'
        ]
      },
      {
        h2: 'Jak przygotować agendę na spotkanie 1:1?',
        tresc: [
          'Najważniejsza zmiana kosztuje dziesięć minut: <strong>przychodzisz z własną agendą.</strong> Na początku mówisz: „Mam trzy rzeczy, które chcę dziś przegadać — możemy?”. Mało który manager odmówi; większość odetchnie z ulgą.',
          'Struktura na piętnaście minut:',
          '<strong>Co się udało (2–3 minuty).</strong> Jedna, dwie rzeczy z liczbami. Nie jako chwalenie się, tylko jako budowanie rejestru, z którego szef skorzysta przy ocenie.',
          '<strong>Przeszkody i decyzje (5–7 minut).</strong> Nie statusy, tylko blokery: „utknąłem z X, potrzebuję decyzji w sprawie Y, kto może pomóc z Z”. Odblokowywanie to praca, którą może wykonać tylko manager.',
          '<strong>Rozwój i feedback (3–5 minut).</strong> Najczęściej pomijana część i najcenniejsza.',
          'Po spotkaniu trzy zdania mailem: co ustaliliście i do czego wrócisz. Trzydzieści sekund, a ustalenia przestają być ulotne — więcej o tym, <a href="/odcinki/jak-dokumentowac-sytuacje-w-pracy/">jak dokumentować sytuacje w pracy</a>.'
        ]
      },
      {
        h2: 'Jakie pytanie zadać szefowi na 1:1?',
        tresc: [
          'Jedno pytanie, zadawane co miesiąc lub dwa, robi dla kariery więcej niż niejedno szkolenie: <strong>„Co mogę robić lepiej? Czy jest coś, co z Twojej perspektywy powinienem zmienić?”</strong>',
          'Działa na trzech poziomach. Uwagi, które mogłyby trafić do oceny rocznej jako niespodzianka, wychodzą wtedy, kiedy jeszcze można coś z nimi zrobić. Ktoś, kto sam prosi o feedback, trudno może zostać opisany jako „nie przyjmuje uwag”. I czasem usłyszysz coś, co naprawdę zmienia perspektywę — na przykład, że szef wymaga od Ciebie więcej, bo przygotowuje Cię do awansu.',
          'To niemal to samo pytanie, które warto zadać na rozmowie oceniającej: „co musi się wydarzyć, żeby następna ocena była wyższa?”. Różnica to moment. Zadane na 1:1, wiele miesięcy przed oceną, daje czas na realizację planu.'
        ]
      },
      {
        h2: 'Jak poruszać trudne tematy na spotkaniu 1:1?',
        tresc: [
          '<strong>Problem przynosisz z propozycją.</strong> Nie „nie da się pracować z tym zespołem”, tylko „mamy powtarzający się problem z terminami od zespołu X — proponuję wspólny bufor, co o tym myślisz?”. Pierwsze to skarga, drugie to inicjatywa.',
          '<strong>Przeciążenie zgłaszasz liczbami, nie emocjami.</strong> „Mam teraz osiem projektów. Żeby dowieźć trzy kluczowe w terminie, muszę przesunąć dwa — które mają najniższy priorytet?” To nie słabość, tylko zarządzanie ryzykiem. Przy okazji zostawiasz ślad, że sygnalizowałeś problem — co ma znaczenie, jeśli przeciążenie zaczyna przechodzić w <a href="/odcinki/wypalenie-czy-zmeczenie/">wypalenie</a>.',
          '<strong>Tematy „na piśmie” zapowiadasz na 1:1.</strong> Podwyżka, zmiana roli, problem formalny — najpierw ustnie i spokojnie, potem potwierdzenie mailem. Nikt nie lubi zasadzek w skrzynce.'
        ]
      },
      {
        h2: 'Co zrobić, gdy szef nie prowadzi spotkań 1:1?',
        tresc: [
          '<strong>Spotkań nie ma wcale?</strong> Zaproponuj je sam: „Chciałbym raz na dwa tygodnie piętnaście minut na podsumowanie i priorytety. Mogę wysłać zaproszenie?”. Odpowiedź „nie mamy czasu” to też informacja.',
          '<strong>Szef regularnie je odwołuje?</strong> Raz czy dwa to normalne życie. Ale systematyczne znikanie Twoich 1:1, gdy spotkania innych się odbywają, bywa cichym początkiem izolowania — jednego z sygnałów, przy których warto sprawdzić, <a href="/odcinki/mobbing-w-pracy-gdzie-granica/">gdzie przebiega granica mobbingu</a>. Nie panikuj, dokumentuj: po każdym odwołanym spotkaniu grzeczny mail z propozycją nowego terminu.',
          '<strong>Spotkanie to monolog szefa?</strong> Użyj agendy: „Zanim przejdziemy dalej — mam dwie rzeczy, które chcę dziś poruszyć”. Powtarzane konsekwentnie, zmienia dynamikę w kilka tygodni.'
        ]
      }
    ],
    zapamietaj: [
      '<strong>Spotkanie 1:1 jest Twoje, nie szefa</strong> — przychodź z agendą: sukcesy z liczbami, blokery, rozwój.',
      '<strong>„Co mogę robić lepiej?”</strong> zadawane regularnie odbiera ocenie rocznej element zaskoczenia.',
      '<strong>Trudne tematy z propozycją i liczbami,</strong> a ważne sprawy najpierw ustnie, potem mailem.',
      '<strong>Po każdym spotkaniu trzy zdania podsumowania</strong> — ustalenia przestają być ulotne.'
    ],
    powiazane: [1, 5, 4],
    pomost: 'Na 1:1 najczęściej pada też trudny feedback — dlatego warto wiedzieć, <a href="/odcinki/negatywny-feedback-od-szefa/">jak reagować na krytykę od szefa</a>.',
    cta: {
      gora: '<strong>Darmowa checklista:</strong> wzór notatki po rozmowie i mail „potwierdzam ustalenia” — dokładnie to, co warto wysłać po każdym spotkaniu 1:1.',
      dol: '<strong>Darmowa checklista.</strong> Wzór notatki po trudnej rozmowie i mail „potwierdzam ustalenia”, który zamienia ustalenia z 1:1 w coś, do czego można wrócić. Dostaniesz ją mailem, za darmo.'
    },
    konsultacje: true,
    gotowa: true, // zaakceptowane przez Michała 11.10, 00:33
  },
  {
    nr: 8,
    slug: 'spotkanie-z-hr-bez-tematu',
    zapytanie: 'spotkanie z HR bez tematu co oznacza',
    tytul: 'Spotkanie z HR bez tematu — co oznacza i jak się zachować',
    opis:
      'Zaproszenie bez tematu, za dwie godziny, a na liście gości ktoś z HR. Wyjaśniam, co zwykle znaczy taki wpis w kalendarzu i czego nie robić w sali.',
    h1: 'Zaproszenie na spotkanie z HR, bez tematu. Co to znaczy?',
    lead: [
      "W kalendarzu pojawia się zaproszenie. Bez tematu, za dwie godziny, a na liście gości ktoś z HR. Każdy, kto pracował w dużej firmie, zna ten skok tętna.",
      "Przez dwadzieścia lat pracowałem w korporacjach, od specjalisty po senior managera. Prowadziłem takie spotkania z drugiej strony stołu. Poniżej to, co wiem o tym, jak one powstają — i co realnie można zrobić w ciągu tych kilkudziesięciu minut.",
    ],
    sekcje: [
      {
        h2: "Co zwykle oznacza spotkanie bez tematu z kimś z HR?",
        tresc: [
          "Najczęściej nie oznacza nic dramatycznego. Wpis bez tematu bierze się z tego, że manager nie chce nazywać sprawy w kalendarzu, do którego zaglądają inni — a powodów jest sporo: zmiana w strukturze, przesunięcie do innego zespołu, rozmowa o wyniku zespołu, awans, czyjaś skarga, o której nie wiesz.",
          "Obecność osoby z HR zmienia jednak jedną rzecz: to znaczy, że sprawa ma jakiś status formalny. HR nie chodzi na rozmowy o niczym. Może to być procedura, dokument do podpisania, sprawa pracownicza w toku albo etap czegoś, co zaczęło się wcześniej — na przykład <a href=\"/odcinki/plan-naprawczy-pip/\">planu naprawczego</a>, który dobiega końca.",
          "Nie warto z tego budować wyroku, zanim padnie pierwsze zdanie. Warto natomiast wejść na to spotkanie z założeniem, że to nie jest zwykła rozmowa — i zachować się odpowiednio do tego założenia.",
        ],
      },
      {
        h2: "Dlaczego druga strona nie jest zaskoczona?",
        tresc: [
          "To jest najważniejsza rzecz, którą zobaczyłem, siedząc po tamtej stronie stołu.",
          "Kiedy Ty wchodzisz do sali zaskoczony, po drugiej stronie nikt zaskoczony nie jest. Takie spotkanie jest przygotowane — czasem od tygodni. Dokumenty są wydrukowane wcześniej, zwykle w kilku wariantach, bo nie wiadomo, którą drogą pójdzie rozmowa. Przy większych zmianach manager dostaje wręcz scenariusz: co powiedzieć, w jakiej kolejności, czego nie obiecywać.",
          "To nie jest spisek. To jest proces — i firmy prowadzą go w ten sposób głównie po to, żeby nie popełnić błędu formalnego. Ale dla Ciebie wniosek jest praktyczny: wchodzisz w rozmowę, do której druga strona przygotowywała się tygodniami, a Ty miałeś dwie godziny. <strong>Wyrównanie tej różnicy nie polega na tym, żeby szybciej myśleć. Polega na tym, żeby nie decydować w sali.</strong>",
        ],
      },
      {
        h2: "Czy trzeba coś podpisać na tym spotkaniu?",
        tresc: [
          "Nie. I to jest zdanie, które warto zapamiętać w całości.",
          "Usłyszysz — czasem wprost, czasem między wierszami — że najlepiej podpisać od razu. Że tak będzie prościej, szybciej, czyściej dla wszystkich. To zwykle nie jest próba oszustwa. To jest wygoda procesu: podpisany dokument zamyka sprawę i zdejmuje ją z listy.",
          "Twoja wygoda jest inna. Dokumenty czyta się na spokojnie, poza salą, w której właśnie przestało się myśleć. Zdanie, które to załatwia, brzmi po prostu:",
          "<strong>„Dziękuję. Chcę to przeczytać spokojnie i wrócę do Was z odpowiedzią.\"</strong>",
          "Nie musisz go uzasadniać. Nie musisz podawać terminu na poczekaniu. Prośba o przeczytanie dokumentu przed podpisaniem nie jest niczym nadzwyczajnym i nikt kompetentny nie zareaguje na nią źle.",
        ],
      },
      {
        h2: "Czym różni się wypowiedzenie od porozumienia stron?",
        tresc: [
          "Różnicą, którą warto rozumieć, zanim cokolwiek podpiszesz.",
          "<strong>Wypowiedzenie to komunikat.</strong> Jedna strona informuje drugą o swojej decyzji. Nie potrzebuje Twojej zgody i nie podlega negocjacji — obowiązuje okres wypowiedzenia, a Ty masz określony czas na to, żeby się od niego odwołać, jeśli uważasz je za bezpodstawne.",
          "<strong>Porozumienie stron to negocjacja.</strong> Bez Twojego podpisu nie istnieje. A skoro nie istnieje bez Twojego podpisu, to znaczy, że wszystko w nim jest przedmiotem rozmowy: data rozwiązania umowy, zwolnienie ze świadczenia pracy, rozliczenie urlopu, treść świadectwa pracy, dodatkowe świadczenie, czasem referencje.",
          "To jest cała asymetria tej rozmowy w jednym zdaniu: dokument, który wygląda na łagodniejszy, jest jedynym, przy którym masz coś do powiedzenia — i jedynym, który możesz podpisać za szybko.",
          "<strong>Porozumienie stron ma też konsekwencje poza firmą</strong>, między innymi dla prawa do zasiłku. To jest dokładnie ten fragment, przy którym warto zapytać kogoś, kto zna Twoją sytuację, zanim postawisz podpis.",
        ],
      },
      {
        h2: "Co powiedzieć, kiedy nie wiadomo, co powiedzieć?",
        tresc: [
          "Trzy zdania wystarczą na całe spotkanie.",
          "<strong>„Chcę się upewnić, że dobrze rozumiem — czego dotyczy to spotkanie?\"</strong> Zadane na początku porządkuje rozmowę i daje Ci kilkanaście sekund na złapanie oddechu.",
          "<strong>„Rozumiem. Potrzebuję to przeczytać na spokojnie.\"</strong> Uniwersalna odpowiedź na każdy dokument położony na stole.",
          "<strong>„Wrócę do Was z odpowiedzią.\"</strong> Bez daty, jeśli nie jesteś gotowy jej podać. Termin ustalisz mailem, kiedy będziesz wiedział, ile czasu realnie potrzebujesz.",
          "Nie musisz w tej sali niczego wygrać. Musisz z niej wyjść bez podpisu i z kopią dokumentu.",
        ],
      },
      {
        h2: "Co zrobić w pierwszych 48 godzinach po takim spotkaniu?",
        tresc: [
          "Cztery rzeczy, w tej kolejności.",
          "<strong>Zapisz przebieg, jeszcze tego samego dnia.</strong> Kto był, co padło, jakimi słowami, co Ci zaproponowano i czego nie powiedziano wprost. Pamięć przekłamuje szczegóły znacznie szybciej, niż nam się wydaje, a przy takich sprawach cała wartość siedzi w szczegółach. To ta sama zasada, która obowiązuje przy <a href=\"/odcinki/negatywny-feedback-od-szefa/\">trudnym feedbacku od przełożonego</a>.",
          "<strong>Zabezpiecz to, co Twoje.</strong> Kontakty prywatne, dokumenty, do których masz prawo, kopie własnych ocen i podsumowań. Nic, co należy do firmy — wyłącznie to, co dotyczy Ciebie.",
          "<strong>Przeczytaj dokument dwa razy, w odstępie kilku godzin.</strong> Pierwsze czytanie jest emocjonalne i nic z niego nie wynika. Przy drugim zaczynasz widzieć daty i kwoty.",
          "<strong>Ustal, z kim to skonsultujesz.</strong> Zanim odpiszesz. To nie musi być prawnik — czasem wystarczy ktoś, kto przeszedł to samo. Ale ta rozmowa ma się odbyć przed odpowiedzią, nie po.",
        ],
      },
    ],
    zapamietaj: [
      "<strong>Spotkanie bez tematu z udziałem HR najczęściej nie jest wyrokiem</strong>, ale zawsze oznacza, że sprawa ma status formalny.",
      "<strong>Druga strona jest przygotowana od tygodni.</strong> Ty nie musisz się z tym równać w sali — musisz tylko z niej wyjść bez podpisu.",
      "<strong>Wypowiedzenie to komunikat. Porozumienie stron to negocjacja</strong> — i dlatego to właśnie ono wymaga spokojnej głowy.",
      "<strong>Notatka z przebiegu spotkania powstaje tego samego dnia.</strong> Później to już jest odtwarzanie, nie zapis.",
    ],
    powiazane: [2, 1],
    cta: {
      gora:
        '<strong>Darmowa checklista:</strong> wzór notatki po trudnej rozmowie ' +
        'i dziesięć gotowych zdań na sytuacje, w których trzeba coś powiedzieć, ' +
        'a głowa odmawia współpracy.',
      dol:
        '<strong>Darmowa checklista.</strong> Wzór notatki po trudnej rozmowie ' +
        'i dziesięć gotowych zdań na sytuacje, w których trzeba coś powiedzieć, ' +
        'a głowa odmawia współpracy. Dostaniesz ją mailem, za darmo.',
    },
    // Nota prawna obowiązkowa — tekst dotyka dokumentów i podpisów.
    notaPrawna:
      'To materiał edukacyjny oparty na doświadczeniu managerskim, a nie porada ' +
      'prawna. Każda umowa i każda sytuacja są inne — przed podpisaniem ' +
      'jakiegokolwiek dokumentu warto skonsultować go z prawnikiem albo ' +
      'z inspekcją pracy.',
    // ⚠️ Transkrypcji odcinka 8 jeszcze nie ma w `transkrypcje.js` — plik zawiera
    // dziś tylko odcinki 1 i 2. Pole zostaje puste do czasu, aż transkrypcja
    // przejdzie kontrolę anonimowości i zostanie tam dopisana.
    pomost:
      'Bywa też odwrotnie: rozmowa nie kończy współpracy, tylko ją formalizuje ' +
      '— i wtedy z sali wychodzisz z <a href="/odcinki/plan-naprawczy-pip/">planem ' +
      'naprawczym</a> zamiast z dokumentem do podpisania. To jest inna sytuacja ' +
      'i inna gra.',
    // CTA wyłącznie do checklisty — decyzja Klaudiusza z 4.09.
    konsultacje: false,
    // 1.10: transkrypcja odcinka 8 dopisana przez Marcina (commit 8207566, po kontroli anonimizacji).
    transkrypcja: transkrypcje[8],
    gotowa: true,   // ✅ zaakceptowane przez Michała 4.09
  },
  {
    nr: 9, slug: "jak-rozmawiac-o-podwyzce",
    zapytanie: "jak rozmawiać o podwyżce z szefem",
    tytul: "Jak rozmawiać o podwyżce z szefem — i kiedy zacząć, żeby zdążyć",
    opis: "Rozmowa o podwyżce w grudniu jest zwykle spóźniona. Wyjaśniam, skąd bierze się pula na podwyżki, co Twój szef musi mieć w ręku i co odpowiedzieć na „nie ma budżetu”.",
    h1: "Jak rozmawiać o podwyżce z szefem, żeby to miało sens?",
    lead: [
      "Większość ludzi przygotowuje się do rozmowy o podwyżce tak, jakby decyzja zapadała w tej rozmowie. Lista argumentów, odwaga zebrana na jeden dzień, a potem „nie ma budżetu”.",
      "Przez dwadzieścia lat pracowałem w korporacjach, od specjalisty po senior managera. Słyszałem to zdanie po obu stronach stołu: najpierw jako odpowiedź na własną prośbę, potem jako zdanie, które sam musiałem komuś powiedzieć. Poniżej to, co widać z drugiej strony — i co z tego wynika dla Ciebie.",
    ],
    sekcje: [
      {
        h2: "Skąd bierze się pula na podwyżki?",
        tresc: [
          "Zanim jakiekolwiek pieniądze trafią do Ciebie, firma musi wykonać swój rok budżetowy. Bez tego puli na podwyżki po prostu nie ma i żaden argument tego nie zmieni.",
          "Potem pula jest dzielona między działy i zespoły. Twój przełożony negocjuje dla swojego zespołu jak największy kawałek — i w tych negocjacjach Twoja podwyżka konkuruje z podwyżkami ludzi, których nigdy nie spotkałeś. Dalej przychodzi kalibracja, na której przełożony musi obronić Twoją ocenę, a na końcu rynek.",
          "<strong>Z pięciu ogniw tego łańcucha cztery są poza Twoim zasięgiem. Jedno kontrolujesz w stu procentach.</strong>",
        ],
      },
      {
        h2: "Co Twój szef musi mieć w ręku, żeby wywalczyć Ci podwyżkę?",
        tresc: [
          "To jest właśnie to jedno ogniwo. O podziale puli decyduje się zwykle razem z ocenami — w sali, w której Ciebie nie ma. Twój przełożony broni Cię tam tym, co ma: konkretami albo dobrym wrażeniem.",
          "Dobre wrażenie przegrywa z liczbami. Dlatego najważniejsza praca nad podwyżką nie dzieje się w dniu rozmowy, tylko przez cały rok: co dowiozłeś, ile to dało, o ile zwiększył się Twój zakres od ostatniej zmiany pensji. Jak zbierać taki materiał i dlaczego ocena i podwyżka to w praktyce jedna gra — piszę przy <a href=\"/odcinki/niesprawiedliwa-ocena-roczna/\">niesprawiedliwej ocenie rocznej</a>.",
          "Jest też rzecz niewygodna: budżet podwyżkowy to inwestycja, a nie nagroda. Przy ograniczonej puli firma częściej inwestuje w ludzi, w których widzi przyszłość, niż w solidnych wykonawców tego, co już jest.",
        ],
      },
      {
        h2: "Kiedy zacząć rozmowę o podwyżce?",
        tresc: [
          "Wcześniej, niż wszyscy zaczynają. Jeśli o podwyżkę prosisz w grudniu, zwykle jesteś spóźniony: budżet na kolejny rok jest już policzony, a pula rozdzielona.",
          "Lepszy moment to taki, w którym decyzje jeszcze nie zapadły — przed zamknięciem budżetu, nie po. Wtedy rozmowa o Twoich oczekiwaniach jest informacją, którą przełożony może jeszcze gdzieś wnieść.",
        ],
      },
      {
        h2: "Jakich argumentów używać, a jakich nie?",
        tresc: [
          "Firmy nie płacą za potrzeby — płacą za wartość i za rynek. Argumenty, które działają: wyniki z liczbami, zakres odpowiedzialności, który urósł od ostatniej podwyżki, i widełki rynkowe dla Twojej roli, podane rzeczowo, nie jako groźba.",
          "Argumenty, które pogrążają: <strong>„mam kredyt”, „koledzy zarabiają więcej”, „należy mi się za staż”.</strong> Żaden z nich nie daje przełożonemu niczego, z czym mógłby pójść wyżej. Nie przekona swojego szefa zdaniem „bo ma kredyt”.",
          "Osobna sprawa to oferta z innej firmy. Traktuj ją jako decyzję o odejściu, nie jako dźwignię. Jeśli jesteś gotów odejść, możesz o niej uczciwie porozmawiać. Jeśli nie jesteś — nie wyciągaj tej karty, bo od tej chwili firma widzi w Tobie ryzyko.",
        ],
      },
      {
        h2: "Co odpowiedzieć na „nie ma budżetu”?",
        tresc: [
          "„Nie ma budżetu” zwykle nie jest wymówką, tylko opisem stanu faktycznego na poziomie, którego nie widać z dołu. Kłótnia z tym zdaniem niczego nie zmieni.",
          "Zmienić możesz to, z czym wychodzisz z rozmowy. Zamiast samego „nie” poproś o kryteria i termin: <strong>„Rozumiem. Co konkretnie musiałoby się wydarzyć, żeby w przyszłym roku to było możliwe — i kiedy wrócimy do tej rozmowy?”</strong>",
          "Po rozmowie wyślij krótki mail z tym, co ustaliliście. Obietnica „wrócimy do tego” bez daty i bez kryteriów ma zwyczaj znikać. Zapisana — wraca.",
        ],
      },
      {
        h2: "A jeśli to Ty musisz powiedzieć „nie”?",
        tresc: [
          "Jeśli jesteś po drugiej stronie stołu: „nie ma budżetu” jest prawdziwe, ale niewystarczające. Człowiek, który słyszy samo to zdanie, wychodzi z przekonaniem, że go zbyto.",
          "Ten sam człowiek, który usłyszy, na czym konkretnie polegał problem i co musiałoby się zmienić do przyszłego roku, wychodzi z planem. To jest różnica między odmową a rozmową — i kosztuje jedną minutę więcej.",
        ],
      },
    ],
    zapamietaj: [
      "<strong>O podwyżce decyduje łańcuch, nie jedna rozmowa.</strong> Kontrolujesz jedno ogniwo: to, z czym Twój szef wchodzi na kalibrację.",
      "<strong>Prośba w grudniu jest zwykle spóźniona.</strong> Rozmawiaj, zanim budżet zostanie zamknięty.",
      "<strong>Argumentem są wartość i rynek</strong> — nigdy potrzeby, staż ani porównania z kolegami.",
      "<strong>Na „nie ma budżetu” odpowiadaj pytaniem o kryteria i termin</strong> — i zapisz odpowiedź mailem.",
    ],
    powiazane: [5, 10],
    pomost: "Czasem odmowa nie dotyczy pieniędzy, tylko stanowiska — i wtedy pytanie brzmi już inaczej: <a href=\"/odcinki/dlaczego-nie-dostalem-awansu/\">dlaczego nie dostałem awansu</a>.",
    cta: { gora: "<strong>Darmowa checklista:</strong> wzór notatki po trudnej rozmowie — w tym maila „potwierdzam ustalenia”, który zamienia ustną obietnicę w coś, do czego można wrócić.", dol: "<strong>Darmowa checklista.</strong> Wzór notatki po trudnej rozmowie i maila „potwierdzam ustalenia”, który zamienia ustną obietnicę w coś, do czego można wrócić. Dostaniesz ją mailem, za darmo." },
    konsultacje: true,
    gotowa: true,   // treść Klaudiusz 1.10, publikacja na prośbę Michała 1.10
  },
  {
    // Adres i fraza zmienione 14.09 (Klaudiusz). Było: `awans-w-korporacji`
    // + „kiedy zapada decyzja o awansie" — to fraza kogoś ciekawego procesu.
    // Nasz czytelnik jest PO odmowie i wpisuje „dlaczego nie dostałem awansu".
    nr: 10, slug: "dlaczego-nie-dostalem-awansu",
    zapytanie: "dlaczego nie dostałem awansu",
    tytul: "Dlaczego nie dostałem awansu? Co dzieje się, zanim usłyszysz decyzję",
    opis: "Awans to nie decyzja jednego szefa, tylko pozycja w budżecie. Wyjaśniam, kiedy naprawdę zapada decyzja, dlaczego najlepsi specjaliści awansują najrzadziej i o co zapytać po odmowie.",
    h1: "Dlaczego nie dostałem awansu, skoro pracuję dobrze?",
    lead: [
      "Awans poszedł do kogoś innego. Albo nie poszedł do nikogo, a Ty usłyszałeś, że „to jeszcze nie ten moment”. Pierwsza myśl brzmi zwykle tak samo: ktoś mnie nie docenia.",
      "Przez dwadzieścia lat pracowałem w korporacjach, od specjalisty po senior managera. Siedziałem w salach, w których zapadały decyzje o awansach ludzi, którzy o tych spotkaniach nie mieli pojęcia. Poniżej to, co z tamtej perspektywy widać — i co z tego wynika dla Ciebie.",
    ],
    sekcje: [
      {
        h2: "Kto naprawdę decyduje o awansie?",
        tresc: [
          "Rzadko sam Twój szef. Awans w dużej firmie to pozycja w budżecie: wyższe stanowisko kosztuje więcej, więc musi być zaplanowane, zanim ktokolwiek o nim powie.",
          "Do tego dochodzi łańcuch akceptacji. Zgodę muszą dać wszyscy managerowie w danej linii budżetowej — a tych poziomów bywa kilka — oraz HR. Twój szef może być Twoim największym zwolennikiem i mimo to nie mieć tej decyzji w swoich rękach.",
          "Z tego wynika rzecz, którą wiele osób odbiera jako niewygodną: <strong>ludzie, którzy mają zaakceptować Twój awans, muszą wiedzieć, kim jesteś.</strong> Widoczność poza własnym zespołem to nie lizusostwo, tylko warunek.",
        ],
      },
      {
        h2: "Kiedy zapada decyzja o awansie?",
        tresc: [
          "Dużo wcześniej, niż ją słyszysz. Budżet na kolejny rok powstaje jesienią, a żeby go zbudować, ktoś musi wcześniej powiedzieć, kto w przyszłym roku zmieni stanowisko. Te prognozy powstają często przy ocenach półrocznych, w okolicach sierpnia.",
          "Swoją ocenę roczną dostajesz w styczniu albo w lutym. Ale prawdziwa rozmowa o Tobie — ta między przełożonymi — mogła się odbyć pół roku wcześniej. Korekta po fakcie jest bardzo trudna, bo burzy budżet, który już policzono i zatwierdzono.",
          "<strong>Jeśli rozmowę o awansie zaczynasz w grudniu, jesteś zwykle pół roku spóźniony.</strong>",
        ],
      },
      {
        h2: "Dlaczego najlepsi specjaliści awansują najrzadziej?",
        tresc: [
          "Bo są niezastąpieni. Wielokrotnie chciałem awansować świetnych specjalistów i wielokrotnie słyszałem to samo pytanie: „Jeśli ją awansujemy, kto będzie prowadził proces?”",
          "Jeśli jesteś najlepszą osobą w zespole i nie dostajesz awansu, to nie musi znaczyć, że ktoś Cię nie docenia. Może znaczyć, że jesteś niezastąpiony. A to gorsza pozycja, niż brzmi: niezastąpiony pracownik jest wygodny dla wszystkich poza sobą samym.",
        ],
      },
      {
        h2: "Co decyduje częściej niż wyniki?",
        tresc: [
          "Proces, motywacja, zaangażowanie, inicjatywa — to wszystko usłyszysz na każdym szkoleniu z rozwoju kariery. Ale czynnik, który w mojej praktyce decydował najczęściej, był inny: <strong>nastawienie</strong>.",
          "Można mieć najlepsze liczby w zespole i nie awansować, jeśli przy każdej zmianie pierwsze, co się mówi, to „i tak nie zadziała”. Jedna reakcja na spotkaniu potrafi zaważyć na opinii budowanej przez rok.",
          "To jedyny czynnik z tej listy, który w całości zależy od Ciebie.",
        ],
      },
      {
        h2: "O co zapytać po odmowie awansu?",
        tresc: [
          "Nie o to, dlaczego wybrano kogoś innego — tej odpowiedzi rzadko usłyszysz w całości. Zapytaj o przyszłość: <strong>„Co konkretnie musiałoby się zmienić, żebym był kandydatem przy następnej okazji — i kiedy ta okazja może się pojawić?”</strong>",
          "Odpowiedź zapisz w krótkim mailu po rozmowie. Kryteria, które padły ustnie, lubią się zmieniać, kiedy przychodzi kolejny cykl.",
          "Jeśli odpowiedzią jest wyłącznie „zobaczymy”, to też jest informacja. Wtedy warto spokojnie sprawdzić, czy ten awans jest w tym zespole w ogóle możliwy, czy tylko obiecywany.",
        ],
      },
      {
        h2: "Jak przygotować się do następnej szansy?",
        tresc: [
          "Pracuj na moment, w którym zapadają prognozy, a nie na moment ogłoszenia. Rozmowę o swoich ambicjach zacznij na początku roku, przy ustalaniu celów — nie w grudniu przy ocenie.",
          "Daj przełożonemu argumenty, które obronią się w łańcuchu akceptacji: wyniki z liczbami i przykłady pracy na poziomie stanowiska, o które się starasz. To w praktyce ten sam materiał, który zbierasz na <a href=\"/odcinki/niesprawiedliwa-ocena-roczna/\">ocenę roczną</a>.",
          "I zadbaj o to, żeby Twoja praca nie zatrzymała się w dniu, w którym przejdziesz wyżej. Pytanie „kto poprowadzi proces” najłatwiej rozbroić, zanim ktoś je zada.",
        ],
      },
    ],
    zapamietaj: [
      "<strong>Awans to pozycja w budżecie</strong>, a nie decyzja jednej osoby — zgodzić się musi cały łańcuch.",
      "<strong>Decyzja zapada przy prognozach w połowie roku.</strong> Ogłoszenie przychodzi pół roku później.",
      "<strong>Niezastąpiony specjalista awansuje najrzadziej</strong>, a nastawienie decyduje częściej niż liczby.",
      "<strong>Po odmowie pytaj o kryteria i termin,</strong> nie o powody — i zapisz odpowiedź.",
    ],
    powiazane: [9, 5],
    pomost: "Zanim pojawi się kolejna szansa na awans, często szybciej da się wygrać inną rozmowę — tę o <a href=\"/odcinki/jak-rozmawiac-o-podwyzce/\">podwyżce</a>.",
    cta: { gora: "<strong>Darmowa checklista:</strong> wzór notatki po trudnej rozmowie — w tym maila „potwierdzam ustalenia”, który zamienia ustną obietnicę w coś, do czego można wrócić.", dol: "<strong>Darmowa checklista.</strong> Wzór notatki po trudnej rozmowie i maila „potwierdzam ustalenia”, który zamienia ustną obietnicę w coś, do czego można wrócić. Dostaniesz ją mailem, za darmo." },
    transkrypcja: transkrypcje[10],
    konsultacje: true,
    gotowa: true,   // treść Klaudiusz 1.10, publikacja na prośbę Michała 1.10
  },
  {
    nr: 11,
    slug: 'nowy-szef-w-zespole',
    zapytanie: 'nowy szef w pracy jak się zachować',
    // Treść: Klaudiusz, 11.10 (z transkrypcji odc. 11). Historie z odcinka zostają w książce — tu tylko obserwacje.
    tytul: 'Nowy szef w pracy — jak się zachować na początku współpracy',
    opis: 'Nowy szef w pracy: co wie o Tobie, zanim Cię pozna, trzy błędy na pierwszym spotkaniu 1:1, co z ustaleniami z poprzednim szefem i po czym poznać gotowy plan.',
    h1: 'Nowy szef w pracy — jak się zachować w pierwszych tygodniach?',
    lead: [
      'Mail od dyrektora: od pierwszego dnia miesiąca Waszym przełożonym będzie… i nazwisko, którego nigdy nie słyszałeś. Kwadrans później cały zespół zgaduje w kuchni, co to znaczy.',
      'Przez dwadzieścia lat w korporacjach szef zmieniał mi się kilkanaście razy, a sam wielokrotnie byłem tym nowym, który wchodzi do cudzego zespołu. Poniżej to, co widać z obu stron — i jak przejść przez zmianę szefa bez strat.'
    ],
    sekcje: [
      {
        h2: 'Czy zmiana szefa jest tak nagła, jak się wydaje?',
        tresc: [
          'Nie. Kiedy Ty dowiadujesz się o nowym szefie, firma zwykle szuka go od miesięcy. Rekrutacja na stanowisko managerskie trwa dłużej niż na stanowisko specjalisty: więcej rozmów, więcej osób w procesie, dokładniejsze sprawdzanie kompetencji. Pomyłka przy managerze kosztuje firmę wielokrotnie więcej.',
          'Do tego firmy chętnie obsadzają takie stanowiska wewnętrznie. Nowy szef często wcale nie jest nowy w firmie — jest nowy tylko dla Ciebie.',
          '<strong>Zmiana szefa jest nagła tylko z Twojej perspektywy. To znaczy, że nie musisz reagować nagle.</strong>'
        ]
      },
      {
        h2: 'Co nowy szef wie o Tobie, zanim Cię pozna?',
        tresc: [
          'Są dwa scenariusze. W pierwszym nowy manager dostaje od swojego przełożonego pełny obraz zespołu: zakres pracy, wyniki i opis każdej osoby — kto jest mocny, kto ma problemy. Zanim Cię pozna, ma już o Tobie zdanie. Nie swoje, cudze.',
          'W drugim nie dostaje nic, bo poprzedni manager odszedł, nie umiał albo nie chciał opisać zespołu. Wtedy buduje opinię od zera.',
          'Na to, z jakim obrazem Ciebie przychodzi nowy szef, nie masz wpływu. <strong>Masz wpływ na to, co zobaczy w pierwszym miesiącu.</strong> A wtedy szuka konkretów: jak wygląda podział pracy, jak zespół się komunikuje i raportuje. To moment nie na pokazywanie się, tylko na pokazanie, jak pracujesz.'
        ]
      },
      {
        h2: 'Jakich błędów unikać na pierwszym spotkaniu z nowym szefem?',
        tresc: [
          'Wszystkie trzy wynikają z nerwów.',
          '<strong>Recytowanie osiągnięć.</strong> Lista projektów i wyników wydaje się budowaniem pozycji. Z fotela managera wygląda jak autopromocja.',
          '<strong>„Mam ustalone i koniec”.</strong> Obiecana podwyżka, elastyczne godziny, ścieżka awansu — przedstawione jak roszczenie. Nowy szef tych ustaleń nie zawierał i nie musi ich honorować. To fakt, nawet jeśli niesprawiedliwy.',
          '<strong>Narzekanie na poprzedniego szefa</strong>, zwłaszcza jeśli został w firmie. Nowy przełożony słyszy wtedy, jak kiedyś będziesz mówić o nim.',
          'Co zamiast tego? Kilka zdań o sobie i swojej roli, krótko. I lista pytań do niego: jaka jest jego historia, jaki ma plan na zespół, jak lubi pracować, jak chce dostawać informacje. Kto przychodzi z pytaniami, a nie z listą zasług, zostaje zapamiętany jako ktoś, kto chce współpracować.'
        ]
      },
      {
        h2: 'Co z ustaleniami, które miałeś z poprzednim szefem?',
        tresc: [
          'Przedstaw je otwarcie, ale jako informację i pytanie, nie jako roszczenie: „Z poprzednim przełożonym mieliśmy ustalone, że… Czy to ustalenie może pozostać w mocy?”',
          'Tu decyduje jedna rzecz. <strong>Jeśli masz to zapisane, to jest rozmowa. Jeśli nie masz — prośba.</strong> Notatka po spotkaniu 1:1, mail z podsumowaniem ustaleń, cele roczne z podpisem, materiał z <a href="/odcinki/niesprawiedliwa-ocena-roczna/">oceny rocznej</a>. Takie rzeczy warto mieć, zanim zmiana nastąpi, bo po zmianie już ich nie zdobędziesz.',
          'Dotyczy to zwłaszcza ustnych obietnic finansowych. Jeśli przed zmianą szefa rozmawiałeś o <a href="/odcinki/jak-rozmawiac-o-podwyzce/">podwyżce</a>, poproś o potwierdzenie ustaleń mailem jeszcze u obecnego przełożonego.'
        ]
      },
      {
        h2: 'Po czym poznać, że nowy szef ma gotowy plan, w którym Cię nie ma?',
        tresc: [
          'Najbardziej wiarygodny sygnał to brak zainteresowania. Nowy szef nie stara się poznać ludzi, nie robi spotkań 1:1 albo robi je pro forma, nie ustala zasad współpracy. <strong>Manager, który przychodzi coś zbudować, zbiera informacje. Manager, który przychodzi wykonać wcześniej podjętą decyzję, nie musi.</strong>',
          'Inne sygnały widać w codzienności: w tonie, w tym, kto jest pomijany w mailach. Ludzie zwykle je zauważają i tłumaczą sobie inaczej — a one rzadko znaczą co innego, niż wyglądają. Jeśli rozpoznajesz je u siebie, warto spokojnie sprawdzić, <a href="/odcinki/zmiana-pracy-kiedy-odejsc/">czy to już moment na zmianę pracy</a>.'
        ]
      },
      {
        h2: 'Ile czasu dać nowemu szefowi, zanim go ocenisz?',
        tresc: [
          'Więcej, niż Ci się wydaje. Kilka spotkań 1:1, żeby zobaczyć, jak chce pracować, jaki ma styl komunikacji i jaki plan. Pierwsze tygodnie nowego managera bywają nieporadne — uczy się procesu, dopytuje, zabiera czas. To irytuje, ale niewiele mówi o tym, jakim będzie szefem za pół roku.',
          'A jeśli po prostu nie ma między Wami chemii? Do pracy przychodzimy pracować, nie na spotkanie towarzyskie. Nie musimy się lubić. Musimy umieć rozmawiać kulturalnie, z szacunkiem i akceptować, że druga strona może mieć inne zdanie. To wystarcza.'
        ]
      }
    ],
    zapamietaj: [
      '<strong>Zmiana szefa jest nagła tylko dla Ciebie</strong> — firma planowała ją od miesięcy. Nie musisz reagować nagle.',
      '<strong>Na pierwsze spotkanie idź z pytaniami,</strong> nie z listą zasług i nie z narzekaniem na poprzednika.',
      '<strong>Ustalenia z poprzednim szefem miej zapisane,</strong> nie zapamiętane — i przedstaw je jako pytanie.',
      '<strong>Daj sobie czas, zanim ocenisz.</strong> Brak zainteresowania zespołem to sygnał, na który warto uważać.'
    ],
    powiazane: [5, 9, 12],
    pomost: 'Nowy szef to też dobry moment, żeby od początku było widać, co robisz — o tym, <a href="/odcinki/jak-budowac-pozycje-w-pracy/">jak budować swoją pozycję w pracy</a>.',
    cta: {
      gora: '<strong>Darmowa checklista:</strong> wzór notatki po rozmowie i maila „potwierdzam ustalenia” — dokładnie to, czego potrzebujesz, zanim zmieni się szef.',
      dol: '<strong>Darmowa checklista.</strong> Wzór notatki po trudnej rozmowie, mail „potwierdzam ustalenia” i 10 gotowych zdań na niesprawiedliwy feedback. Dostaniesz ją mailem, za darmo.'
    },
    konsultacje: true,
    gotowa: true, // zaakceptowane przez Michała 11.10, 00:25
  },
  {
    nr: 12,
    slug: 'zmiana-pracy-kiedy-odejsc',
    zapytanie: 'kiedy odejść z pracy',
    // Treść: Klaudiusz, 11.10 (z transkrypcji odc. 12). Historie z odcinka zostają w książce — tu tylko obserwacje.
    tytul: 'Kiedy odejść z pracy? Sprawdzalne powody i jak odejść z klasą',
    opis: 'Ludzie odchodzą z pracy za wcześnie albo za późno. Po czym poznać, że to ten moment, co sprawdzić przed wypowiedzeniem i jak powiedzieć o tym szefowi.',
    h1: 'Kiedy odejść z pracy, a kiedy jeszcze warto zostać?',
    lead: [
      'Podwyżki nie ma drugi rok z rzędu. Awans poszedł do kogoś innego. Nowy szef ma plan, w którym Cię nie widać. W pewnym momencie na stole pojawia się czwarta opcja: wyjście.',
      'Przez dwadzieścia lat w korporacjach przyjmowałem wypowiedzenia wiele razy i sam kilka razy zmieniałem pracę. Z tej perspektywy widać jedno: ludzie odchodzą albo za wcześnie, albo za późno. Poniżej — jak trafić w ten właściwy moment i jak odejść tak, żeby drzwi zostały otwarte.'
    ],
    sekcje: [
      {
        h2: 'Co nie jest dobrym powodem do odejścia z pracy?',
        tresc: [
          '<strong>Jedna zła rozmowa.</strong> Ocena, która zabolała, albo <a href="/odcinki/negatywny-feedback-od-szefa/">niesprawiedliwy feedback</a> — i tego samego wieczoru aktualizujesz CV. Jedna rozmowa to punkt, nie linia.',
          '<strong>Kontroferta jako plan.</strong> Szukanie pracy tylko po to, żeby przynieść ofertę szefowi, to gra, którą zwykle się przegrywa. Ofertę z rynku traktuj jako decyzję o odejściu, nie jako dźwignię w <a href="/odcinki/jak-rozmawiac-o-podwyzce/">rozmowie o podwyżce</a>.',
          '<strong>„Wszędzie jest lepiej”.</strong> Zmęczenie firmą, w której jesteś od lat, robi z każdego ogłoszenia obietnicę. Widziałem ludzi, którzy wracali po kilku miesiącach.',
          'Na tej liście nie ma też „koleżanka z innego działu ma lepszego szefa” ani „firma obok płaci 10% więcej”. To są powody do rozmowy, nie do wyjścia.'
        ]
      },
      {
        h2: 'Po czym poznać, że to już czas odejść?',
        tresc: [
          'Dobry powód da się sprawdzić, nie tylko poczuć. Są trzy takie sytuacje.',
          '<strong>Spełnione kryteria, brak wyniku.</strong> Usłyszałeś „nie”, poprosiłeś o kryteria i termin, spełniłeś je — i znów „nie”. To już nie informacja o budżecie, tylko o Twojej pozycji w tej firmie. Zwłaszcza jeśli wcześniej zadbałeś o to, żeby <a href="/odcinki/jak-budowac-pozycje-w-pracy/">Twoja praca była widoczna</a>.',
          '<strong>Ścieżka, której nie ma.</strong> Pytałeś, co musiałoby się wydarzyć, żebyś poszedł dalej, i nikt nie potrafi odpowiedzieć. To nie niesprawiedliwość, tylko sufit.',
          '<strong>Cena płacona zdrowiem.</strong> Jeśli źle śpisz i jesteś wyczerpany miesiącami, a nie tygodniami, i nie zmienia tego ani urlop, ani rozmowa z szefem — żadna podwyżka tego nie kupi.'
        ]
      },
      {
        h2: 'Co sprawdzić, zanim złożysz wypowiedzenie?',
        tresc: [
          '<strong>Najpierw podpisana umowa, potem ogłoszenie.</strong> Nie mail z ofertą, nie ustne „dogadaliśmy się” — podpisana umowa z nowym pracodawcą. Widziałem ludzi, którzy złożyli wypowiedzenie na podstawie obietnicy, a obietnica się rozmyła.',
          '<strong>Przeczytaj obecną umowę:</strong> długość okresu wypowiedzenia i od kiedy się liczy, zakaz konkurencji (czy jest, jak długo, za jakie pieniądze), bonus roczny, premie za pozostanie, szkolenia, za które firma może chcieć zwrotu. Chodzi o to, żebyś na rozmowie wiedział więcej niż Twój szef.',
          '<strong>Zabezpiecz swoje dokumenty</strong> — nie firmowe, tylko swoje: podpisane cele, oceny, maile z podziękowaniami, notatki z rozmów. Po złożeniu wypowiedzenia dostęp do skrzynki może zniknąć szybciej, niż myślisz.',
          '<strong>Policz kalendarz.</strong> Kiedy wypłacany jest bonus, kiedy kończy się okres, po którym coś Ci przysługuje. Czasem trzy tygodnie różnicy w dacie wypowiedzenia to miesięczna pensja.'
        ]
      },
      {
        h2: 'Jak powiedzieć szefowi, że odchodzisz?',
        tresc: [
          'Jedna zasada przebija wszystkie inne: <strong>szef dowiaduje się pierwszy, od Ciebie, osobiście.</strong> Nie z maila do HR, nie od kolegi z zespołu, nie z LinkedIna i nie SMS-em.',
          'To krótka rozmowa — nie o tym, dlaczego, tylko o tym, że. Wystarczą trzy zdania: „Podjąłem decyzję o odejściu z firmy. Przyjąłem ofertę, umowa jest podpisana, dziś składam wypowiedzenie. Chcę, żeby przekazanie obowiązków było zrobione porządnie — jak chcesz to zorganizować?”',
          'Bez listy zarzutów i bez kwoty, którą dostajesz gdzie indziej. Jeśli szef zapyta o powód, podaj jeden i prawdziwy.',
          'Bądź gotowy na kontrofertę. Jeśli podpisałeś umowę z nową firmą, a potem ją odrzucasz dla kontroferty, spalasz dwie relacje jednego dnia. Odpowiedź warto mieć przygotowaną, zanim usiądziesz: „Dziękuję, decyzja jest podjęta”.'
        ]
      },
      {
        h2: 'Jak przepracować okres wypowiedzenia?',
        tresc: [
          'Ostatnie tygodnie ważą w Twojej opinii więcej niż poprzednie lata, bo to je ludzie zapamiętają. <strong>Manager rzadko pamięta, dlaczego ktoś odszedł. Pamięta, jak.</strong>',
          'Zrób przekazanie tak, jakbyś miał do tej firmy wrócić: dokument z otwartymi sprawami, kto co przejmuje, gdzie są pliki, jakie są terminy. Przeszkol następcę, domknij, co się da. To właśnie o tym będzie myślał Twój były szef, kiedy za rok ktoś zadzwoni po referencje.',
          'Exit interview to nie spowiedź. To taki sam dokument jak wszystko w tej firmie. Mów to, co powiedziałbyś szefowi w twarz: konkretnie, bez nazwisk i bez emocji.',
          'Firmy lubią zatrudniać ludzi, których znają — także byłych pracowników. Ale tylko wtedy, gdy wyjście było zrobione po ludzku.'
        ]
      },
      {
        h2: 'Jak zacząć w nowej pracy?',
        tresc: [
          'Teraz to Ty przychodzisz do <a href="/odcinki/nowy-szef-w-zespole/">nowego szefa</a> i do zespołu, który ma o Tobie zdanie, zanim Cię pozna. Nie opowiadaj, jak było w poprzedniej firmie, i nie mów źle o poprzednim pracodawcy — nowy szef słyszy wtedy, jak kiedyś będziesz mówił o nim.',
          'Pierwsze trzy miesiące to nie czas na naprawianie nowej firmy. Widzisz od razu, co jest zrobione źle? Zapisuj. Połowa tych rzeczy będzie miała powód, którego jeszcze nie znasz. Druga połowa stanie się Twoim pierwszym projektem — kiedy będziesz już miał zaufanie, żeby go zrobić.'
        ]
      }
    ],
    zapamietaj: [
      '<strong>Powód do odejścia musi dać się sprawdzić, nie tylko poczuć.</strong> Spełnione kryteria bez wyniku to powód; jedna zła rozmowa nie.',
      '<strong>Najpierw podpisana umowa z nową firmą,</strong> potem wypowiedzenie — i przeczytana obecna umowa.',
      '<strong>Szef dowiaduje się pierwszy, od Ciebie, w trzech zdaniach.</strong> Odpowiedź na kontrofertę masz gotową wcześniej.',
      '<strong>Ostatnie tygodnie ważą więcej niż poprzednie lata.</strong> Odchodź tak, jakbyś miał wrócić.'
    ],
    powiazane: [9, 10, 13],
    pomost: 'Czasem zamiast wypowiedzenia przychodzi coś innego — <a href="/odcinki/spotkanie-z-hr-bez-tematu/">zaproszenie na spotkanie z HR bez tematu</a>. Warto wiedzieć, co może oznaczać.',
    cta: {
      gora: '<strong>Darmowa checklista:</strong> wzór notatki po rozmowie — przy zmianie pracy to także szkielet porządnego przekazania obowiązków.',
      dol: '<strong>Darmowa checklista.</strong> Wzór notatki po trudnej rozmowie i maila „potwierdzam ustalenia”. Przekazanie obowiązków to ta sama notatka, tylko dłuższa. Dostaniesz ją mailem, za darmo.'
    },
    notaPrawna:
      'To materiał edukacyjny oparty na doświadczeniu managerskim, a nie porada prawna. ' +
      'Okres wypowiedzenia, zakaz konkurencji i rozliczenia zależą od Twojej umowy — w konkretnej sprawie ' +
      'skontaktuj się z prawnikiem specjalizującym się w prawie pracy.',
    konsultacje: true,
    gotowa: true, // zaakceptowane przez Michała 11.10, 00:19
  },
  // #13–#15: slugi i zapytania Klaudiusz 1.10 (sprawdzone z całą mapą).
  {
    nr: 13,
    slug: 'jak-budowac-pozycje-w-pracy',
    zapytanie: 'jak budować swoją pozycję w pracy',
    // Treść: Klaudiusz, 11.10 (z transkrypcji odc. 13). Historie z odcinka zostają w książce — tu tylko obserwacje.
    tytul: 'Jak budować swoją pozycję w pracy — bez autopromocji',
    opis: 'Szef widzi tylko wycinek Twojej pracy. Jak budować pozycję bez autopromocji: trzy poziomy widoczności i cztery nawyki na kilkanaście minut tygodniowo.',
    h1: 'Jak budować swoją pozycję w pracy, skoro szef nie widzi, co robisz?',
    lead: [
      'Pracujesz dobrze, dowozisz, zostajesz dłużej. A przy ocenie albo przy okazji awansu okazuje się, że nikt poza Twoim biurkiem nie wie, ile z tego jest Twoją zasługą. Pierwsza myśl: przecież to widać.',
      'Przez dwadzieścia lat pracowałem w korporacjach, jako specjalista i jako manager. Z fotela managera powiem wprost rzecz niewygodną: dobra praca sama się nie broni. Poniżej to, co z tamtej strony stołu widać — i jak zbudować pozycję bez udawania kogoś, kim nie jesteś.'
    ],
    sekcje: [
      {
        h2: 'Dlaczego dobra praca nie wystarczy, żeby ktoś ją zauważył?',
        tresc: [
          'Bo Twój szef nie wie, co robisz. Nie dlatego, że go to nie obchodzi. Ma pod sobą kilkanaście osób, sam raportuje wyżej i spędza dzień na spotkaniach. Z Twojej pracy widzi wycinek — ten, który akurat trafi w jego pole widzenia.',
          'Ktoś Twoją pracę w końcu zauważy. Ale zwykle nie wtedy, kiedy tego potrzebujesz, tylko wtedy, kiedy przypadkiem spojrzy w Twoją stronę. <strong>Zapełnienie reszty tego pola jest Twoim zadaniem, nie jego.</strong> To nie zła wola, tylko arytmetyka jego kalendarza.'
        ]
      },
      {
        h2: 'Czym widoczność różni się od autopromocji?',
        tresc: [
          'Autopromocja to mówienie o sobie. Widoczność to mówienie o pracy: co jest zrobione, co w toku, co zagrożone. Różnica jest w podmiocie zdania.',
          '„Świetnie poradziłem sobie z migracją” — to autopromocja. „Migracja zamknięta dwa dni przed terminem, został jeden otwarty punkt po stronie klienta” — to widoczność. Drugie zdanie mówi o Tobie tyle samo, tylko nie jest o Tobie.',
          'Widoczność to też nie lizusostwo. Lizusostwo to zabieganie o sympatię, widoczność to dostarczanie informacji. Szef nie musi Cię lubić, żeby wiedzieć, że jesteś osobą, która domyka tematy.',
          'I to nie jest bycie głośnym. Najbardziej widoczne osoby w moich zespołach nie mówiły najwięcej na spotkaniach. Były tymi, po których było wiadomo, czego się spodziewać. <strong>Głośność zużywa się po kilku miesiącach, przewidywalność nie zużywa się nigdy.</strong>'
        ]
      },
      {
        h2: 'Na jakich trzech poziomach budować pozycję w pracy?',
        tresc: [
          '<strong>Twój szef.</strong> Najłatwiejszy poziom i najczęściej zaniedbywany. Szef powinien w każdej chwili wiedzieć, co jest zrobione, co w toku i co zagrożone — na bieżąco, a nie raz na kwartał przy ocenie. Najważniejsze jest to trzecie. Ludzie chętnie raportują sukcesy, a ryzyka trzymają przy sobie. Tymczasem osoba, która mówi „to jest zagrożone, proponuję takie rozwiązanie”, buduje zaufanie szybciej niż ta, która przynosi tylko dobre wiadomości.',
          '<strong>Szef Twojego szefa.</strong> Ten poziom decyduje o podwyżkach i awansach, a większość ludzi w ogóle na nim nie istnieje. Nie chodzi o chodzenie nad głową przełożonego — to kończy się źle. Chodzi o to, żeby Twoje nazwisko pojawiało się przy konkretnej pracy: sam prezentujesz wyniki na przeglądzie, zamiast wysyłać slajdy szefowi; odpowiadasz na maila, w którym jesteś w kopii, zamiast czekać, aż odpowie ktoś wyżej.',
          '<strong>Poza Twoim działem.</strong> Ten poziom daje najwięcej i kosztuje najmniej: inne zespoły, inne kraje, wdrożenia, projekty przekrojowe. Kiedy otwiera się stanowisko, pierwsze pytanie przy stole brzmi „kogo znamy?”. Osoba, którą zna tylko własny dział, jest kandydatem tylko we własnym dziale — i to jeden z powodów, <a href="/odcinki/dlaczego-nie-dostalem-awansu/">dla których dobrzy specjaliści nie dostają awansu</a>.'
        ]
      },
      {
        h2: 'Jakie nawyki budują pozycję w kilkanaście minut tygodniowo?',
        tresc: [
          '<strong>Notatka po rozmowie.</strong> Ustaliliście coś na spotkaniu — wysyłasz trzy zdania: co ustaliliśmy, kto co robi, do kiedy. Za pół roku to jedyny dowód, że coś było ustalone. A szef przy okazji dostaje regularny sygnał, że temat ma właściciela.',
          '<strong>Cotygodniowy status w trzech linijkach.</strong> Zrobione, w toku, zagrożone. Jeśli masz spotkania 1:1, to jest ich agenda; jeśli nie — wyślij to mailem w piątek. Po roku masz około pięćdziesięciu maili opisujących Twoją pracę tydzień po tygodniu. To materiał na <a href="/odcinki/jak-rozmawiac-o-podwyzce/">rozmowę o podwyżce</a>, którego nikt nie odtworzy z pamięci.',
          '<strong>Jedna rzecz przekrojowa naraz.</strong> Wdrożenie systemu, projekt z innym krajem, opisanie procesu, przeszkolenie nowego zespołu. Nikt się do tego nie pcha i właśnie dlatego działa. Ale tylko jedna naraz — dwie oznaczają, że obie zrobisz gorzej niż swoją podstawową pracę.',
          '<strong>Umiejętność powiedzenia, co się zrobiło.</strong> Bez przechwałek i bez umniejszania. Ćwiczenie: opisz ostatnią zamkniętą sprawę w trzech zdaniach — problem, co zrobiłeś, jaki był efekt. Jeśli nie zrobisz tego spokojnie przy biurku, nie zrobisz tego na przeglądzie, kiedy dostaniesz na to trzydzieści sekund.'
        ]
      },
      {
        h2: 'Czy z widocznością można przesadzić?',
        tresc: [
          'Można — w obie strony. Widoczność bez pokrycia, czyli dużo pomysłów i mało dowiezionej pracy, nie pęka od góry, tylko od boku. Manager może przez chwilę tego nie zauważyć. Zespół widzi od pierwszego tygodnia, bo to on przejmuje to, czego ktoś nie zrobił. Kolejność jest prosta: najpierw to, za co Ci płacą, potem to, co Cię pokazuje.',
          'Druga skrajność jest częstsza i trudniej ją zauważyć u siebie: praca po godzinach, bez przerw, wszystko dopilnowane osobiście. Sam kiedyś przegrałem w ten sposób awans — nie dlatego, że pracowałem za mało, tylko dlatego, że pracowałem tak dużo, że nie zostało miejsca na nic innego. <strong>Ciężka praca w samotności nie buduje pozycji, buduje zmęczenie.</strong>',
          'Dobra wiadomość: widoczność nie wymaga pracy dłużej. Wymaga przestania zakładania, że ktoś zauważy sam. Najlepiej zacząć od rozmowy z szefem na najbliższym spotkaniu 1:1.'
        ]
      },
      {
        h2: 'Co, jeśli mimo widoczności słyszysz „nie”?',
        tresc: [
          'Widoczność jest warunkiem koniecznym, nie wystarczającym. Możesz robić wszystko powyżej i nadal usłyszeć odmowę. Wtedy zamieniasz „nie” na kryteria i termin: co konkretnie musiałoby się zmienić i do kiedy.',
          'Jeśli kryteria spełnisz, termin minie i znów usłyszysz „nie”, to już nie jest informacja o Twojej widoczności. To informacja o Twojej pozycji w tej firmie — i tym razem wiesz to na pewno, bo wykluczyłeś jedyną rzecz, którą naprawdę kontrolowałeś.',
          'Jest też uczciwa trzecia możliwość: ścieżka ekspercka. Zostać ekspertem zamiast managerem to pełnoprawny wybór. Warto tylko sprawdzić, czy wybierasz ją, bo tego chcesz, czy dlatego, że przestałeś próbować.'
        ]
      }
    ],
    zapamietaj: [
      '<strong>Szef widzi tylko wycinek Twojej pracy</strong> — to arytmetyka jego kalendarza, nie zła wola.',
      '<strong>Widoczność to mówienie o pracy, nie o sobie:</strong> zrobione, w toku, zagrożone — zwłaszcza zagrożone.',
      '<strong>Trzy poziomy:</strong> szef, szef szefa i ludzie spoza działu. Ten trzeci daje najwięcej.',
      '<strong>Cztery nawyki:</strong> notatka po rozmowie, status w trzech linijkach, jedna rzecz przekrojowa, opis sprawy w trzech zdaniach.',
      '<strong>Widoczność nie gwarantuje awansu,</strong> ale pozwala sprawdzić, czy w tej firmie warto zostać.'
    ],
    powiazane: [10, 9],
    pomost: 'Widoczność najmocniej procentuje w chwili, której nie widać — kiedy przełożeni rozmawiają o <a href="/odcinki/dlaczego-nie-dostalem-awansu/">awansach</a> pół roku przed ogłoszeniem.',
    cta: {
      gora: '<strong>Darmowa checklista:</strong> wzór notatki po rozmowie i szablon cotygodniowego statusu w trzech linijkach — dwa narzędzia z tego odcinka.',
      dol: '<strong>Darmowa checklista.</strong> Wzór notatki po rozmowie i szablon cotygodniowego statusu: zrobione, w toku, zagrożone. Dostaniesz ją mailem, za darmo.'
    },
    konsultacje: true,
    gotowa: true, // zaakceptowane przez Michała 11.10, 00:17
  },
  {
    nr: 14,
    slug: 'restrukturyzacja-w-firmie-co-robic',
    zapytanie: 'restrukturyzacja w firmie co robić',
    // Treść: Klaudiusz, 11.10 (z transkrypcji odc. 14). Historie z odcinka zostają w książce — tu tylko obserwacje.
    tytul: 'Restrukturyzacja w firmie — co robić, zanim zapadnie decyzja',
    opis: 'Restrukturyzacja w firmie: które sygnały naprawdę coś znaczą, co jest pod Twoją kontrolą, czego nie robić i jak zareagować na propozycję likwidacji stanowiska.',
    h1: 'Restrukturyzacja w firmie — co robić, kiedy nikt jeszcze nic nie ogłosił?',
    lead: [
      'Restrukturyzacja, optymalizacja, transformacja, reorganizacja. Różne słowa, jedno znaczenie: ktoś straci pracę i jeszcze nie wiadomo kto. Najtrudniejszy jest czas, w którym nic nie ogłoszono, a wszyscy już coś wiedzą.',
      'Przechodziłem przez restrukturyzacje dwa razy — raz jako pracownik, raz jako manager, który zbierał dane do decyzji. Nie obiecam, że da się to przejść bez strat. Pokażę za to, co w tym czasie jest pod Twoją kontrolą, a co nie — bo większość ludzi wkłada energię dokładnie w to drugie.'
    ],
    sekcje: [
      {
        h2: 'Po czym poznać, że w firmie szykuje się restrukturyzacja?',
        tresc: [
          'Najpierw dwa sygnały, które niepokoją, a znaczą niewiele: seria spotkań bez nazwy w kalendarzu szefa i wizyta kogoś z centrali. Jedno i drugie zdarza się przez cały rok.',
          'Sygnały, które znaczą więcej:',
          '<strong>Zamrożona rekrutacja</strong> — ktoś odchodzi i nikt nie szuka następcy. <strong>Zamrożone podwyżki i awanse</strong>, mniejsza pula premii. <strong>Znikają drobne rzeczy</strong>, które były standardem: wyjazdy integracyjne, szkolenia, mały budżet zespołu. Jeśli firma oszczędza na czymś, co kosztuje mało, szuka oszczędności wszędzie. <strong>Pytania o opis procesów i liczby</strong> — ile czasu zajmuje czynność, ile osób jest potrzebnych, co da się zautomatyzować. <strong>Cisza tam, gdzie zwykle była informacja</strong> — szef, który mówił wszystko, zaczyna odpowiadać ogólnikami. Zwykle nie dlatego, że przestał Cię lubić, tylko dlatego, że wie coś, czego nie wolno mu powiedzieć.',
          '<strong>Pojedynczy sygnał nie znaczy prawie nic. Trzy, cztery naraz znaczą dużo</strong> — ale nawet wtedy pozwalają tylko zacząć się przygotowywać wcześniej. Nie przewidzą decyzji, bo ona często jeszcze nie zapadła.'
        ]
      },
      {
        h2: 'Co jest pod Twoją kontrolą w czasie restrukturyzacji?',
        tresc: [
          'Najczęstszy błąd to tygodnie spędzone na czytaniu znaków i rozmowach na korytarzu. <strong>Przewidywanie nie przygotowuje. Przygotowanie przygotowuje.</strong> Pod Twoją kontrolą są trzy rzeczy.',
          '<strong>Czy wiadomo, co robisz.</strong> Przy restrukturyzacji ktoś siada nad listą stanowisk i pyta: co ta osoba właściwie robi i co się stanie, jeśli jej zabraknie? Odpowiedź „nie wiadomo” nie działa na Twoją korzyść. Nie chodzi o ukrywanie wiedzy, żeby być niezastąpionym — managerowie widzą to od razu. Chodzi o to, żeby było jasne, co się skończy, gdy Ciebie nie będzie.',
          '<strong>Czy znają Cię poza Twoim zespołem.</strong> Przy przetasowaniu struktur ludzie trafiają do innych zespołów, a pierwsze pytanie brzmi: kogo znamy? To moment, w którym <a href="/odcinki/jak-budowac-pozycje-w-pracy/">budowanie pozycji poza działem</a> zwraca się z nawiązką.',
          '<strong>Czy wiesz, co masz na rynku.</strong> Zaktualizowane CV, odświeżony profil, kilka rozmów z ludźmi z branży. Nie dlatego, że na pewno odejdziesz. Dlatego, że strach jest dużo mniejszy, kiedy wiesz, jakie masz opcje. Nie przygotowujesz się do odejścia — przygotowujesz się do tego, żeby mieć wybór.'
        ]
      },
      {
        h2: 'Czego nie robić, gdy w firmie trwają zwolnienia?',
        tresc: [
          '<strong>Nie pytaj szefa wprost, czy jesteś na liście.</strong> Stawiasz go w sytuacji, w której albo skłamie, albo złamie zasady, którymi jest związany. Zapytaj inaczej: „Czy jest coś, co powinienem wiedzieć, żeby lepiej zaplanować najbliższe miesiące?” Jeśli szef może cokolwiek powiedzieć, powie to właśnie tu.',
          '<strong>Nie żyj plotkami.</strong> Korytarzowa wersja restrukturyzacji jest zawsze szybsza od prawdziwej i prawie zawsze inna. Kto przeżywa każdą plotkę, wychodzi z tego wyczerpany, niezależnie od wyniku.',
          '<strong>Nie przestawaj pracować.</strong> Przy decyzjach o cięciach patrzy się na ostatnie miesiące. Odpuszczając w chwili, gdy ktoś przygląda się liczbom, sam dopisujesz się do listy.',
          '<strong>Nie zostawaj po godzinach, żeby pokazać, że jesteś potrzebny.</strong> Nikt przy liście stanowisk nie sprawdza, kto wychodził najpóźniej. Patrzy się na to, co jest zapisane.'
        ]
      },
      {
        h2: 'Jak wygląda restrukturyzacja, której nikt nie ogłasza?',
        tresc: [
          'Nie zawsze jest ogłoszenie i lista nazwisk. Często restrukturyzacja to cisza: nikt nie przychodzi na miejsce osoby, która odeszła, pracy jest tyle samo, a ludzi coraz mniej. Firma czeka na naturalną rotację i etaty znikają po kilku miesiącach bez jednego zwolnienia.',
          'Z perspektywy firmy to najlepszy scenariusz: bez odpraw i bez dramatów. Dla zespołu bywa trudniejszy, niż się wydaje. Odchodzą kolejne doświadczone osoby, spada jakość i morale, a każde odejście boli bardziej niż poprzednie. Jeśli w Twoim zespole od pół roku nikt nie przyszedł na miejsce tych, którzy odeszli — możliwe, że to już się dzieje.',
          'Taki zespół nie musi się rozpaść, ale nie poradzi sobie sam z siebie. Ktoś musi o to zawalczyć — a pomoc często przychodzi z innych zespołów, z którymi są już zbudowane relacje. Jeśli to Ty prowadzisz taki zespół, zacznij od rozmów jeden na jeden — więcej o tym, <a href="/odcinki/trudny-pracownik-w-zespole/">jak przejąć trudny zespół i rozmawiać z trudnym pracownikiem</a>.'
        ]
      },
      {
        h2: 'Co zrobić, gdy Twoje stanowisko jest likwidowane?',
        tresc: [
          'Dostajesz informację o likwidacji stanowiska albo propozycję, która jest degradacją w przebraniu. Trzy rzeczy, w tej kolejności.',
          '<strong>Nie odpowiadaj od razu.</strong> Druga strona przygotowywała tę rozmowę tygodniami, Ty masz kilka sekund. Wystarczy jedno zdanie: „Potrzebuję to przemyśleć, wrócę do tego jutro”. Nikt rozsądny tego nie odmówi.',
          '<strong>Poproś o wszystko na piśmie:</strong> warunki, terminy, kwoty, nazwę stanowiska. W takich rozmowach pada dużo zdań, które brzmią jak ustalenia, a nimi nie są.',
          '<strong>Sprawdź, co jest do negocjacji.</strong> Zwykle więcej, niż zakładasz: termin, forma rozwiązania umowy, odprawa, okres wypowiedzenia, referencje, czasem sfinansowanie kursu. Pierwsza propozycja rzadko jest jedyną możliwą.',
          'Propozycja degradacji to informacja o Twojej pozycji w tej firmie, nie o Twojej wartości. Wartość zabierasz ze sobą. Jeśli dojdziesz do wniosku, że czas iść dalej, przeczytaj, <a href="/odcinki/zmiana-pracy-kiedy-odejsc/">jak odejść z pracy z klasą</a>.'
        ]
      }
    ],
    zapamietaj: [
      '<strong>Pojedynczy sygnał nie znaczy nic, kilka naraz — dużo.</strong> Ale służą tylko do tego, żeby zacząć się przygotowywać wcześniej.',
      '<strong>Przewidywanie to nie przygotowanie.</strong> Pod Twoją kontrolą jest to, czy wiadomo, co robisz, czy znają Cię poza zespołem i czy wiesz, co masz na rynku.',
      '<strong>Restrukturyzacja częściej jest ciszą niż ogłoszeniem</strong> — puste miejsca po odejściach to też sygnał.',
      '<strong>Gdy decyzja zapadnie:</strong> nie odpowiadaj od razu, poproś o wszystko na piśmie i sprawdź, co jest do negocjacji.'
    ],
    powiazane: [8, 12, 13],
    pomost: 'Rozmowa o likwidacji stanowiska często zaczyna się od maila, w którym nie ma tematu — dlatego warto wiedzieć, co może oznaczać <a href="/odcinki/spotkanie-z-hr-bez-tematu/">zaproszenie na spotkanie z HR bez tematu</a>.',
    cta: {
      gora: '<strong>Darmowa checklista:</strong> wzór notatki po trudnej rozmowie i maila „potwierdzam ustalenia” — przydaje się zwłaszcza wtedy, gdy padają warunki, kwoty i terminy.',
      dol: '<strong>Darmowa checklista.</strong> Wzór notatki po trudnej rozmowie i maila „potwierdzam ustalenia”, który zamienia ustne deklaracje w coś, do czego można wrócić. Dostaniesz ją mailem, za darmo.'
    },
    notaPrawna:
      'To materiał edukacyjny oparty na doświadczeniu managerskim, a nie porada prawna. ' +
      'Zasady zwolnień, odpraw i rozwiązywania umów zależą od przepisów i Twojej sytuacji — w konkretnej sprawie ' +
      'skontaktuj się z prawnikiem specjalizującym się w prawie pracy.',
    konsultacje: true,
    gotowa: true, // zaakceptowane przez Michała 11.10, 00:21
  },
  {
    nr: 15,
    slug: 'trudny-pracownik-w-zespole',
    zapytanie: 'jak rozmawiać z trudnym pracownikiem',
    // Treść: Klaudiusz, 11.10 (z transkrypcji odc. 15). Historie z odcinka zostają w książce — tu tylko obserwacje.
    tytul: 'Jak rozmawiać z trudnym pracownikiem — perspektywa managera',
    opis: 'Trudny pracownik to dwa różne problemy: ktoś nie dowozi albo dowozi, ale psuje atmosferę. Jak rozmawiać w obu przypadkach i kiedy przestać czekać.',
    h1: 'Jak rozmawiać z trudnym pracownikiem, żeby coś się zmieniło?',
    lead: [
      'Jedna osoba, przez którą cierpi cały zespół. To pytanie managerowie zadają najczęściej — i najczęściej odkładają rozmowę, licząc, że problem rozwiąże się sam.',
      'Przez lata prowadziłem zespoły, także takie, które dostałem w złym momencie. Poniżej to, co działało w rozmowach z trudnymi pracownikami — i co nie działało nigdy. A jeśli nie jesteś managerem, ta strona pokaże Ci, jak wygląda druga strona stołu.'
    ],
    sekcje: [
      {
        h2: 'Kto jest „trudnym pracownikiem”?',
        tresc: [
          'Pod tym określeniem kryją się dwa różne przypadki i każdy wymaga innej rozmowy. <strong>Pierwszy: ktoś nie dowozi.</strong> Wyniki, terminy albo jakość odbiegają od reszty zespołu. <strong>Drugi: ktoś dowozi, ale psuje atmosferę.</strong> Wyniki są dobre, a zespół cierpi.',
          'Zanim zaczniesz, sprawdź jeszcze jedno: czy problemem na pewno jest jedna osoba. Zespół po cięciach, zespół po lubianym poprzedniku i zespół z konfliktem w środku też wyglądają z zewnątrz na „trudnych ludzi”. Nowi managerowie często leczą niewłaściwą chorobę. <strong>Pierwsze zadanie to nie naprawić, tylko zdiagnozować.</strong>'
        ]
      },
      {
        h2: 'Jak rozmawiać z pracownikiem, który nie dowozi?',
        tresc: [
          'To łatwiejszy przypadek, bo masz narzędzia: rozmowę, konkretne oczekiwania, termin, a jeśli trzeba — <a href="/odcinki/plan-naprawczy-pip/">plan naprawczy</a>.',
          'Jest jeden warunek, którego wielu managerów nie spełnia: <strong>ta osoba musi wiedzieć, że jest problem.</strong> Zaskakująco często nie wie. Manager mówi o tym wszystkim dookoła, a samej zainteresowanej powiedział raz, pół roku temu, tak łagodnie, że nikt by tego nie zrozumiał.',
          'Powiedz wprost: co jest nie tak, czego oczekujesz, do kiedy i jak będziesz to sprawdzać. Po rozmowie wyślij krótką notatkę z ustaleniami. Wtedy obie strony wiedzą, o czym rozmawiały.'
        ]
      },
      {
        h2: 'Jak rozmawiać z kimś, kto ma wyniki, ale psuje atmosferę?',
        tresc: [
          'To znacznie trudniejsze, bo nie masz twardych danych. Działa tylko konkret.',
          'Nie: „masz złe nastawienie”. Tego nie da się obronić i każdy to odbije. Tak: <strong>„Na wczorajszym spotkaniu powiedziałeś to i to. W reakcji jedna z osób przestała się odzywać do końca spotkania. Tego u mnie nie ma.”</strong> Konkretne zachowanie, konkretny skutek i jasna granica.',
          'Ocena człowieka uruchamia obronę. Opis zachowania daje coś, co można zmienić.'
        ]
      },
      {
        h2: 'Co, jeśli pracownik nie wierzy, że da radę?',
        tresc: [
          'Większość rozmów o motywacji zakłada kolejność: najpierw motywacja, potem wyniki. W praktyce częściej jest odwrotnie. <strong>Najpierw przychodzi pierwszy mały sukces, a motywacja pojawia się po nim.</strong>',
          'Człowiekowi, który nie wierzy w siebie, nie pomoże rozmowa o tym, że powinien wierzyć. Pomoże jedno konkretne doświadczenie, w którym coś zadziałało. Zadaniem managera jest to umożliwić: dać narzędzie, pokazać technikę, być obok przy pierwszych próbach.',
          'I wytrzymać okres, w którym efektów jeszcze nie widać. To moment, w którym wiele takich historii kończy się za wcześnie — kilka sesji, brak efektu, przejście do planu naprawczego. Czasem słusznie. Czasem nie.'
        ]
      },
      {
        h2: 'Kiedy brak reakcji managera staje się decyzją?',
        tresc: [
          'Jeśli przez pół roku nic się nie zmienia, Twoja bezczynność staje się Twoją decyzją: wolisz problem z jedną osobą niż ryzyko trudnej rozmowy. Tyle że reszta zespołu to widzi i wyciąga wnioski — o Tobie.',
          '<strong>Nie musisz być lubiany. Musisz być przewidywalny.</strong> Ludzie znoszą wymagającego szefa, o którym wiedzą, czego się spodziewać. Nie znoszą szefa, przy którym nie wiadomo, co będzie jutro.',
          'To samo dotyczy niepopularnych decyzji. Muszą obowiązywać wszystkich tak samo — decyzja z wyjątkami jest gorsza niż brak decyzji. I muszą przetrwać pierwsze protesty. Zmiana zdania jest w porządku, ale powodem ma być nowy argument, a nie poziom hałasu.'
        ]
      },
      {
        h2: 'Jak zacząć, jeśli dopiero przejąłeś trudny zespół?',
        tresc: [
          'Kolejność ma znaczenie. <strong>Najpierw rozmowy jeden na jeden</strong>, z każdym osobno, zanim cokolwiek ogłosisz. Trzy pytania: co w tej pracy działa dobrze i czego nie chcesz, żebym zmieniał? Co Cię najbardziej frustruje? Gdybyś był na moim miejscu, co zrobiłbyś najpierw?',
          '<strong>Potem spotkanie zespołu</strong>, na którym zasady układacie razem, z tego, co padło w rozmowach. Zasady, pod którymi ludzie sami się podpisali, działają bez pilnowania. <strong>Na końcu cele indywidualne i podział ról</strong> — dopiero teraz wiesz, kto czego chce i kto co potrafi.',
          'Dwa ostrzeżenia. Jeśli o coś pytasz, musisz coś z tym zrobić — rozmowy, po których nic się nie dzieje, są gorsze niż ich brak. I nie obiecuj rzeczy, o których nie decydujesz sam: awansów, podwyżek, braku zwolnień. Obiecaj tylko to, co możesz: „Nie mogę Ci tego obiecać, ale upomnę się o to i powiem Ci, jaka jest odpowiedź”.'
        ]
      }
    ],
    zapamietaj: [
      '<strong>Najpierw diagnoza, potem naprawa.</strong> Ktoś, kto nie dowozi, i ktoś, kto psuje atmosferę, to dwie różne rozmowy.',
      '<strong>Pracownik musi wiedzieć, że jest problem</strong> — powiedziane wprost, z oczekiwaniami i terminem.',
      '<strong>Opisuj zachowanie i jego skutek,</strong> nie oceniaj człowieka.',
      '<strong>Nie musisz być lubiany, musisz być przewidywalny.</strong> Bezczynność po pół roku to też decyzja.'
    ],
    powiazane: [2, 1],
    pomost: 'Druga strona tej samej rozmowy wygląda zupełnie inaczej — tak <a href="/odcinki/negatywny-feedback-od-szefa/">przeżywa ją pracownik, który usłyszał krytykę od szefa</a>.',
    cta: {
      gora: '<strong>Darmowa checklista:</strong> przygotowanie do trudnej rozmowy i wzór notatki z ustaleniami — przydaje się po obu stronach stołu.',
      dol: '<strong>Darmowa checklista.</strong> Jak przygotować się do trudnej rozmowy i wzór notatki z ustaleniami, która zamienia rozmowę w coś, do czego można wrócić. Dostaniesz ją mailem, za darmo.'
    },
    konsultacje: true,
    gotowa: true, // zaakceptowane przez Michała 11.10, 00:23
  },
];

/** Strony realnie budowane — tylko te z kompletną treścią. */
export const stronyGotowe = stronyOdcinkow.filter((s) => s.gotowa);
