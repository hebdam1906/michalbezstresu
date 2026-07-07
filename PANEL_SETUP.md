# 🔒 Panel `/panel` — uruchomienie (model jak Z Trybun)

Panel zarządczy dla Ciebie: **zadania** (kanban), **kalendarz publikacji**,
**tracker rozdziałów książki** i **lejek** (wzrost listy mailowej).
Architektura identyczna jak w Z Trybun: Astro (SSR na Vercel) + Supabase
(service_role po stronie serwera) + API routes + logowanie przez cookie.

**Jedna świadoma różnica względem Z Trybun:** logowanie jest na **hasło**, a nie
magic-link e-mail. Magic-link wymagałby providera maili (Resend itp.), którego MBS
jeszcze nie ma. Hasło daje ten sam efekt przy zerowym dodatkowym setupie — a gdy
zechcesz, przełączymy na magic-link później (kod jest przygotowany pod to).

---

## Co musisz zrobić (jednorazowo, ~10 min)

### 1. Supabase — tabele
Supabase → Twój projekt MBS → **SQL Editor** → wklej i uruchom **`SUPABASE_PANEL.sql`**.
Tworzy 4 tabele (`panel_zadania`, `panel_publikacje`, `panel_rozdzialy`, `panel_lejek`),
włącza RLS bez publicznych polityk (dane prywatne) i wrzuca przykładowe wpisy.

> Jeśli nie masz jeszcze projektu Supabase dla MBS — załóż go najpierw
> (Supabase → New project) i przy okazji uruchom też `SUPABASE_ODCINKI.sql` (Etap 2).

### 2. Zmienne środowiskowe — Vercel
Vercel → projekt MBS → **Settings → Environment Variables**. Dodaj:

| Zmienna | Skąd / co wpisać |
|---|---|
| `PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → **anon** key |
| `SUPABASE_SERVICE_ROLE` | Supabase → Settings → API → **service_role** key ⚠️ SEKRET |
| `PANEL_PASSWORD` | Twoje hasło do panelu (mocne, dowolne) |
| `PANEL_SESSION_SECRET` | długi losowy ciąg — wygeneruj: `openssl rand -hex 32` |
| `PANEL_API_KEY` | klucz dla Klaudiusza (AI) — `openssl rand -hex 24` |

> `SUPABASE_SERVICE_ROLE`, `PANEL_PASSWORD`, `PANEL_SESSION_SECRET`, `PANEL_API_KEY`
> **nie mają** prefiksu `PUBLIC_` — dzięki temu nigdy nie trafiają do przeglądarki.

### 3. Deploy
`git push` (albo Vercel → Redeploy). Po deployu wejdź na **`https://michalbezstresu.pl/panel`**,
zaloguj się hasłem. Gotowe.

---

## Jak to działa (w skrócie)

- **Strony marketingowe** (`/`, `/ksiazka`, `/dla-firm`, `/media`) — statyczne, jak dotąd.
- **`/panel` i `/api/panel/*`** — renderowane po stronie serwera (funkcje Vercel),
  bo mają `export const prerender = false`. To wymaga adaptera `@astrojs/vercel`
  (dodany do `package.json`).
- **Zapis/odczyt danych** idzie tylko przez API routes z kluczem `service_role`
  (omija RLS). Przeglądarka nigdy nie dotyka bazy bezpośrednio.
- **Logowanie:** hasło → podpisane cookie (HMAC, ważne 30 dni). Wylogowanie czyści cookie.

## Klaudiusz (AI) — dostęp przez API
Klaudiusz może dodawać zadania i publikacje bez logowania, nagłówkiem:

```
Authorization: Bearer <PANEL_API_KEY>
```

Przykład (dodanie zadania):
```bash
curl -X POST https://michalbezstresu.pl/api/panel/zadania \
  -H "Authorization: Bearer $PANEL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"tresc":"Przygotować grafikę do odcinka #3","owner":"klaudiusz"}'
```

Endpointy: `zadania`, `publikacje`, `rozdzialy`, `lejek` — każdy GET/POST(+PATCH/DELETE).

## Lokalnie (podgląd)
```
cd ~/Desktop/"Michał bez Stresu"/mbs
# w .env ustaw PANEL_PASSWORD i PANEL_SESSION_SECRET (Supabase opcjonalnie)
npm install
npm run dev      # http://localhost:4321/panel
```
Bez env Supabase panel zaloguje się, ale moduły pokażą pustkę + żółty baner
(to normalne — dane pojawią się po ustawieniu env i uruchomieniu SQL).

## Bezpieczeństwo
- `service_role` i sekrety panelu są **tylko** po stronie serwera (bez `PUBLIC_`).
- `/panel` ma `noindex, nofollow` — nie zaindeksuje się w Google.
- RLS włączone, brak publicznych polityk → anon nie odczyta tabel panelu.
- Cookie: `httpOnly`, `secure`, `sameSite=lax`, podpis HMAC, TTL 30 dni.
