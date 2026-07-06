# ✅ Co musisz zrobić — Michał bez Stresu

Marcin zbudował i zweryfikował całość (v1 landing + Etap 2 Supabase, build przechodzi
bez błędów). Poniżej Twoja część — po kolei. Zaznaczaj `[x]` gdy zrobione.

---

## A. Zobacz stronę lokalnie (2 min)
- [X] Terminal:
  ```
  cd ~/Desktop/"Michał bez Stresu"/mbs
  npm install
  npm run dev
  ```
- [x] Otwórz http://localhost:4321 — obejrzyj landing

## B. Sprzątanie (30 s)
- [ ] W Finderze usuń pusty, śmieciowy folder:
      `mbs/src/{components,layouts,pages,data,styles}`
      (powstał przez błąd przy tworzeniu — mnie system nie dał go skasować)

## C. Wypchnij live: GitHub → Vercel → domena
- [ ] Utwórz repo na GitHub (np. `michalbezstresu`) i wypchnij:
  ```
  git init && git add -A && git commit -m "start"
  git remote add origin git@github.com:TWOJ_LOGIN/michalbezstresu.git
  git push -u origin main
  ```
- [ ] vercel.com → Add New Project → wybierz repo (Astro wykryje się sam) → Deploy
- [ ] Vercel → Settings → Domains → dodaj `michalbezstresu.pl` → ustaw rekordy DNS
      u rejestratora domeny wg wskazówek Vercela
- [ ] Od teraz każdy `git push` = automatyczny deploy

## D. MailerLite (lead magnet = serce lejka)
- [ ] Załóż formularz: MailerLite → Forms → Embedded form
- [ ] Skopiuj kod embedu i wklej w `src/components/LeadMagnet.astro`
      w oznaczonym miejscu (`▼▼▼ MIEJSCE NA EMBED MAILERLITE ▼▼▼`) — usuń placeholderowy `<form>`
- [ ] Ustaw automat: po zapisie wysyłka checklisty (PDF) na maila
- [ ] Commit + push

## E. Podmień dane kontaktowe / social
- [ ] `src/components/Stopka.astro` — linki YouTube / TikTok / IG / FB (jeśli inne niż @michalbezstresu)
- [ ] Sprawdź adres e-mail `kontakt@michalbezstresu.pl` (Stopka + Produkty) — czy działa

## F. Etap 2 — Supabase (auto-odcinki) — gdy zechcesz
- [ ] Supabase → nowy projekt → SQL Editor → uruchom `SUPABASE_ODCINKI.sql`
- [ ] Skopiuj `.env.example` → `.env`, wpisz `PUBLIC_SUPABASE_URL` + `PUBLIC_SUPABASE_ANON_KEY`
      (Supabase → Settings → API; użyj **anon**, nie service_role)
- [ ] Te same 2 zmienne dodaj w Vercel → Settings → Environment Variables → redeploy
- [ ] (Szczegóły i Deploy Hook: patrz `ETAP2_SUPABASE.md`)

## G. Automatyzacja Make.com (Etap 2, opcjonalnie później)
- [ ] Vercel → Settings → Git → Deploy Hooks → utwórz hook, skopiuj URL
- [ ] Make.com Scenariusz 3 (po akceptacji odcinka w Notion): Supabase Insert row →
      HTTP POST na URL Deploy Hooka → strona przebudowuje się sama

---

## ⚠️ Pamiętaj (z CLAUDE.md)
- Do **30.09.2026**: żadnych treści wiązanych z konkretnym pracodawcą — tylko
  zanonimizowane historie „z 20 lat kariery"
- Nie zmieniaj palety, fontów ani „notatki służbowej" (element podpisowy) bez decyzji
- Każde CTA prowadzi docelowo do zapisu na listę (#checklista)

## Dalej (kiedy będziesz gotów)
- Etap 3: podstrony `/ksiazka` (przedsprzedaż), `/dla-firm` (B2B), `/media` (press room)
- Etap 4: dashboard zarządczy (wzór z projektu Z Trybun) — publikacje, zadania,
  wzrost listy (MailerLite API), lejek sprzedaży, tracker rozdziałów książki

Daj znać, a ruszę z którymkolwiek etapem. 🌿
