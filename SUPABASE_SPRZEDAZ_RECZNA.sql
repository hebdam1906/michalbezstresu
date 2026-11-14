-- Plan Tornado (14.11.2026): ręczna sprzedaż z kanałów bez webhooka (Empik, Amazon PL).
-- Jeden wiersz na kanał: łączna liczba egzemplarzy sprzedanych od 16.11.2026. Panel czyta przez service role.
-- Zastosowane w Supabase 14.11.2026 (migracja panel_sprzedaz_reczna).
create table if not exists public.panel_sprzedaz_reczna (
  kanal       text primary key check (kanal in ('empik','amazon_pl')),
  sztuki      int  not null default 0 check (sztuki >= 0),
  updated_at  timestamptz not null default now()
);
alter table public.panel_sprzedaz_reczna enable row level security;
insert into public.panel_sprzedaz_reczna (kanal, sztuki) values ('empik',0),('amazon_pl',0) on conflict do nothing;
