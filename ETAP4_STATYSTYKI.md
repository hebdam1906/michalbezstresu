# 📊 Etap 4 — statystyki w panelu (uruchomienie)

Zakładka **Statystyki** w `/panel` + strona `/dashboard` czytają dane z Supabase.
Zasila je codzienny cron `/api/panel/sync`, który sam pyta API platform.

Do czasu wklejenia kluczy panel działa — po prostu wpisujesz liczby ręcznie
z telefonu. Każdy klucz, który dołożysz, wyłącza jedno ręczne wpisywanie.

---

## Krok 1. Supabase — tabele (2 min)

Supabase → projekt „michal-bez-stresu" → **SQL Editor** → wklej i uruchom
**`SUPABASE_STATYSTYKI.sql`**.

Tworzy: `panel_metryki`, `panel_materialy`, `panel_ruch`, `panel_sync_log`
oraz widok `panel_wzrost`. RLS włączone bez publicznych polityk — dane prywatne.
Skrypt jest idempotentny, można go odpalić drugi raz bez szkody.

---

## Krok 2. Zmienne środowiskowe w Vercel

Vercel → projekt MBS → **Settings → Environment Variables**.
Żadna z nich **nie ma** prefiksu `PUBLIC_` — nie trafiają do przeglądarki.

| Zmienna | Do czego | Bez niej |
|---|---|---|
| `MAILERLITE_API_KEY` | subskrybenci + lista zapisów | wpisujesz liczbę ręcznie |
| `YOUTUBE_API_KEY` | subskrybenci YT + wyświetlenia filmów | wpisujesz ręcznie |
| `YOUTUBE_CHANNEL_ID` | który kanał odpytać | j.w. |
| `META_ACCESS_TOKEN` | Facebook + Instagram | wpisujesz ręcznie |
| `FB_PAGE_ID` | id strony na FB | j.w. |
| `IG_USER_ID` | id konta IG (biznesowego) | j.w. |
| `CRON_SECRET` | podpis dla codziennego crona | cron nie ruszy |

Po dodaniu zmiennych → **Redeploy** (Vercel nie podłącza ich do już zbudowanej wersji).

---

## Krok 3. Skąd wziąć każdy klucz

### MailerLite — najprostszy, zacznij od niego
1. MailerLite → awatar w prawym górnym rogu → **Integrations** → **API** → **Generate new token**.
2. Nazwij np. „panel MBS", skopiuj token (pokazuje się **raz**).
3. Wklej jako `MAILERLITE_API_KEY`.

Daje: liczbę aktywnych subskrybentów + listę ostatnich zapisów w panelu.

### YouTube Data API
1. [console.cloud.google.com](https://console.cloud.google.com) → utwórz projekt (np. „MBS statystyki").
2. **APIs & Services → Library** → wyszukaj **YouTube Data API v3** → **Enable**.
3. **APIs & Services → Credentials** → **Create credentials → API key** → skopiuj.
4. Wklej jako `YOUTUBE_API_KEY`.
5. `YOUTUBE_CHANNEL_ID`: YouTube Studio → **Ustawienia → Kanał → Zaawansowane** →
   „Identyfikator kanału" (zaczyna się od `UC…`).

Limit darmowy (10 000 jednostek/dzień) jest kilkaset razy większy niż nasze
jedno odpytanie dziennie — nie ma ryzyka przekroczenia.

> Uwaga: publiczne API podaje **łączne** wyświetlenia kanału, nie „ostatnie 28 dni".
> Panel liczy przyrost z różnicy między dniami — dlatego pierwszy sensowny
> wykres zobaczysz po ok. tygodniu zbierania.

### Meta (Facebook + Instagram)
Wymaga konta **biznesowego/twórcy** na IG połączonego ze stroną FB.

1. [developers.facebook.com](https://developers.facebook.com) → **My Apps** → **Create App**
   → typ **Business**.
2. Dodaj produkty **Facebook Login for Business** oraz **Instagram Graph API**.
3. **Tools → Graph API Explorer** → wybierz swoją aplikację → uprawnienia:
   `pages_read_engagement`, `pages_show_list`, `read_insights`,
   `instagram_basic`, `instagram_manage_insights` → **Generate Access Token**.
4. Token z Explorera żyje ~1 h. Zamień go na **długoterminowy** (60 dni):
   **Tools → Access Token Debugger** → wklej token → **Extend Access Token**.
   Następnie pobierz **Page Access Token** (ten dla strony nie wygasa,
   jeśli pochodzi od długoterminowego tokenu użytkownika).
5. Wklej jako `META_ACCESS_TOKEN`.
6. `FB_PAGE_ID`: strona FB → **Informacje** → identyfikator strony.
   `IG_USER_ID`: w Graph API Explorer zapytaj
   `me/accounts?fields=instagram_business_account`.

> To jedyny fragment z realnym klikaniem w konsolach — ok. 20 minut.
> Jeśli nie chcesz tego teraz, zostaw puste: panel zapisze FB/IG jako
> „pominięto" i po prostu wpiszesz liczby ręcznie.

### TikTok — uczciwie: nie da się
TikTok nie udostępnia statystyk własnego konta bez zatwierdzonej aplikacji
w TikTok for Developers (proces akceptacji, wymaga opisu produktu i zwykle
firmy). Nie warto tego przechodzić dla jednego kanału.

**Rozwiązanie:** TikTok wpisujesz ręcznie w panelu (pole „Obserwujący" +
„Wyświetlenia"), raz w tygodniu — 15 sekund. Alternatywnie mogę raz dziennie
wejść na Twoje konto przez Chrome, spisać liczby i wrzucić je przez API panelu.

### CRON_SECRET
```
openssl rand -hex 32
```
Wynik wklej jako `CRON_SECRET`. Vercel automatycznie dołącza go do nagłówka
`Authorization` przy uruchamianiu crona z `vercel.json`.

---

## Krok 4. Cron

`vercel.json` w repo ustawia uruchomienie **codziennie o 5:00 UTC** (7:00 latem
w Polsce) — ten sam rytm co Stats Pipeline w Z Trybun.

Po deployu sprawdzisz go w: Vercel → projekt → **Settings → Cron Jobs**.

> Plan Hobby na Vercelu pozwala na cron **raz dziennie**. Gdyby trzeba było
> częściej — albo Pro, albo GitHub Actions uderzające w ten sam endpoint.

---

## Krok 5. Sprawdzenie, że działa

1. Wejdź na `/panel` → sekcja **Statystyki kanałów** → **Odśwież z API**.
2. Pod nagłówkiem pojawi się linijka „Pobrano teraz — X z 5 kanałów OK".
3. Kanały bez kluczy pokażą się w logu jako **pominięto** — to nie błąd.
4. Historia uruchomień siedzi w tabeli `panel_sync_log`.

Ręczne wywołanie spoza panelu (np. z terminala):
```bash
curl -X POST https://michalbezstresu.pl/api/panel/sync \
  -H "Authorization: Bearer $PANEL_API_KEY"
```

---

## Co gdzie jest

| Element | Plik |
|---|---|
| Tabele | `SUPABASE_STATYSTYKI.sql` |
| Odczyt/zapis danych | `src/pages/api/panel/statystyki.ts` |
| Automat pobierania | `src/pages/api/panel/sync.ts` |
| Lista zapisów (na żywo) | `src/pages/api/panel/subskrybenci.ts` |
| Zakładka w panelu | `src/pages/panel.astro` (sekcja `#statystyki`) |
| Widok „jeden ekran" | `src/pages/dashboard.astro` |
| Harmonogram crona | `vercel.json` |

## Decyzje warte zapamiętania

- **Adresy e-mail nie są kopiowane do Supabase.** Lista zapisów leci na żywo
  z MailerLite przy otwarciu panelu. W bazie trzymamy wyłącznie liczby.
- **`/dashboard` jest teraz za logowaniem** — pokazuje realne liczby biznesowe,
  więc przestał być stroną publiczną. Bez cookie przekierowuje na `/panel`.
- **Zasięg PWA rozszerzony** z `/panel` na `/` — bez tego apka na telefonie
  nie wpuszczała na `/dashboard`. To był powód, dla którego statystyk „nie było".
- Każdy snapshot ma pole `zrodlo` (`api` / `reczne` / `chrome`) — widać,
  która liczba jest z automatu, a która z palca.
