# Etap 2 — Supabase + auto-publikacja odcinków

Cel: nowy odcinek dodajesz w jednym miejscu (Supabase / docelowo Make.com po
akceptacji w Notion), a strona sama się przebudowuje i pokazuje go na górze.

## Jak to działa

1. `Odcinki.astro` przy **buildzie** pobiera odcinki z tabeli `odcinki`
   (Supabase REST, publiczny odczyt anon key), posortowane po `nr` malejąco.
2. Jeśli env Supabase nie jest ustawiony **lub** zapytanie zawiedzie —
   używana jest lokalna lista `src/data/odcinki.js` (fallback, Etap 1).
   Dzięki temu strona zawsze się zbuduje.
3. Bo pobieranie jest przy buildzie, nowy rekord w Supabase pojawi się na
   stronie dopiero **po redeployu** → do tego służy Deploy Hook Vercela.

## Uruchomienie (jednorazowo)

1. **Supabase** → SQL Editor → wklej i uruchom `SUPABASE_ODCINKI.sql`
   (tworzy tabelę + politykę odczytu + seed 3 odcinków).
2. **Env** → skopiuj `.env.example` do `.env`, uzupełnij `PUBLIC_SUPABASE_URL`
   i `PUBLIC_SUPABASE_ANON_KEY` (Supabase → Settings → API).
   Te same wartości dodaj w **Vercel → Settings → Environment Variables**.
3. Redeploy (albo `git push`). Od teraz strona czyta odcinki z Supabase.

## Deploy Hook (żeby publikacja była automatyczna)

1. **Vercel** → Project → Settings → Git → **Deploy Hooks** → utwórz hook
   (np. nazwa „make-odcinek", branch `main`) → skopiuj wygenerowany URL.
2. **Make.com**, Scenariusz 3 (po akceptacji odcinka w Notion):
   - ostatni moduł: **HTTP → Make a request**, metoda `POST`, URL = ten z Vercela.
   - opcjonalnie wcześniej: moduł Supabase „Insert a row" do tabeli `odcinki`
     (nr, tytul, opis, url) — użyj **service_role** key po stronie Make, nie anon.
3. Efekt: akceptujesz odcinek w Notion → Make wrzuca rekord do Supabase i woła
   Deploy Hook → Vercel przebudowuje stronę → odcinek jest live. Zero kodu.

## Dodanie odcinka ręcznie (zanim Make ruszy)

Supabase → Table Editor → `odcinki` → Insert row (nr, tytul, opis, url) →
Vercel → Deployments → Redeploy (albo poczekaj na następny `git push`).
