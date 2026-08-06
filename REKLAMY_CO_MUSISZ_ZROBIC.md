# Fundament pod reklamy — co jest gotowe, a co musisz kliknąć sam

Zadanie Klaudiusza ze Slacka z 5.08 (termin śr 13.08). Stan na czw 6.08.

## Co już zrobiłem — gałąź `feature/zgody-i-piksele`, NIE wdrożone na produkcję

| plik | co robi |
|---|---|
| `src/components/Zgody.astro` | baner zgody na ciasteczka; wybór pamiętany, da się cofnąć |
| `src/components/Trackery.astro` | piksel Meta i tag Google — startują **dopiero po zgodzie** |
| `src/pages/dziekuje.astro` | strona po zapisie + zdarzenie konwersji |
| `src/pages/prywatnosc.astro` | **szkic** polityki prywatności + przycisk „zmień decyzję” |
| `src/components/Stopka.astro` | link do polityki w stopce |

Sprawdzone w przeglądarce, nie „na oko”:

1. Przed zgodą — **zero** zapytań do Meta i Google, `fbq` w ogóle nie istnieje.
2. Po „Tylko niezbędne” — nadal zero, i wybór jest pamiętany po przejściu na inną stronę.
3. Po „Zgadzam się” — oba skrypty się ładują.
4. Na `/dziekuje` — leci zdarzenie `Lead`.

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

## 2. Google Ads (~15 min)

1. ads.google.com → utwórz konto. Przy pierwszym ekranie wybierz **„Przełącz na tryb
   eksperta”** — inaczej Google wciśnie Ci kampanię inteligentną i budżet od razu.
2. Waluta **PLN**, strefa **Europe/Warsaw** — też nie do zmiany później.
3. **Narzędzia → Połączone konta → YouTube** → połącz kanał *Michał bez Stresu*.
   Google wyśle prośbę o zgodę do właściciela kanału (czyli do Ciebie w YouTube Studio)
   — trzeba ją zatwierdzić po drugiej stronie.
4. **Cele → Konwersje → Nowa akcja konwersji → Witryna.** Adres:
   `https://michalbezstresu.pl/dziekuje`. Nazwa: `Zapis na checklistę`.
   Sposób oznaczania: **tag Google**.
5. Skopiuj identyfikator tagu (`AW-` i cyfry) — to jest `PUBLIC_GOOGLE_TAG_ID`.

## 3. MailerLite — przekierowanie po zapisie (~2 min)

To jest ta rzecz, której brakowało w planie: **strony podziękowania nie było**.
Formularz `by0euU` pokazywał komunikat w miejscu, więc konwersji nie było jak zmierzyć.

MailerLite → **Forms → formularz `by0euU` → Settings → After signup →
Redirect to URL** → `https://michalbezstresu.pl/dziekuje` → zapisz.

## 4. Wklejenie ID do Vercela (~2 min, mogę zrobić ja)

Vercel → projekt strony → **Settings → Environment Variables**, dla Production:

```
PUBLIC_META_PIXEL_ID   = <16 cyfr z kroku 1>
PUBLIC_GOOGLE_TAG_ID   = AW-<cyfry z kroku 2>
```

Potem redeploy. Powiedz słowo, to zrobię wdrożenie gałęzi i redeploy.

## ✅ Test etapu 2 — wykonany 6.08 na deployu podglądowym

`PUBLIC_META_PIXEL_ID = 1521198102602559` wpisany w Vercelu, redeploy bez cache'u.
Zmierzone na kodzie pobranym z serwera podglądowego:

| co | wynik |
|---|---|
| przed zgodą | **0** zapytań do Meta, `fbq` nie istnieje, baner widoczny |
| po „Tylko niezbędne" | **0** zapytań, wybór pamiętany po przejściu na inną stronę |
| po „Zgadzam się" | ładuje się `fbevents.js`, leci `PageView` |
| `/dziekuje` | leci `Lead`, `meta robots = noindex, nofollow` |
| tag Google | nie ładuje się — `PUBLIC_GOOGLE_TAG_ID` puste, zgodnie z planem |

⚠️ Ten test wysłał do Twojego piksela prawdziwe `PageView` i `Lead`. W Events Managerze
zobaczysz dwa zdarzenia z 6.08, których nie zrobił żaden widz — to moje.

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
