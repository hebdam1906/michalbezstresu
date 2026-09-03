# SEO — wdrożenie 31.08.2026 (commit f867905)

Cztery z pięciu punktów audytu Klaudiusza. **Zweryfikowane na produkcji.**

| co | stan na żywo |
|---|---|
| `sitemap-index.xml` / `sitemap-0.xml` | 200, 8 adresów, wszystkie www |
| `Sitemap:` w `robots.txt` | jest |
| `canonical` | jest, także na podstronach (`/checklista/`) |
| `og:image` 1200×630 | 200, 248 KB, `/og-michal-bez-stresu.png` |
| `og:url`, `og:site_name`, `og:locale`, `twitter:card` | są |
| JSON-LD `WebSite` + `Person` | jest, 5 profili w `sameAs` |
| `/dziekuje` | `noindex, nofollow`, poza sitemapą, bez JSON-LD |
| `facebook-domain-verification` | **nietknięty** |
| `Disallow: /dziekuje` | **nietknięty** |

## Dwie rzeczy, których nie było w audycie

**`site` wskazywał na gołą domenę.** `michalbezstresu.pl` robi 308 na `www.` —
sitemapa i canonical z gołej domeny wskazywałyby adresy, które się przekierowują.
Przestawione na `https://www.michalbezstresu.pl`.

**Strona odpowiada 200 pod `/checklista` i pod `/checklista/`** — ten sam materiał
pod dwoma adresami. Canonical wskazuje wersję z ukośnikiem, spójnie z sitemapą.

## Pułapki, na które trafiliśmy

📌 **`npm run build` na Macu pada na kroku „Rearranging server assets".** To nie jest
usterka strony — shell nie ma prawa usuwania katalogów, a Astro sprząta puste katalogi
po buildzie. Wszystkie podstrony generują się poprawnie. Weryfikacja buildu wymaga
czystej kopii repo poza dyskiem współdzielonym. Przed każdym buildem trzeba też odłożyć
`.vercel/` i `dist/`, bo adapter Vercela próbuje je skasować i wywala się wcześniej.

📌 **Vercel zgubił webhooka z GitHuba.** Commit był na GitHubie (`git ls-remote` to
potwierdzał), integracja podłączona, a deploymentu nie było. Odblokował go pusty commit.
Gdyby się powtórzyło: Settings → Git → Deploy Hooks daje stały URL do ręcznego wyzwolenia.

📌 **Kolejność sprawdzania przy „Vercel nie zbudował":** czy commit jest na origin
(`git ls-remote origin refs/heads/main`) → czy produkcja serwuje starą wersję (`curl`)
→ dopiero potem panel. Panel potrafi pokazywać przefiltrowaną listę.

## Zostaje

**Punkt 5 — Google Search Console.** Wymaga konta Michała: dodać właściwość
`www.michalbezstresu.pl`, zweryfikować (meta-znacznik jak przy Mecie albo DNS w home.pl)
i zgłosić `https://www.michalbezstresu.pl/sitemap-index.xml`.
To jest realna przyczyna braku strony w indeksie — nie budowa strony.

## Google Search Console — 31.08.2026, 16:5x

- Usługa: **URL prefix** `https://www.michalbezstresu.pl/` (nie Domain — Domain wymaga rekordu DNS, a strefa jest w home.pl).
- Konto: **hebdam1906@gmail.com** (to samo co Google Ads).
- Weryfikacja: **HTML tag** — `<meta name="google-site-verification" content="maiS35ck07bHKzqunUGMaYtYm2R_zP45jC0HvErhiWk">` w `src/layouts/Layout.astro`, tuż pod tagiem Mety. Status: **Ownership verified**.
- Sitemapa: `sitemap-index.xml` zgłoszona → **Success**. Indeks wskazuje na `sitemap-0.xml` z 8 adresami; `/dziekuje` poprawnie wykluczone.
- „Discovered pages: 0" zaraz po zgłoszeniu jest normalne — Google przetworzy plik w ciągu kilku dni.

### Pułapki
- **Nie usuwać meta-tagu Google ani Mety z `Layout.astro`.** Usunięcie któregokolwiek = utrata weryfikacji (Meta w trakcie kampanii, GSC = utrata danych o wyszukiwarce).
- Repo jest na **Pulpicie**: `~/Desktop/"Michał bez Stresu"/mbs` — nie w katalogu domowym.
- Pierwsze „Discovered pages" i dane w Performance pojawią się z opóźnieniem 2–3 dni.

## og:image a LinkedIn — temat zamknięty po naszej stronie (31.08, wieczór)

Post Inspector uparcie zwraca „Image: No image found", mimo poprawnych tagów.
Przeszliśmy wszystkie trzy podpowiedzi Klaudiusza, w jego kolejności:

1. **Świeży adres (`?v=2`, `?v=3`, `?v=4`)** — wyklucza cache. Bez zmiany.
2. **`og:image:type`** — `width` i `height` już były, dopisany `type`. Bez zmiany.
3. **JPG zamiast PNG** — `og-michal-bez-stresu.jpg`, 76 KB, `image/jpeg`. Bez zmiany.

Stan faktyczny sprawdzony niezależnie: plik odpowiada 200, `image/jpeg`, 1200×630,
`robots.txt` nic nie blokuje, odpowiada też na żądanie z UA LinkedInBota.
Tytuł i opis LinkedIn czyta z tej samej strony poprawnie — wysypuje się wyłącznie obrazek.

**Trop, którego nie da się zamknąć po naszej stronie:** w „URL redirect trail" Post Inspector
raportuje **206**, nie 200. Vercel honoruje nagłówek `Range` i zwraca `206 Partial Content`
— zarówno dla strony, jak i dla pliku graficznego. Jeśli ich crawler pobiera obrazek
żądaniem zakresowym i nie składa go z części, to tłumaczy, dlaczego stronę czyta,
a obrazka nie. Tego nie przestawimy bez zmiany hostingu.

**Decyzja:** zostawiamy JPG (i tak lżejszy o 178 KB), nie ruszamy więcej. Sekcja
„Polecane" na LinkedInie czeka. Sprawdzić ponownie za kilka dni — bywa, że zaskakuje
samo z siebie.

⚠️ PNG (`og-michal-bez-stresu.png`) został w `public/` — gdyby trzeba było wrócić.
