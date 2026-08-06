# Fundament pod reklamy — co jest gotowe, a co musisz kliknąć sam

Zadanie Klaudiusza ze Slacka z 5.08 (termin śr 13.08). Stan na czw 6.08 wieczorem.

**Strona techniczna jest skończona i zmierzona — 7 dni przed terminem.** To, co jeszcze
blokuje wdrożenie na produkcję, nie jest już kodem: polityka prywatności ma pola
`[DO UZUPEŁNIENIA]` z Twoimi danymi firmowymi, powinna ją przejrzeć osoba znająca RODO,
a w MailerLite trzeba ustawić przekierowanie na `/dziekuje` (krok 3 niżej) — bez tego
konwersja nie ma się kiedy odpalić u prawdziwego zapisującego się.

## Co już zrobiłem — gałąź `feature/zgody-i-piksele`, NIE wdrożone na produkcję

| plik | co robi |
|---|---|
| `src/components/Zgody.astro` | baner zgody na ciasteczka; wybór pamiętany, da się cofnąć |
| `src/components/Trackery.astro` | piksel Meta i tag Google — startują **dopiero po zgodzie** |
| `src/pages/dziekuje.astro` | strona po zapisie + zdarzenie konwersji |
| `src/pages/prywatnosc.astro` | **szkic** polityki prywatności + przycisk „zmień decyzję” |
| `src/components/Stopka.astro` | link do polityki w stopce |

Sprawdzone w przeglądarce z podpiętym podsłuchem ruchu sieciowego, nie „na oko” —
pełne wyniki w sekcji „Test końcowy” niżej.

**Kluczowa rzecz:** dopóki w Vercelu nie ma wpisanych ID, `Trackery.astro` nie renderuje
nic. Czyli tę gałąź można wdrożyć **zanim** założysz konta reklamowe — wjedzie sam baner,
polityka i strona podziękowania, bez żadnego śledzenia. Piksele ruszą dopiero wtedy, gdy
wpiszesz ID i zrobisz redeploy. Kodu nie trzeba wtedy ruszać.

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

## 3. MailerLite — przekierowanie po zapisie (~2 min)

To jest ta rzecz, której brakowało w planie: **strony podziękowania nie było**.
Formularz `by0euU` pokazywał komunikat w miejscu, więc konwersji nie było jak zmierzyć.

MailerLite → **Forms → formularz `by0euU` → Settings → After signup →
Redirect to URL** → `https://michalbezstresu.pl/dziekuje` → zapisz.

## 4. Wklejenie ID do Vercela

✅ **ZROBIONE 6.08.** W Environment Variables są:

```
PUBLIC_META_PIXEL_ID   = 1521198102602559
PUBLIC_GOOGLE_TAG_ID   = AW-18374464641
```

⚠️ Przy każdej zmianie tych zmiennych trzeba zrobić redeploy **z odznaczonym**
„Use existing Build Cache”. Astro wkleja `PUBLIC_*` do plików w momencie budowania —
z cache'u dostaniesz stare pliki i będziesz szukał błędu tam, gdzie go nie ma.

## ✅ Test końcowy — wykonany 6.08 na deployu podglądowym, obie firmy naraz

W Vercelu wpisane `PUBLIC_META_PIXEL_ID = 1521198102602559` i
`PUBLIC_GOOGLE_TAG_ID = AW-18374464641`, redeploy z wyłączonym cache'em budowania
(zmienne `PUBLIC_*` w Astro wchodzą do kodu **w momencie budowania**, więc redeploy
z cache'u pokazałby stary stan i test byłby bez wartości).

Najpierw sprawdziłem sam kod pobrany z serwera — czy oba ID w ogóle są w wyniku budowania:

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

⚠️ **Ten test wysłał prawdziwe zdarzenia.** W Events Managerze Mety zobaczysz `PageView`
i `Lead` z 6.08, a w Google Ads jedną konwersję „Checklista - zapis na liste” — żadnego
z nich nie zrobił widz, to moje. U Google potrafi się pokazać z opóźnieniem do kilku
godzin, więc brak konwersji w panelu w dniu testu nie znaczy, że coś nie działa.

## 5. Test przy starcie kampanii (~5 min)

1. Wejście na `/checklista` w trybie incognito → w Meta Events Manager **nie powinno być
   nic**, dopóki nie kliknę „Zgadzam się”.
2. Zgoda → odświeżenie → **PageView** w Events Manager i „Tag wykryty” w Google.
3. Testowy zapis na moją skrzynkę → przekierowanie na `/dziekuje` → **Lead** w Meta
   i konwersja `Zapis na checklistę` w Google Ads (u Google potrafi wejść z opóźnieniem
   do kilku godzin — to normalne, nie panikuj w dniu testu).

---

## Do Twojej decyzji — dwie rzeczy, których nie rozstrzygnę sam

**Polityka prywatności to szkic.** Napisałem go, żeby strona nie ruszyła z pikselami bez
żadnej polityki, ale nie jestem prawnikiem. W tekście są miejsca `[DO UZUPEŁNIENIA]`,
których nie znam: forma prawna, adres, NIP, podstawa przekazywania danych do USA,
okresy przechowywania po stronie Meta i Google. Zanim to pójdzie na produkcję, ktoś
znający RODO powinien to przejrzeć — zwłaszcza że przy tym kanale zaufanie jest produktem.

**Kolejność wdrożenia.** Proponuję rozbić na dwa kroki:

1. **Teraz:** wdrażamy baner, politykę i `/dziekuje` — bez ID, czyli bez śledzenia.
   Strona zyskuje politykę prywatności, której dziś w ogóle nie ma, i realną stronę
   podziękowania. Zero ryzyka.
2. **Po Twoich kontach i po sprawdzeniu polityki:** wpisujemy ID, redeploy, test.
   Kampanie i tak nie ruszają przed 1.09.

Tak czy inaczej zdążymy przed 13.08 — sam kod jest gotowy dziś.
