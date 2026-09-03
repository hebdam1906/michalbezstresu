# Strony odcinków — jak to działa

Marcin, 2.09.2026. Szablon gotowy i przetestowany. Treść dochodzi etapami.
Plan: `Strony-odcinkow_mapa-fraz-i-struktura.md` (Klaudiusz, Drive).

## Gdzie co jest

| plik | rola |
|---|---|
| `src/data/strony-odcinkow.js` | **jedyne miejsce, które edytujesz** — treść i SEO każdej strony |
| `src/pages/odcinki/[slug].astro` | szablon strony odcinka |
| `src/pages/odcinki/index.astro` | rozdroże `/odcinki` — lista |
| `src/layouts/Layout.astro` | dodany prop `jsonLdExtra` (VideoObject + okruszki) |
| `astro.config.mjs` | filtr sitemapy |

## Jak opublikować stronę

1. W `strony-odcinkow.js` znajdź wpis odcinka.
2. Wypełnij: `tytul`, `opis`, `h1`, `lead`, `sekcje[].tresc`, `zapamietaj`.
3. **Ustaw `gotowa: true`.**
4. `npm run build` → push → Vercel wdroży.

**Dopóki `gotowa: false`, strona się nie buduje.** Tak ma być: pusta strona raz
zaindeksowana potrafi zostać w wynikach Google na tygodnie.

## Dwie rzeczy, na które trzeba uważać

**Jedna strona = jedno zapytanie.** Pole `zapytanie` to nie ozdoba. Przy dziesięciu
stronach o pokrewnych tematach dwie nasze strony potrafią zacząć walczyć o ten sam
wynik i obie lądują niżej. Zanim dopiszesz nowe — sprawdź całą listę.

**Slug jest na zawsze.** Po publikacji nie zmieniamy: zmiana adresu kasuje pozycję,
którą strona zdążyła zbudować, i zostawia martwy link wszędzie, gdzie ktoś go wkleił.

## Czego szablon pilnuje sam

- **Film nie ładuje się, dopóki ktoś nie kliknie.** W HTML jest miniatura i przycisk,
  iframe powstaje dopiero po kliknięciu. Powód: osadzony YouTube ustawia ciasteczka
  natychmiast, więc bez tego łamalibyśmy własny baner zgód. Przy okazji strona jest
  szybsza, a szybkość liczy się w rankingu. Adres to `youtube-nocookie.com`.
- **VideoObject** w danych strukturalnych — nazwa, opis, miniatura, data premiery,
  adres. Jeśli wypełnisz pole `transkrypcja`, wejdzie też do znaczników.
- **Okruszki** (Start / Odcinki / tytuł) — pokazują się w wynikach Google.
- **Canonical i sitemapa** — automatycznie, nic nie trzeba ustawiać.
- **Rozdroże `/odcinki`** idzie z `noindex` i jest wycięte z sitemapy, dopóki lista
  jest pusta. Oba warunki znikają same przy pierwszej stronie z `gotowa: true`.

## Co zostało sprawdzone (2.09)

Build przeszedł. Na próbę włączyłem stronę PIP i potwierdziłem: strona generuje się
pod właściwym adresem, tytuł i canonical są poprawne, VideoObject ma prawidłowy
identyfikator filmu i datę premiery, okruszki się składają, w statycznym HTML nie ma
iframe'a, a sitemapa objęła nową stronę automatycznie. Potem cofnąłem przełącznik.

⚠️ Przy pierwszym buildzie `/odcinki` wyszło puste i wskoczyło do sitemapy —
`getStaticPaths` nie zatrzymuje trasy statycznej. Stąd `noindex` i filtr w configu.

## Stan na 2.09

Wszystkie dziesięć wpisów ma slug i zapytanie (zatwierdzone przez Klaudiusza).
Odcinki **2 (PIP)** i **1 (feedback)** mają komplet nagłówków i lead. Brakuje treści
sekcji — to robota Klaudiusza, termin 7.09.
