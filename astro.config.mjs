import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { stronyGotowe } from './src/data/strony-odcinkow.js';

export default defineConfig({
  // WWW, nie goła domena: michalbezstresu.pl robi 308 na www.michalbezstresu.pl,
  // więc to www jest adresem, który realnie zwraca 200. Z gołej domeny sitemapa
  // i canonical wskazywałyby na adresy, które się przekierowują (31.08.2026).
  site: 'https://www.michalbezstresu.pl',

  // Sitemapa: /sitemap-index.xml + /sitemap-0.xml, zgłoszone w robots.txt.
  // Wykluczone te same adresy, które blokuje robots.txt — inaczej wysyłalibyśmy
  // Google sprzeczne sygnały (sitemapa: „indeksuj", robots: „nie wchodź").
  integrations: [
    sitemap({
      filter: (page) => {
        // `dziekuje-firmy` musi być wypisane osobno: stary wzorzec kończył się
        // zaraz po „dziekuje", więc adresu z myślnikiem by nie złapał i strona
        // podziękowania B2B weszłaby do indeksu.
        if (/\/(dziekuje|dziekuje-firmy|panel|dashboard)\/?$/.test(page)) return false;
        // Rozdroże /odcinki istnieje w kodzie od 2.09, ale dopóki żadna strona
        // odcinka nie ma treści (`gotowa: true`), jest pustą listą. Pusta strona
        // raz zaindeksowana potrafi zostać w wynikach na tygodnie — więc do
        // sitemapy trafia dopiero razem z pierwszą prawdziwą stroną odcinka.
        if (/\/odcinki\/?$/.test(page) && stronyGotowe.length === 0) return false;
        return true;
      },
    }),
  ],

  // Astro 5: output:'static' (domyślny) obsługuje tryb mieszany.
  // Strony marketingowe (index, /ksiazka, /dla-firm, /media) są prerenderowane
  // statycznie. /panel i /api/* mają `export const prerender = false` → są
  // renderowane po stronie serwera (funkcje Vercel).
  output: 'static',
  adapter: vercel(),

  // Vercel CDN modyfikuje nagłówek Origin, co psuje domyślny CSRF-check Astro 5
  // dla POST-ów (logowanie panelu). Mamy własną autoryzację (hasło + podpis HMAC).
  security: { checkOrigin: false },
});
