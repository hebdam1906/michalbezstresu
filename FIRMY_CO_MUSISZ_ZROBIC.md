# Strona /dla-firm — co jest zrobione i co musi zrobić Michał

Marcin, 3.09.2026. Tekst: Klaudiusz (`Strona-dla-firm_tekst.md`),
autoodpowiedź: Klaudiusz (`Klaudiusz-do-Marcina_odpowiedz-na-update-32.md`).

## Zrobione w kodzie

| co | gdzie |
|---|---|
| strona z ofertą i formularzem | `src/pages/dla-firm.astro` |
| odbiór zapytania | `src/pages/api/firmy.ts` |
| strona podziękowania (bez piksela Lead) | `src/pages/dziekuje-firmy.astro` |
| skąd przyszedł ruch | `src/components/Atrybucja.astro` (wpięte w `Layout.astro`) |
| widok w panelu + zmiana statusu | `src/pages/api/panel/firmy.ts` + sekcja „Zapytania firmowe" w `panel.astro` |
| tabela w bazie | Supabase · `firmy_zapytania` |
| wykluczenie z Google | `astro.config.mjs` (filtr sitemapy) + `public/robots.txt` |

## ⚠️ ZOSTAŁY DWIE RZECZY PO TWOJEJ STRONIE

### 1. Zmienna `MAILERLITE_GRUPA_FIRMY` w Vercelu

Bez niej **strona działa, zapytanie się zapisuje, ale autoodpowiedź nie wychodzi**.
Nic się nie wysypie — kod sprawdza, czy zmienna istnieje.

Vercel → Project → Settings → Environment Variables → dodaj:

```
MAILERLITE_GRUPA_FIRMY = 197576568969627526
```

potem redeploy.

### 1b. Włączyć automatyzację w MailerLite

Grupa i automatyzacja są już założone (Marcin, 3.09), z treścią od Klaudiusza:

| co | wartość |
|---|---|
| grupa | „Firmy - zapytania", id **197576568969627526** |
| automatyzacja | „Firmy - potwierdzenie zapytania", id **197576639458051684** |
| stan | **Inactive** — świadomie, czeka na Twoje „włączamy" |
| wyzwalacz | subskrybent dołącza do grupy „Firmy - zapytania" |
| temat | Dziękuję za wiadomość — odpowiedź w ciągu dnia roboczego |
| nadawca | **Michał Hebda** (nie „Michał bez Stresu" — uwaga Klaudiusza: po drugiej stronie jest ktoś z HR, kto sprawdza, z kim ma do czynienia) |
| adres | michal@michalbezstresu.pl |
| język stopki | polski |
| kolor linków | #2E6B5D — domyślny żółty był nieczytelny na jasnym tle, MailerLite sam to zgłosił |

Włączenie: Automations → „Firmy - potwierdzenie zapytania" → **Activate**.
Warto najpierw wysłać sobie test („Send a test email" w kroku Email 1).

### 2. Osobna akcja konwersji w Google Ads (opcjonalnie)

Strona `/dziekuje-firmy` odpala dziś:
- **Meta:** zdarzenie `Contact` — liczy się od razu, osobno od `Lead` z checklisty,
- **Google:** zdarzenie `zapytanie_firmowe` w GA4 — liczy się, **ale nie jest konwersją w Ads**.

Żeby było konwersją: załóż w Google Ads osobną akcję konwersji, podaj mi etykietę,
dopiszę `send_to` — dokładnie tak, jak jest w `dziekuje.astro` dla checklisty.

## Zasady, których nie zmieniamy

1. **Pułapka na boty w tym formularzu nazywa się `www`, NIE `firma`.**
   W `/api/konsultacje` pułapką jest `firma` — tam to działa, bo tamten formularz
   nie ma pola „Firma". Tutaj „Firma" jest polem **wymaganym**. Gdyby ktoś ujednolicił
   te dwa endpointy „dla porządku", skasowałby 100% zapytań firmowych: bez błędu,
   bez wpisu w logu, z komunikatem „wysłano" dla nadawcy.
2. **Formularz przekierowuje na `/dziekuje-firmy`, nigdy na `/dziekuje`.**
   Na `/dziekuje` siedzi `fbq('track','Lead')` i konwersja Ads przypisana do checklisty.
3. **Bez cen na stronie.** Wycena po rozmowie — decyzja Klaudiusza z 3.09.
4. **Bez CTA do checklisty.** Inny odbiorca, inny cel.
5. **Grupa „Firmy — zapytania" w MailerLite jest transakcyjna.** Nie newsletter,
   nie sekwencja. Zgoda z formularza dotyczy kontaktu w sprawie tego zapytania,
   a nie marketingu. Mailing B2B wymagałby osobnej zgody i osobnego pola.
6. **Lista wartości w „Skąd o mnie wiesz?" musi być identyczna** jak na formularzu
   konsultacji — Checkpoint 31.10 liczy oba formularze razem.

## Co mierzymy

Przy każdym zapytaniu zapisujemy dwie rzeczy naraz:
- **deklarację** — „skąd o mnie wiesz?" (co człowiek pamięta),
- **fakty** — `utm_*`, `gclid`, `fbclid`, witrynę odsyłającą i stronę wejścia
  (gdzie realnie kliknął).

Dane siedzą w `sessionStorage`, nie w ciasteczku — giną razem z zakładką, więc nie
powstaje identyfikator śledzący między wizytami. Lecą na serwer wyłącznie razem
z formularzem, który ktoś świadomie wysyła. Dlatego nie zależą od zgody na piksele.

Panel pokazuje zliczone źródła nad tabelą — bez wchodzenia do bazy.

## Do rozważenia później (pomysł Klaudiusza, 3.09)

Cotygodniowy test formularza: skrypt wysyła zapytanie testowe i sprawdza, czy wiersz
pojawił się w bazie; jeśli nie — powiadomienie. Ten typ błędu (jak pułapka `firma`)
wychodzi na jaw dopiero po tygodniach ciszy. Nie zrobione, świadomie — kandydat na
drugi czujnik po tym z `odcinki.js`.
