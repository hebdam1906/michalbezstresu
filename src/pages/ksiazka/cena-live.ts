// /ksiazka/cena-live/ — stały link „39 zł do 22.11” dla osób z ankiety po live 5.11 (brief Klaudiusza 5.11).
// Ten adres idzie na stronę po ankiecie i w mailu, więc zmieniamy tylko cel tutaj.
// Do 15.11 cena publiczna to 39 zł → zwykły checkout. PRZED 16.11: podmienić CEL na ukryty plan 39 zł
// w EasyCart (…/z-obu-stron-stolu-ebook?plan=price_…). Po 22.11 23:59: CEL → /ksiazka/ (cena publiczna).
export const prerender = false;
import type { APIRoute } from 'astro';

const CEL = 'https://cart.easy.tools/checkout/michalbezstresu/z-obu-stron-stolu-ebook';
const KONIEC = Date.parse('2026-11-22T23:59:59+01:00');

export const GET: APIRoute = ({ url }) => {
  const q = new URLSearchParams({ utm_source: url.searchParams.get('utm_source') || 'ankieta', utm_medium: 'ankieta', utm_campaign: 'live-5-11' });
  const dokad = Date.now() > KONIEC ? '/ksiazka/?utm_source=ankieta&utm_campaign=live-5-11-po-terminie' : `${CEL}?${q}`;
  return new Response(null, { status: 302, headers: { Location: dokad, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
};
