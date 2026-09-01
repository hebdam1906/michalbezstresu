// Odcinki — dodajesz nowy obiekt na górze listy po każdej publikacji.
// Docelowo ten plik zastąpi zapytanie do Supabase (tabela `odcinki`),
// zasilane automatycznie przez Scenariusz 3 w Make.com.
//
// POLA:
//   nr       numer odcinka
//   data     data premiery, format RRRR-MM-DD. Odcinek z datą w przyszłości
//            NIE pokazuje się jako karta — trafia do zapowiedzi pod listą
//            i sam zamienia się w kartę w dniu premiery (patrz Odcinki.astro).
//   yt       pełny adres filmu na YouTube. Bez niego karta się nie pokaże.
//   spotify  pełny adres ODCINKA na Spotify (nie programu). Adres powstaje
//            dopiero w momencie publikacji — do tego czasu zostaw null.
//
// ⚠️ Nie wpisuj tu adresu kanału ani programu. Do 14.08 wszystkie trzy odcinki
// linkowały do youtube.com/@michalbezstresu, czyli widz lądował na kanale
// i musiał sam szukać filmu.

export const odcinki = [
  {
    nr: 7,
    data: '2026-08-31',
    tytul: 'Rozmowa 1:1 z managerem — najbardziej zmarnowane 15 minut w korporacji',
    opis: 'Kto przychodzi z agendą, ten prowadzi spotkanie. Trzy zdania, które zamieniają status w rozmowę o Tobie.',
    yt: 'https://youtu.be/mrXetPDAgGI',
    spotify: 'https://open.spotify.com/episode/4vHTzKykNxKWd2mXGh4Vo4',
  },
  {
    nr: 6,
    data: '2026-08-24',
    tytul: 'Wypalenie — historia, której nie opowiedziałem nikomu w firmie',
    opis: 'Siedem sygnałów, test urlopu i uczciwa rozmowa o tym, kiedy samopomoc to za mało.',
    yt: 'https://youtu.be/3Cr2skUUb7Y',
    spotify: 'https://open.spotify.com/episode/0dLk6qy3gb4m48WWO2wHp8',
  },
  {
    nr: 5,
    data: '2026-08-17',
    tytul: 'Ocena roczna — dlaczego zapada, zanim usiądziesz do rozmowy',
    opis: 'Jak działa kalibracja, co naprawdę znaczy „meets expectations" i plan w czterech krokach, żeby pracować na ocenę cały rok, nie godzinę.',
    yt: 'https://youtu.be/IBgoUr40pXk',
    spotify: 'https://open.spotify.com/episode/6ZQx5wUsCdyp1gIC8OiC5x',
  },
  {
    nr: 4,
    data: '2026-08-10',
    tytul: 'Jak dokumentować problemy w pracy — krok po kroku',
    opis: 'Notatka własna w pięciu punktach, mail „potwierdzam ustalenia" i trzy czerwone linie, których nie wolno przekroczyć.',
    yt: 'https://youtu.be/CfKTiq2fVmk',
    spotify: 'https://open.spotify.com/episode/11kEg4wQfGJ40FkvFbFo7k',
  },
  {
    nr: 3,
    data: '2026-08-03',
    tytul: 'Wymagający szef czy mobbing? Gdzie naprawdę leży granica',
    opis: 'Pięć zachowań, które mobbingiem nie są — i trzy, które już nim są. Z przykładami, bez straszenia.',
    yt: 'https://youtu.be/nSiqAlXGkIo',
    spotify: 'https://open.spotify.com/episode/1CPI2N8YUrRscmdErccBjh',
  },
  {
    nr: 2,
    data: '2026-07-28',
    tytul: 'PIP — jak wygląda plan naprawczy od środka i czy da się go przetrwać',
    opis: 'Kto go pisze, po co naprawdę powstaje i co zrobić w pierwszych 48 godzinach po jego otrzymaniu.',
    yt: 'https://youtu.be/s_H-Ks-8urQ',
    spotify: 'https://open.spotify.com/episode/3gw3DJ6jhMuaj727n5uoTt',
  },
  {
    nr: 1,
    data: '2026-07-22',
    tytul: 'Negatywny feedback od szefa — co naprawdę oznacza i jak odpowiedzieć',
    opis: 'Różnica między uwagą ustną a pisemną, trzy zdania, których nigdy nie mówić, i wzór spokojnej odpowiedzi.',
    yt: 'https://youtu.be/VmjIfkhczyc',
    spotify: 'https://open.spotify.com/episode/07IyvkccYzs0kk9qrxgHgC',
  },
];

// Ile kart pokazujemy na stronie głównej. Reszta jest na kanale.
export const ILE_KART = 6;

export const KANAL_YT = 'https://www.youtube.com/@michalbezstresu';
export const PODCAST = 'https://open.spotify.com/show/033Xdd4fISRZxTSUZhASOW';
