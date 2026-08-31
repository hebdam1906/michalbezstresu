-- ============================================================================
-- 🎯 Zapytania o konsultacje (BRIEF-11, 6.08.2026)
-- ----------------------------------------------------------------------------
-- Idempotentny. Można odpalać wielokrotnie.
--
-- Dlaczego w Supabase, a nie prosto na maila: skrzynka Zoho na darmowym planie
-- nie daje SMTP, a konta ani hasła nie zakładam za Michała. Zapytanie ląduje
-- więc w bazie (nic nie ginie), Michał widzi je w /panel, a osoba pytająca
-- dostaje autoodpowiedź z MailerLite.
-- ============================================================================

create table if not exists konsultacje_zapytania (
  id            bigserial primary key,
  utworzono     timestamptz not null default now(),
  imie          text        not null,
  email         text        not null,
  sytuacja      text        not null,
  kod_rabatowy  text,
  zrodlo        text,                       -- skąd przyszedł (utm / referer)
  status        text        not null default 'nowe',
  notatka       text,
  ip_hash       text,                       -- do ograniczania nadużyć, NIE samo IP
  skad_wiesz    text                        -- odpowiedź z pola „Skąd o mnie wiesz?"
);

-- Kolumna dodana 31.08.2026, już po utworzeniu tabeli — stąd osobny ALTER
-- (żeby ten plik dało się odpalić i na świeżej, i na istniejącej bazie).
alter table konsultacje_zapytania add column if not exists skad_wiesz text;
comment on column konsultacje_zapytania.skad_wiesz is
  'YouTube / newsletter / grupa-fb / polecenie / reklama / „inne: <tekst>". UTM-y pokazują kliknięcie, to pokazuje decyzję — potrzebne na Checkpoint 1 (31.10.2026).';

comment on table konsultacje_zapytania is
  'Zapytania z formularza /konsultacje. Dane osobowe — patrz polityka prywatności, cel: obsługa zapytań konsultacyjnych.';
comment on column konsultacje_zapytania.ip_hash is
  'SHA-256 z IP + sól. Trzymamy skrót, nie adres — do wyłapania zalewu z jednego źródła.';

create index if not exists konsultacje_utworzono_idx on konsultacje_zapytania (utworzono desc);
create index if not exists konsultacje_status_idx    on konsultacje_zapytania (status);

-- Status: nowe → odpowiedziano → umowione → zrobione → odrzucone
alter table konsultacje_zapytania drop constraint if exists konsultacje_status_ok;
alter table konsultacje_zapytania add constraint konsultacje_status_ok
  check (status in ('nowe','odpowiedziano','umowione','zrobione','odrzucone'));

-- RLS włączone i BEZ polityk dla anon: do tabeli wchodzi wyłącznie klucz
-- service_role z API route. Nikt z przeglądarki nie odczyta cudzych zapytań.
alter table konsultacje_zapytania enable row level security;
