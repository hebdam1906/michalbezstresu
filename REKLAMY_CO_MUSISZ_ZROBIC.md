# Fundament pod reklamy — co jest gotowe, a co musisz kliknąć sam

Zadanie Klaudiusza ze Slacka z 5.08 (termin śr 13.08). Stan na czw 6.08 wieczorem.

## ✅ NA PRODUKCJI OD 6.08 — cały fundament, 7 dni przed terminem

Baner zgody, polityka prywatności, strona `/dziekuje`, piksel Mety, tag Google
i przekierowanie z formularza MailerLite. Zmierzone na produkcji, nie „na oko" —
wyniki niżej.

Zostały **dwie rzeczy nietechniczne**, obie po Twojej stronie:

1. **Godzina z kimś od RODO.** Polityka jest na produkcji w wersji, którą napisałem
   ja — nie prawnik. Na stronie stoi ramka „dokument w wersji roboczej, czeka na
   sprawdzenie", więc nikogo nie wprowadzamy w błąd, ale to nie jest stan docelowy.
2. **Forma prawna, adres i NIP** do sekcji o administratorze. Na razie jest tam imię,
   nazwisko i adres kontaktowy — minimum z art. 13 RODO — plus zdanie, że pełne dane
   rejestrowe podajesz na prośbę.

## Co powstało — gałąź `feature/zgody-i-piksele`, scalona do `main` 6.08

| plik | co robi |
|---|---|
| `src/components/Zgody.astro` | baner zgody na ciasteczka; wybór pamiętany, da się cofnąć |
| `src/components/Trackery.astro` | piksel Meta i tag Google — startują **dopiero po zgodzie** |
| `src/pages/dziekuje.astro` | strona po zapisie + zdarzenie konwersji |
| `src/pages/prywatnosc.astro` | **szkic** polityki prywatności + przycisk „zmień decyzję” |
| `src/components/Stopka.astro` | link do polityki w stopce |

Sprawdzone w przeglądarce z podpiętym podsłuchem ruchu sieciowego, nie „na oko” —
pełne wyniki w sekcji „Test końcowy” niżej.

**Zawór bezpieczeństwa, gdyby trzeba było szybko wyłączyć śledzenie:** `Trackery.astro`
przy pustych ID **nie renderuje nic**. Skasowanie obu zmiennych w Vercelu i redeploy
zdejmuje piksele ze strony w kilka minut, bez ruszania kodu. Baner, polityka i strona
podziękowania zostają.

---

## Czego NIE zrobię za Ciebie

**Zakładania kont i akceptowania regulaminów.** To Twoje podpisy pod czyimiś warunkami —
nie klikam tego w Twoim imieniu, nawet jeśli mnie o to poprosisz. Poniżej instrukcja,
żeby poszło szybko.

---

## 1. Meta — konto reklamowe (~10 min)

✅ **ZROBIONE 6.08** — konto reklamowe istnieje, ID `1035786742657518`
(w portfolio „Michał bez Stresu”, `2212556386159889`). Zostaje sam piksel.

⚠️ **UWAGA NA POMYŁKĘ, ŁATWĄ I KOSZTOWNĄ W DEBUGOWANIU.** W Mecie krążą dwa różne
numery po 15–16 cyfr i wyglądają identycznie:

| numer | co to jest | gdzie się używa |
|---|---|---|
| `1035786742657518` | **konto reklamowe** | rozliczenia, kampanie, budżet |
| `1521198102602559` | **zestaw danych „MBS - strona”** | `PUBLIC_META_PIXEL_ID` na stronie |

✅ Oba istnieją (6.08). Trzeci numer, który krąży w tym samym panelu i też wygląda
podobnie: `2073445213253164` — to zestaw „MBS panel statystyki”, czyli nasza aplikacja
do odczytu statystyk FB/IG z 29.07. **Nie jest pikselem strony**, nie ruszamy go.

Do zmiennej `PUBLIC_META_PIXEL_ID` idzie **ten drugi**. Wpisanie tam numeru konta
reklamowego nie wywali błędu — piksel po prostu nigdy nic nie zaraportuje, a szukanie
przyczyny zajmie wieczór.

Portfolio firmowe **już masz** (robiliśmy je 29.07 pod statystyki).

1. business.facebook.com → wybierz portfolio **Michał bez Stresu** (sprawdź w lewym górnym
   rogu — łatwo wylądować w prywatnym).
2. **Ustawienia → Konta → Konta reklamowe → Dodaj → Utwórz nowe konto reklamowe.**
   Nazwa: `MBS — reklamy`. Strefa czasowa: **Europe/Warsaw**. Waluta: **PLN**.
   ⚠️ Strefy i waluty **nie da się później zmienić**.
3. Przypisz do konta stronę **Michał bez Stresu** (`1114479045088450`) i siebie jako
   administratora.
4. **Ustawienia → Źródła danych → Zestawy danych (dawniej Piksele) → Dodaj.**
   Nazwa: `MBS — strona`. Sposób instalacji wybierz **„Ręcznie / kod”** — kod jest już
   w repo, nie wklejaj niczego przez kreator.
5. Skopiuj **ID zestawu danych** (16 cyfr) — to jest `PUBLIC_META_PIXEL_ID`.

Metodę płatności dodaj dopiero przed startem kampanii (1.09). Do testu piksela nie jest
potrzebna.

## 2. Google Ads

✅ **ZROBIONE 6.08.** Konto założone, kanał YouTube *Michał bez Stresu* połączony,
akcja konwersji **„Checklista - zapis na liste”** utworzona, identyfikator tagu
`AW-18374464641`, etykieta akcji `CUDbCLnijt0cEIGp0LlE`.

Dwie rzeczy, w których się pomyliłem po drodze — zapisuję, żeby nie wrócić do nich za pół roku:

- **„Przełącz na tryb eksperta” już nie istnieje** na pierwszym ekranie zakładania konta.
  Zamiast tego na dole ekranu z celem kampanii jest **„Set up an account only”** — i to
  jest ta ścieżka, która pomija tworzenie kampanii i budżetu.
- **Promocji 1200 za 1200 nie da się nie wybrać** — lista rozwijana nie ma opcji „żadna”.
  Niewykorzystana nic nie kosztuje: żeby dostać kredyt, trzeba najpierw samemu wydać 1200 zł
  w 60 dni od pierwszego kliknięcia. Arytmetykę tego, czy nam się to opłaca przy budżecie
  1000 zł/mc, przeliczę na przeglądzie 26.08.

**Nazwa akcji bez polskich znaków, celowo.** Przy wpisywaniu „Zapis na checklistę”
formularz gubił ogonek w ostatnim słowie. Zamiast walczyć z polem, nazwałem akcję
`Checklista - zapis na liste`. Nazwa jest tylko etykietą w panelu — na pomiar nie wpływa.

## 3. MailerLite — przekierowanie po zapisie

✅ **ZROBIONE 6.08.** Formularz „Checklista — lead magne" → Success message →
Settings → **Custom success page** → `https://michalbezstresu.pl/dziekuje`.

To była ta rzecz, której brakowało w planie: **strony podziękowania nie było**.
Formularz pokazywał komunikat w miejscu, więc konwersji nie było jak zmierzyć.

### ⚠️ I to, co wyszło dopiero przy klikaniu: formularz ma PODWÓJNE POTWIERDZENIE

Kolejność jest taka: wysłanie formularza → `/dziekuje` → mail „Potwierdź zapis
i odbierz checklistę" → **dopiero po kliknięciu w niego** idzie checklista.

**Konsekwencja dla treści.** Strona `/dziekuje` mówiła „Checklista jest w drodze".
To była nieprawda i człowiek czekałby na plik, którego nikt nie wysyła. Poprawione
na „Został jeden klik", z wyraźnym zdaniem, że bez potwierdzenia nic nie przyjdzie.

**Konsekwencja dla pomiaru.** Konwersja liczy **wysłanie formularza, nie potwierdzony
zapis** — czyli jest zawyżona o tych, którzy nie potwierdzili. Sprawdziłem, czy da się
ją przenieść na moment potwierdzenia: **nie da się.** Strona po potwierdzeniu to szablon
hostowany u MailerLite, bez opcji przekierowania na własny adres. Innego momentu po
prostu nie ma. Zanim zaczniesz optymalizować kampanie po tej liczbie, zestaw ją
z realną liczbą potwierdzonych zapisów z MailerLite — proponuję zrobić to na
przeglądzie 26.08.

### Trzy drobiazgi z MailerLite, których nie ruszałem

- Strona potwierdzenia jest **po angielsku i bez marki** („Thank you! You've signed up
  for the newsletter!") — jedyna taka rzecz w całym lejku.
- W ustawieniach formularza wyłączony jest **link do polityki prywatności** i **pola
  zgód marketingowych (RODO)**. Skoro polityka już istnieje, warto włączyć pierwsze.
- W stopce maili masz już podany adres. Jeśli to ten sam, którego chcesz użyć
  w polityce — powiedz słowo, uzupełnię sekcję o administratorze.

## 4. Wklejenie ID do Vercela

✅ **ZROBIONE 6.08.** W Environment Variables są:

```
PUBLIC_META_PIXEL_ID   = 1521198102602559
PUBLIC_GOOGLE_TAG_ID   = AW-18374464641
```

⚠️ Przy każdej zmianie tych zmiennych trzeba zrobić redeploy **z odznaczonym**
„Use existing Build Cache”. Astro wkleja `PUBLIC_*` do plików w momencie budowania —
z cache'u dostaniesz stare pliki i będziesz szukał błędu tam, gdzie go nie ma.

## ✅ Test końcowy — wykonany 6.08 na PRODUKCJI, obie firmy naraz

W Vercelu wpisane `PUBLIC_META_PIXEL_ID = 1521198102602559` i
`PUBLIC_GOOGLE_TAG_ID = AW-18374464641`, zakres **Production and Preview**
(zmienne `PUBLIC_*` w Astro wchodzą do kodu **w momencie budowania**, więc po każdej
ich zmianie redeploy z odznaczonym cache'em — inaczej testujesz stary stan).

Najpierw sam kod pobrany z produkcji — czy oba ID w ogóle są w wyniku budowania:

| strona | piksel Meta | tag Google | etykieta konwersji | baner |
|---|---|---|---|---|
| `/checklista` | ✅ | ✅ | — | ✅ |
| `/dziekuje` | ✅ | ✅ | ✅ | ✅ |
| `/prywatnosc` | ✅ | ✅ | — | ✅ |

Potem zachowanie w prawdziwej przeglądarce, na tych samych bajtach:

| moment | Meta | Google | uwagi |
|---|---|---|---|
| przed zgodą | **0** zapytań | **0** zapytań | `fbq` i `gtag` w ogóle nie istnieją |
| po „Tylko niezbędne” | **0** | **0** | baner nie wraca po przejściu na inną stronę |
| po „Zgadzam się” | `fbevents.js` ✅ | `gtag/js` ✅ | startują dopiero teraz, obie naraz |
| `/dziekuje` | `Lead` ✅ | konwersja ✅ | z etykietą `CUDbCLnijt0cEIGp0LlE`, `noindex, nofollow` |

**Czego ten test NIE dowodzi, żeby było uczciwie.** Przeglądarka w moim środowisku nie ma
dostępu do serwerów Mety i Google, więc samego wystrzelonego zdarzenia nie zobaczyłem —
sprawdziłem kolejkę, którą strona przekazuje bibliotekom, i tam jest dokładnie to, co ma
być: `init 1521198102602559` · `PageView` · `Lead` dla Mety oraz `config AW-18374464641`
i konwersja z etykietą `CUDbCLnijt0cEIGp0LlE` dla Google. Kod robi swoje. Ostateczny
dowód daje dopiero prawdziwy zapis wykonany z Twojej przeglądarki — patrz krok 5.

⚠️ **Wcześniejszy test na deployu podglądowym wysłał prawdziwe zdarzenia.** W Events
Managerze Mety zobaczysz `PageView` i `Lead` z 6.08, a w Google Ads jedną konwersję
„Checklista - zapis na liste” — żadnego z nich nie zrobił widz, to moje. U Google
potrafi się pokazać z opóźnieniem do kilku godzin.

## 5. Ostatnie ogniwo — jeden prawdziwy zapis Twoją przeglądarką (~5 min)

To jedyna rzecz, której nie sprawdzę z mojego miejsca, bo wymaga prawdziwej skrzynki
i prawdziwego kliknięcia. Warto ją zrobić raz, teraz, a nie w dniu startu kampanii.

1. `/checklista` w trybie incognito → w Meta Events Manager **nie powinno być nic**,
   dopóki nie klikniesz „Zgadzam się”.
2. Zgoda → odświeżenie → **PageView** w Events Manager, „Tag wykryty” w Google.
3. Zapis na swój adres → przekierowanie na `/dziekuje` → **Lead** w Mecie i konwersja
   „Checklista - zapis na liste” w Google Ads. U Google potrafi wejść z opóźnieniem
   do kilku godzin — to normalne, nie panikuj w dniu testu.
4. Sprawdź jeszcze mail: ma przyjść **„Potwierdź zapis i odbierz checklistę”**,
   a checklista dopiero po kliknięciu w niego. Jeśli przyjdzie od razu — znaczy, że
   podwójne potwierdzenie ktoś wyłączył i treść `/dziekuje` przestała pasować.

---

## Do Twojej decyzji — co zostało

**Polityka prywatności jest na produkcji w wersji, której nie pisał prawnik.**
Usunąłem z niej wszystkie widoczne dla czytelnika `[DO UZUPEŁNIENIA]` i uzupełniłem
to, co dało się ustalić rzetelnie: podstawę przekazywania danych do USA (udział Mety
i Google w EU-U.S. Data Privacy Framework, plus standardowe klauzule umowne) i okresy
przechowywania (danych z pikseli nie trzymamy u siebie w ogóle — odsyłamy do polityk
obu firm). Została **forma prawna, adres i NIP**; do czasu ich podania w sekcji
o administratorze jest imię, nazwisko i adres kontaktowy, czyli minimum z art. 13 RODO.

Ramka „dokument w wersji roboczej, czeka na sprawdzenie" zostaje na stronie do momentu,
aż przejrzy ją ktoś znający RODO. Przy tym kanale zaufanie jest produktem — lepiej
napisać wprost, że dokument czeka na sprawdzenie, niż udawać, że jest gotowy.

**Kolejność wdrożenia** rozstrzygnięta 6.08: Michał wybrał wdrożenie całości razem
z pikselami, świadomie i po wysłuchaniu argumentu za rozbiciem na dwa kroki. Zapisuję,
bo za trzy miesiące nikt nie będzie pamiętał, że to była decyzja, a nie przypadek.

Kampanie i tak nie ruszają przed 1.09, a termin Klaudiusza (13.08) zamknięty siedem
dni wcześniej.
