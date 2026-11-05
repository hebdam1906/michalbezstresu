// ============================================================================
// 📝 /api/ankieta — ankieta po live 5.11 (/ankieta), brief Klaudiusza 5.11
// ----------------------------------------------------------------------------
// Odpowiedzi 1–6 ZAWSZE do Supabase `ankieta_live` (także bez e-maila).
// Z e-mailem: MailerLite, grupa „Ankieta-live-5-11” (203295410236688220),
// pola ocena_temat, ocena_prowadzenie, strona, temat_nastepny (bez odpowiedzi
// otwartych). Automat w MailerLite wysyła mail „Twoja cena: 39 zł do 22.11”.
// ============================================================================
export const prerender = false;

import type { APIRoute } from 'astro';
import { przepusc, zaDuzo } from '../../lib/ratelimit';
import { supabaseAdmin } from '../../lib/supabase';

const GRUPA = '203295410236688220';
const KLUCZ_ML = import.meta.env.MAILERLITE_API_KEY;
const STRONY = ['pracownik', 'menedzer', 'hr', 'inne'];
const TEMATY = ['ocena', 'pip', 'awans', 'odejscie', 'zespol', 'inny'];

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });
const t = (v: unknown, max: number) => { const s = String(v ?? '').trim().slice(0, max); return s || null; };
const ocena = (v: unknown) => { const n = Number(v); return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null; };

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!(await przepusc('ankieta', clientAddress))) return zaDuzo();
  let b: any;
  try { b = await request.json(); } catch { return json({ error: 'Nieprawidłowe dane.' }, 400); }
  if (t(b.www, 200)) return json({ ok: true }); // bot

  const w = {
    ocena_temat: ocena(b.ocena_temat),
    ocena_prowadzenie: ocena(b.ocena_prowadzenie),
    strona: STRONY.includes(b.strona) ? b.strona : null,
    przydatne: t(b.przydatne, 1500),
    zmienic: t(b.zmienic, 1500),
    temat_nastepny: TEMATY.includes(b.temat_nastepny) ? b.temat_nastepny : null,
    temat_inny: t(b.temat_inny, 300),
  };
  if (!w.ocena_temat || !w.ocena_prowadzenie || !w.strona || !w.temat_nastepny)
    return json({ error: 'Odpowiedz na pytania 1, 2, 3 i 6.' }, 400);

  const email = (t(b.email, 160) || '').toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: 'Sprawdź adres e-mail.' }, 400);
  const imie = t(b.imie, 80);
  const u = b.utm && typeof b.utm === 'object' ? b.utm : {};

  let zapisano = false;
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.from('ankieta_live').insert({
      ...w, email: email || null, imie,
      utm_source: t(u.source, 120), utm_medium: t(u.medium, 120), utm_campaign: t(u.campaign, 120),
    });
    zapisano = !error;
  }

  if (email && KLUCZ_ML) {
    const fields: Record<string, string | number> = {
      ocena_temat: w.ocena_temat, ocena_prowadzenie: w.ocena_prowadzenie, strona: w.strona,
      temat_nastepny: w.temat_nastepny === 'inny' && w.temat_inny ? `inny: ${w.temat_inny}` : w.temat_nastepny,
    };
    if (imie) fields.name = imie;
    try {
      const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${KLUCZ_ML}` },
        body: JSON.stringify({ email, fields, groups: [GRUPA] }),
      });
      if (!r.ok && !zapisano) return json({ error: 'Nie udało się wysłać. Spróbuj jeszcze raz.' }, 502);
    } catch { if (!zapisano) return json({ error: 'Nie udało się wysłać. Spróbuj jeszcze raz.' }, 502); }
  } else if (!zapisano) {
    return json({ error: 'Nie udało się wysłać. Spróbuj jeszcze raz.' }, 502);
  }
  return json({ ok: true });
};
