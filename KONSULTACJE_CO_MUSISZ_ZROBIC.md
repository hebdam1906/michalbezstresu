# Konsultacje — co jest gotowe, a co musisz kliknąć sam

BRIEF-11 Klaudiusza z 6.08. Kod gotowy tego samego wieczora, **nie wdrożony na produkcję**
— czeka na dwie rzeczy po Twojej stronie (niżej, ~5 minut).

## Co powstało

| plik | co robi |
|---|---|
| `src/pages/konsultacje.astro` | cała podstrona: oferta, proces, cennik, formularz |
| `src/pages/api/konsultacje.ts` | odbiór formularza → zapis w Supabase → autoodpowiedź z MailerLite |
| `src/components/PoCoToRobie.astro` | sekcja „Po co to robię" na stronie głównej |
| `SUPABASE_KONSULTACJE.sql` | tabela na zapytania (idempotentny, można odpalać wielokrotnie) |
| `src/components/Nav.astro` | „Konsultacje" w menu |
| `src/pages/prywatnosc.astro` | nowy cel przetwarzania: obsługa zapytań konsultacyjnych |

## ⚠️ Ceny bez przekreśleń — Twoja decyzja z 6.08, wbrew pierwotnemu pomysłowi

Klaudiusz chciał `~299 zł~ → 199 zł` z plakietką „−33%". Dyrektywa Omnibus każe przy
obniżce pokazać **najniższą cenę z ostatnich 30 dni**, a 299 zł zaczyna obowiązywać
dopiero teraz — nikt jej jeszcze nie zapłacił. Przekreślenie ceny, która nigdy nie
obowiązywała, to dokładnie ten wzór, który ściga UOKiK.

Strona mówi więc to samo słowami: 299 zł jako cena, 254 zł „z kodem dla subskrybentów",
199 zł „cena startowa, pierwsze 5 osób, bo dopiero otwieram ten format".

Kod na przekreślenia jest już napisany i czeka. Po 30 dniach obowiązywania 299 zł
wystarczy w `konsultacje.astro` zmienić jedną linię:

```
const PRZEKRESLENIA = false;   →   const PRZEKRESLENIA = true;
```

Temat „prezentacja cen a Omnibus" dopisany do listy na przegląd prawny, obok polityki
prywatności.

---

## Co musisz zrobić — dwie rzeczy

### 1. Odpalić SQL w Supabase (~2 min)

Supabase → projekt `michal-bez-stresu` → **SQL Editor** → wklej całe
`SUPABASE_KONSULTACJE.sql` → **Run**. Tworzy tabelę `konsultacje_zapytania`
z włączonym RLS i bez żadnej polityki dla anonimowych — czyli do zapytań
wchodzi wyłącznie serwer, nikt z przeglądarki ich nie odczyta.

### 2. Grupa w MailerLite + autoodpowiedź (~3 min)

MailerLite → **Subscribers → Groups → Create group**, nazwa: `Konsultacje — zapytania`.
Skopiuj **ID grupy** (jest w adresie, długi ciąg cyfr) i wpisz w Vercelu:

```
MAILERLITE_GRUPA_KONSULTACJE = <id grupy>
```

Potem **Automations → Create → When subscriber joins a group** → wybierz tę grupę →
e-mail z treścią w rodzaju: *„Dostałem Twoją wiadomość. Odpisuję w ciągu 48 godzin —
także wtedy, gdy uznam, że nie jestem właściwą osobą do Twojej sprawy."*

Bez tego kroku formularz **działa normalnie** — zapytanie zapisze się w bazie,
po prostu nikt nie dostanie automatycznego potwierdzenia.

### Skąd odbierzesz zapytania

Na razie: Supabase → **Table Editor → `konsultacje_zapytania`**, sortowanie po
`utworzono` malejąco. Widok w `/panel` dorobię przy najbliższej okazji — powiedz,
czy ma być priorytetem, bo w kolejce jest jeszcze checklist nagraniowy i pakiety
przed schedulerem 14.08.

⚠️ **Skrzynka Zoho na darmowym planie nie ma SMTP**, więc strona nie wyśle Ci maila
o nowym zapytaniu. Do wyboru: sprawdzać Supabase/MailerLite, albo dołożyć Mail Lite
(~0,90 €/mies.) i wtedy dorobię powiadomienie mailem.

---

## Czego jeszcze NIE zrobiłem z briefu

Termin tych rzeczy to 14.08 (scheduler), więc zostawiam na kolejne dni:

- **Zdanie o konsultacjach w opisach YT i przypiętych komentarzach #4–#6** (sekcja D briefu),
  z wersją stonowaną dla #6 o wypaleniu.
- **Linijka w stopce newslettera** od maila #4 (sekcja C).
- **Kod rabatowy −15%** w mailu powitalnym i stopce (sekcja G) — wymaga najpierw
  ustalenia samego kodu. Zaproponuję brzmienie, jak powiesz słowo.

## Zabezpieczenia formularza — sprawdzone, nie założone

Endpoint `/api/konsultacje` to jedyne publiczne API w projekcie, więc ma trzy blokady,
każdą przetestowaną:

| próba | wynik |
|---|---|
| bot wypełnia ukryte pole-pułapkę | udaje sukces, nic nie zapisuje |
| puste imię / zły e-mail / opis krótszy niż 20 znaków | odrzucone z ludzkim komunikatem |
| brak zgody RODO | odrzucone |
| opis dłuższy niż 4000 znaków | odrzucone |
| więcej niż 3 zapytania z jednego adresu na godzinę | odrzucone |

Adresu IP nie zapisujemy — w bazie ląduje jego skrót, wystarczający do wyłapania
zalewu z jednego źródła i bezużyteczny do czegokolwiek innego.
