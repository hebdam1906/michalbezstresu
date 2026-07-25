-- ============================================================================
-- 📊 Michał bez Stresu — ETAP 4: statystyki (zakładka „Statystyki" w /panel)
-- ----------------------------------------------------------------------------
-- Uruchom RAZ w Supabase → SQL Editor (projekt „michal-bez-stresu").
-- Skrypt jest IDEMPOTENTNY — można go odpalić ponownie bez szkody.
--
-- Zasada jak w SUPABASE_PANEL.sql: RLS włączone BEZ publicznych polityk.
-- Do danych dostają się wyłącznie API routes (service_role po stronie serwera).
--
-- ŚWIADOMA DECYZJA: nie trzymamy tu adresów e-mail subskrybentów.
-- Lista zapisów jest pobierana na żywo z MailerLite przy otwarciu panelu
-- (/api/panel/subskrybenci) i nigdzie nie ląduje w naszej bazie.
-- ============================================================================

-- 1) METRYKI KANAŁÓW — jeden snapshot na platformę na dzień -----------------
--    Historia dzienna = z niej liczymy wzrost obserwujących (dzień/tydzień).
create table if not exists panel_metryki (
  id              bigserial primary key,
  data            date        not null default current_date,
  platforma       text        not null            -- yt | tt | ig | fb | newsletter
    check (platforma in ('yt','tt','ig','fb','newsletter')),
  obserwujacy     int         not null default 0, -- subskrybenci / followersi / fani
  wyswietlenia_28 int         not null default 0, -- wyświetlenia z ostatnich 28 dni
  polubienia      int         not null default 0,
  materialy       int         not null default 0, -- liczba filmów / postów
  zrodlo          text        not null default 'reczne'
    check (zrodlo in ('reczne','api','chrome')),
  created_at      timestamptz not null default now(),
  unique (data, platforma)                        -- jeden wpis dziennie na kanał
);

-- 2) WYNIKI PER MATERIAŁ — każdy short/odcinek/post osobno ------------------
create table if not exists panel_materialy (
  id             bigserial primary key,
  tytul          text        not null,
  platforma      text        not null
    check (platforma in ('yt','tt','ig','fb','newsletter')),
  data_pub       date,
  wyswietlenia   int         not null default 0,
  polubienia     int         not null default 0,
  komentarze     int         not null default 0,
  link           text,
  external_id    text,                            -- id filmu/posta na platformie
  zrodlo         text        not null default 'reczne'
    check (zrodlo in ('reczne','api','chrome')),
  zaktualizowano timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

-- Klucz do bezkolizyjnego upsertu z API (jeden wiersz na materiał).
create unique index if not exists panel_materialy_ext_uniq
  on panel_materialy (platforma, external_id)
  where external_id is not null;

-- 3) RUCH NA STRONIE + LEJEK DO CHECKLISTY ----------------------------------
--    wizyty → zapisy → konwersja. Źródła wizyt jako jsonb (elastycznie).
create table if not exists panel_ruch (
  id         bigserial primary key,
  data       date        not null default current_date unique,
  wizyty     int         not null default 0,
  zapisy     int         not null default 0,      -- nowi na liście tego dnia
  zrodla     jsonb       not null default '{}'::jsonb,
  zrodlo     text        not null default 'reczne'
    check (zrodlo in ('reczne','api','chrome')),
  created_at timestamptz not null default now()
);

-- 4) LOG SYNCHRONIZACJI — żeby było wiadomo, czy automat żyje --------------
create table if not exists panel_sync_log (
  id          bigserial primary key,
  uruchomiono timestamptz not null default now(),
  platforma   text        not null,
  status      text        not null check (status in ('ok','blad','pominieto')),
  szczegoly   text
);

-- ============================================================================
-- RLS — włączone, ZERO publicznych polityk (anon nie widzi nic)
-- ============================================================================
alter table panel_metryki   enable row level security;
alter table panel_materialy enable row level security;
alter table panel_ruch      enable row level security;
alter table panel_sync_log  enable row level security;

-- ============================================================================
-- INDEKSY pod typowe zapytania panelu
-- ============================================================================
create index if not exists panel_metryki_data_idx    on panel_metryki (data desc);
create index if not exists panel_materialy_pub_idx   on panel_materialy (data_pub desc nulls last);
create index if not exists panel_ruch_data_idx       on panel_ruch (data desc);
create index if not exists panel_sync_log_czas_idx   on panel_sync_log (uruchomiono desc);

-- ============================================================================
-- WIDOK: wzrost obserwujących dzień do dnia (per platforma)
-- Panel czyta go, żeby nie liczyć różnic w JS.
-- ============================================================================
create or replace view panel_wzrost as
select
  m.platforma,
  m.data,
  m.obserwujacy,
  m.obserwujacy - lag(m.obserwujacy) over (
    partition by m.platforma order by m.data
  ) as przyrost_dzien,
  m.wyswietlenia_28
from panel_metryki m;

-- ============================================================================
-- GOTOWE. Kolejny krok: zmienne środowiskowe w Vercel — patrz ETAP4_STATYSTYKI.md
-- ============================================================================
