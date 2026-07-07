-- ============================================================================
-- 🔒 Michał bez Stresu — Panel zarządczy (Command Center)
-- ----------------------------------------------------------------------------
-- Uruchom RAZ w Supabase → SQL Editor (projekt MBS).
-- Tabele obsługują tylko API routes (server-side, service_role).
-- RLS włączone BEZ publicznych polityk = anon nie ma dostępu; service_role
-- omija RLS. Dzięki temu dane panelu są prywatne.
-- ============================================================================

-- 1) ZADANIA (kanban: todo / inprogress / done) -----------------------------
create table if not exists panel_zadania (
  id          bigserial primary key,
  tresc       text        not null,
  owner       text        not null default 'mike'   -- mike | marcin | klaudiusz | team
    check (owner in ('mike','marcin','klaudiusz','team')),
  status      text        not null default 'todo'    -- todo | inprogress | done
    check (status in ('todo','inprogress','done')),
  created_by  text        not null default 'mike',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2) PUBLIKACJE (kalendarz treści) ------------------------------------------
create table if not exists panel_publikacje (
  id          bigserial primary key,
  tytul       text        not null,
  platforma   text        not null default 'yt'      -- yt | tt | ig | fb | newsletter | blog
    check (platforma in ('yt','tt','ig','fb','newsletter','blog')),
  status      text        not null default 'pomysl'  -- pomysl | wprodukcji | zaplanowane | opublikowane
    check (status in ('pomysl','wprodukcji','zaplanowane','opublikowane')),
  data_pub    date,
  link        text,
  notatka     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3) ROZDZIAŁY KSIĄŻKI (tracker) --------------------------------------------
create table if not exists panel_rozdzialy (
  id          bigserial primary key,
  nr          int         not null,
  tytul       text        not null,
  status      text        not null default 'szkic'   -- szkic | wpisaniu | gotowy
    check (status in ('szkic','wpisaniu','gotowy')),
  slowa       int         not null default 0,
  notatka     text,
  updated_at  timestamptz not null default now()
);

-- 4) LEJEK / WZROST LISTY (punkty w czasie) ---------------------------------
create table if not exists panel_lejek (
  id            bigserial primary key,
  data          date        not null default current_date,
  subskrybenci  int         not null default 0,   -- łączna liczba na liście
  nowi          int         not null default 0,   -- przyrost od ostatniego wpisu
  notatka       text,
  created_at    timestamptz not null default now()
);

-- 5) SESJE LOGOWANIA (opcjonalne — nie używane przy gate na hasło, zostawione
--    na przyszłość, gdyby przejść na magic-link) ----------------------------
-- (pominięte celowo — gate działa na PANEL_PASSWORD + podpisane cookie)

-- ============================================================================
-- RLS — włącz i NIE dodawaj publicznych polityk (anon = brak dostępu)
-- ============================================================================
alter table panel_zadania    enable row level security;
alter table panel_publikacje enable row level security;
alter table panel_rozdzialy  enable row level security;
alter table panel_lejek      enable row level security;

-- ============================================================================
-- SEED (przykładowe dane — możesz usunąć po pierwszym zalogowaniu)
-- ============================================================================
insert into panel_zadania (tresc, owner, status, created_by) values
  ('Wpiąć embed MailerLite na stronie', 'mike', 'todo', 'marcin'),
  ('Nagrać odcinek: „Ocena roczna bez dramatu”', 'mike', 'inprogress', 'mike'),
  ('Zaprojektować grafikę do checklisty', 'klaudiusz', 'todo', 'marcin');

insert into panel_publikacje (tytul, platforma, status, data_pub, notatka) values
  ('Jak przyjąć trudny feedback', 'yt', 'zaplanowane', current_date + 3, 'Główny odcinek tygodnia'),
  ('Checklista dokumentowania — zajawka', 'ig', 'pomysl', null, 'Karuzela 5 slajdów'),
  ('Newsletter #1: powitalny', 'newsletter', 'wprodukcji', current_date + 1, 'Po zapisie na listę');

insert into panel_rozdzialy (nr, tytul, status, slowa) values
  (1, 'Pierwszy dzień, pierwsze zasady', 'szkic', 0),
  (2, 'Feedback, który nie niszczy', 'wpisaniu', 1200),
  (3, 'Ocena roczna bez dramatu', 'szkic', 0);

insert into panel_lejek (data, subskrybenci, nowi, notatka) values
  (current_date, 0, 0, 'Start listy');
