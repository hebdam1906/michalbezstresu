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
- [x] W Finderze usuń pusty, śmieciowy folder `mbs/src/{components,layouts,pages,data,styles}` (usunięte w terminalu)

## C. Wypchnij live: GitHub → Vercel → domena ✅ ZROBIONE
- [x] Repo na GitHub `hebdam1906/michalbezstresu` + push (main)
- [x] Vercel: import repo, Astro auto, Deploy → live
- [x] Domena `michalbezstresu.pl` kupiona (home.pl) + DNS (A → 216.150.1.1, CNAME www → cname.vercel-dns.com) + HTTPS
- [x] Strona live pod własną domeną: https://michalbezstresu.pl
- [x] Każdy `git push` = automatyczny deploy

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

## H. Panel `/panel` — apka dla Ciebie ✅ ZBUDOWANE (model jak Z Trybun)
Kod gotowy i przetestowany (logowanie, sesja, moduły, gating API). Żeby ożył:
- [ ] Supabase → SQL Editor → uruchom `SUPABASE_PANEL.sql`
- [ ] Vercel → Environment Variables: `SUPABASE_SERVICE_ROLE`, `PANEL_PASSWORD`,
      `PANEL_SESSION_SECRET`, `PANEL_API_KEY` (+ `PUBLIC_SUPABASE_URL`/`ANON` jeśli
      jeszcze nie ma) — pełna tabelka w **`PANEL_SETUP.md`**
- [ ] `git push` → wejdź na `michalbezstresu.pl/panel`, zaloguj hasłem
- Moduły: zadania (kanban), kalendarz publikacji, tracker rozdziałów książki, lejek listy
- Klaudiusz (AI) może dodawać zadania/publikacje przez API (Bearer `PANEL_API_KEY`)

---

## ✅ Zrobione w tej sesji (Marcin)
- **Lead magnet:** treść checklisty + brandowany PDF `public/checklista-dokumentowanie.pdf`
- **Etap 3 — podstrony:** `/ksiazka`, `/dla-firm`, `/media` (spójne z brandem, każda z CTA
  do zapisu na listę). Nav i stopka podpięte.
- **Panel `/panel`** (sekcja H powyżej).

## Dalej (kiedy będziesz gotów)
- **MailerLite** (sekcja D) — jak wklejisz kod embedu, podepnę go i checklista pójdzie
  automatem na maila po zapisie.
- Magic-link zamiast hasła w panelu (gdy podłączymy provider maili).

Daj znać, a ruszę z którymkolwiek etapem. 🌿
