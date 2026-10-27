// ============================================================================
// 🛡️ /api/csp-report — odbiór raportów Content-Security-Policy-Report-Only
// ----------------------------------------------------------------------------
// 15.10.2026. CSP od 27.10.2026 wymuszane (wcześniej Report-Only).
// Raporty lądują w logach Vercel (Runtime Logs, szukaj „CSP-REPORT”). Po tygodniu
// bez istotnych raportów przełączamy nagłówek na egzekwowanie (vercel.json).
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { przepusc } from '../../lib/ratelimit';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!(await przepusc('csp-report', clientAddress, 20))) return new Response(null, { status: 204 });
  try {
    const t = (await request.text()).slice(0, 4000);
    const r = JSON.parse(t)?.['csp-report'] ?? {};
    console.warn('CSP-REPORT', JSON.stringify({
      strona: r['document-uri'], dyrektywa: r['violated-directive'] || r['effective-directive'], zablokowane: r['blocked-uri'],
    }));
  } catch { /* ignorujemy śmieci */ }
  return new Response(null, { status: 204 });
};
