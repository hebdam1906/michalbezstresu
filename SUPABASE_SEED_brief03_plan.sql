-- SUPABASE_SEED_brief03_plan.sql
-- Import brief-03 (Klaudiusz → Marcin, 23.07.2026) do panelu Command Center + KOREKTA (Scenka 2 23.07, Short #1 24.07).
-- Wypełnia: panel_publikacje (kalendarz) + panel_zadania (sesje nagraniowe i scenariusze).
-- Uruchom w Supabase → SQL Editor (po SUPABASE_PANEL.sql). Idempotentny.

begin;

-- 1) KALENDARZ PUBLIKACJI ------------------------------------------------
delete from panel_publikacje where notatka like '[brief-03]%';
insert into panel_publikacje (tytul, platforma, status, data_pub, link, notatka) values
  ('Odcinek #1: Negatywny feedback od szefa', 'yt', 'opublikowane', '2026-07-22', 'https://youtu.be/VmjIfkhczyc', '[brief-03] opublikowany 22.07 · miniatura+opis+rozdziały+przypięty komentarz'),
  ('LinkedIn POST 1 (link do Odcinka #1)', 'blog', 'opublikowane', '2026-07-23', NULL, '[brief-03] opublikowany 23.07 rano · LinkedIn aktywny (hold zdjęty — porozumienie z BBH podpisane)'),
  ('Scenka 2 „Generalnie dobrze, ALE…”', 'tt', 'zaplanowane', '2026-07-23', NULL, '[brief-03] korekta brief-03 · zmontowana · TT+IG+YT Shorts'),
  ('Short #1: „Trzy zdania” (z odc. #1)', 'tt', 'zaplanowane', '2026-07-24', NULL, '[brief-03] korekta brief-03 · z odc. #1 · gotowy'),
  ('Mail: „Piszę książkę + link odc. #1” (nadrobiony)', 'newsletter', 'zaplanowane', '2026-07-24', NULL, '[brief-03] 10:00 · mail nadrobiony'),
  ('Scenka 1 „Quick call”', 'tt', 'zaplanowane', '2026-07-25', NULL, '[brief-03] 18:00 · TT+IG+YT Shorts natywnie · zmontowana'),
  ('Odcinek #2: PIP', 'yt', 'wprodukcji', '2026-07-27', NULL, '[brief-03] 8:00 · nagranie 23.07 → montaż: Marcin'),
  ('Scenka 3 „To nie jest PIP”', 'tt', 'zaplanowane', '2026-07-28', NULL, '[brief-03] 18:00 · dzień po odc. o PIP · zmontowana'),
  ('Mail tygodnia (PIP — 1 myśl + pytanie do książki)', 'newsletter', 'wprodukcji', '2026-07-29', NULL, '[brief-03] 10:00 · Claude przygotuje'),
  ('LinkedIn POST 2 (plan naprawczy fair)', 'blog', 'zaplanowane', '2026-07-30', NULL, '[brief-03] 8:15 · LinkedIn (aktywny — hold zdjęty)'),
  ('Short: „Pierwsze 48h po PIP” (z odc. #2)', 'tt', 'wprodukcji', '2026-07-30', NULL, '[brief-03] 18:00 · z odc. #2 · TT+IG+YT Shorts'),
  ('Short: „5 pytań — szansa czy formalność” (odc. #2)', 'tt', 'wprodukcji', '2026-08-01', NULL, '[brief-03] 18:00 · z odc. #2'),
  ('Odcinek #3: Wymagający szef czy mobbing?', 'yt', 'pomysl', '2026-08-03', NULL, '[brief-03] 8:00 · nagranie 1.08'),
  ('LinkedIn POST 3 (potwierdzanie ustaleń)', 'blog', 'zaplanowane', '2026-08-04', NULL, '[brief-03] 8:15 · LinkedIn (aktywny)'),
  ('Short: „5 zachowań, które NIE są mobbingiem”', 'tt', 'wprodukcji', '2026-08-04', NULL, '[brief-03] 18:00 · z odc. #3'),
  ('Mail tygodnia', 'newsletter', 'wprodukcji', '2026-08-05', NULL, '[brief-03] 10:00 · Claude'),
  ('Scenka 4 (z nagrań 1.08)', 'tt', 'wprodukcji', '2026-08-06', NULL, '[brief-03] 18:00 · montaż'),
  ('Short: „3 zachowania, które JUŻ są”', 'tt', 'wprodukcji', '2026-08-08', NULL, '[brief-03] 18:00 · z odc. #3'),
  ('Odcinek #4: Jak dokumentować problemy', 'yt', 'pomysl', '2026-08-10', NULL, '[brief-03] 8:00 · nagranie 1.08'),
  ('Short: „Mail potwierdzam ustalenia”', 'tt', 'wprodukcji', '2026-08-11', NULL, '[brief-03] 18:00 · z odc. #4'),
  ('Mail tygodnia', 'newsletter', 'wprodukcji', '2026-08-12', NULL, '[brief-03] 10:00 · Claude'),
  ('LinkedIn POST 4 (ocena roczna)', 'blog', 'zaplanowane', '2026-08-13', NULL, '[brief-03] 8:15 · LinkedIn (aktywny)'),
  ('Scenka 5', 'tt', 'wprodukcji', '2026-08-13', NULL, '[brief-03] 18:00 · montaż'),
  ('Short: „Gdzie trzymać dokumentację”', 'tt', 'wprodukcji', '2026-08-15', NULL, '[brief-03] 18:00 · z odc. #4'),
  ('Odcinek #5: Ocena roczna', 'yt', 'pomysl', '2026-08-17', NULL, '[brief-03] 8:00 · nagranie 15.08'),
  ('Short: „Co znaczy »meets expectations«”', 'tt', 'wprodukcji', '2026-08-18', NULL, '[brief-03] 18:00 · z odc. #5'),
  ('Mail tygodnia', 'newsletter', 'wprodukcji', '2026-08-19', NULL, '[brief-03] 10:00 · Claude'),
  ('Scenka 6', 'tt', 'wprodukcji', '2026-08-20', NULL, '[brief-03] 18:00 · montaż'),
  ('Short: „Jak negocjować ocenę”', 'tt', 'wprodukcji', '2026-08-22', NULL, '[brief-03] 18:00 · z odc. #5'),
  ('Odcinek #6: Wypalenie — 7 sygnałów', 'yt', 'pomysl', '2026-08-24', NULL, '[brief-03] 8:00 · nagranie 15.08'),
  ('LinkedIn POST 5 (stres w zespole)', 'blog', 'zaplanowane', '2026-08-25', NULL, '[brief-03] 8:15 · LinkedIn (aktywny)'),
  ('Short: „Niedziela wieczorem i ścisk w żołądku”', 'tt', 'wprodukcji', '2026-08-25', NULL, '[brief-03] 18:00 · z odc. #6'),
  ('Mail tygodnia', 'newsletter', 'wprodukcji', '2026-08-26', NULL, '[brief-03] 10:00 · Claude'),
  ('Short: „Zmęczenie vs wypalenie”', 'tt', 'wprodukcji', '2026-08-27', NULL, '[brief-03] 18:00 · z odc. #6'),
  ('Scenka lub short rezerwowy', 'tt', 'pomysl', '2026-08-29', NULL, '[brief-03] 18:00 · wg zapasu'),
  ('Odcinek #7: 1:1 (perspektywa managera)', 'yt', 'pomysl', '2026-08-31', NULL, '[brief-03] 8:00 · nagranie 29.08');

-- 2) ZADANIA (sesje nagraniowe + scenariusze) ---------------------------
delete from panel_zadania where created_by = 'brief-03';
insert into panel_zadania (tresc, owner, status, created_by) values
  ('Montaż Odcinka #2 „PIP” → publikacja pon 27.07 8:00', 'marcin', 'todo', 'brief-03'),
  ('Nagrania: odc. #3–4 + scenki 4–6 — sob 1.08 10:00', 'mike', 'todo', 'brief-03'),
  ('Scenariusze: odc. #3–4 + scenki 4–6 — deadline 30.07', 'klaudiusz', 'todo', 'brief-03'),
  ('Nagrania: odc. #5–6 + scenki — sob 15.08 10:00', 'mike', 'todo', 'brief-03'),
  ('Scenariusze: odc. #5–6 — deadline 13.08', 'klaudiusz', 'todo', 'brief-03'),
  ('Nagrania: odc. #7–8 + scenki — sob 29.08 10:00', 'mike', 'todo', 'brief-03'),
  ('Scenariusze: odc. #7–8 — deadline 27.08', 'klaudiusz', 'todo', 'brief-03');

commit;

-- Publikacje: 36 (Odcinek #1 + LinkedIn POST 1 opublikowane + korekta: Scenka 2, Short #1). Zadania: 7.