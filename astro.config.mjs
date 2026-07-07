import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://michalbezstresu.pl',

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
