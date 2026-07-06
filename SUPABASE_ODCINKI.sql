-- ============================================================================
-- Michał bez Stresu — Etap 2: tabela `odcinki` (Supabase)
-- ============================================================================
-- Uruchom w Supabase → SQL Editor → New query → Run.
-- Strona pobiera odcinki przy buildzie (anon key, publiczny odczyt).
-- Nowy rekord = trzeba przebudować stronę (Deploy Hook Vercela z Make.com).
-- ============================================================================

create table if not exists public.odcinki (
  id           bigint generated always as identity primary key,
  nr           integer not null,
  tytul        text not null,
  opis         text not null,
  url          text not null,
  published_at date not null default now(),
  created_at   timestamptz not null default now()
);

create index if not exists idx_odcinki_nr on public.odcinki (nr desc);

-- Publiczny odczyt (treść jawna). Zapis tylko przez service_role (Make.com).
alter table public.odcinki enable row level security;

drop policy if exists "public read odcinki" on public.odcinki;
create policy "public read odcinki"
  on public.odcinki for select
  using (true);

-- Seed: 3 istniejące odcinki (te same co w src/data/odcinki.js)
insert into public.odcinki (nr, tytul, opis, url) values
  (1, 'Negatywny feedback od szefa — co naprawdę oznacza i jak odpowiedzieć',
      'Różnica między uwagą ustną a pisemną, trzy zdania, których nigdy nie mówić, i wzór spokojnej odpowiedzi.',
      'https://www.youtube.com/@michalbezstresu'),
  (2, 'PIP — jak wygląda plan naprawczy od środka i czy da się go przetrwać',
      'Kto go pisze, po co naprawdę powstaje i co zrobić w pierwszych 48 godzinach po jego otrzymaniu.',
      'https://www.youtube.com/@michalbezstresu'),
  (3, 'Wymagający szef czy mobbing? Gdzie naprawdę leży granica',
      'Pięć zachowań, które mobbingiem nie są — i trzy, które już nim są. Z przykładami, bez straszenia.',
      'https://www.youtube.com/@michalbezstresu')
on conflict do nothing;
