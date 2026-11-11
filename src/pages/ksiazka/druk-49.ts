// /ksiazka/druk-49/ — druk z dedykacją za 49 zł dla osób, które mają już e-book (brief Klaudiusza 11.11).
// Link tylko w P.S. maila 17.11 do grupy „Ksiazka-kupujacy” bez „Druk-kupujacy”.
// CEL = ukryty wariant 49 zł w produkcie druku (EasyCart, identyfikator „druk-49”, koniec dostępności 30.11 23:55).
// PLAN uzupełniamy 16.11 po publikacji produktu druku (link „Udostępnij” → wariant 49 zł).
// Dopóki PLAN jest pusty albo po 30.11 23:59: przekierowanie na /ksiazka/.
export const prerender = false;
import type { APIRoute } from 'astro';

const CEL = 'https://cart.easy.tools/checkout/michalbezstresu/z-obu-stron-stolu-wydanie-drukowane';
const PLAN = '';
const KONIEC = Date.parse('2026-11-30T23:59:59+01:00');

export const GET: APIRoute = ({ url }) => {
  const q = new URLSearchParams({ plan: PLAN, utm_source: url.searchParams.get('utm_source') || 'mailerlite', utm_medium: url.searchParams.get('utm_medium') || 'email', utm_campaign: 'druk-49', utm_content: url.searchParams.get('utm_content') || 'ps' });
  const dokad = (!PLAN || Date.now() > KONIEC) ? '/ksiazka/?utm_source=druk-49&utm_campaign=druk-49-po-terminie' : `${CEL}?${q}`;
  return new Response(null, { status: 302, headers: { Location: dokad, 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
};
