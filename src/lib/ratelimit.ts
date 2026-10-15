// ============================================================================
// 🚦 src/lib/ratelimit.ts — limit żądań na IP dla formularzy i logowania panelu
// ----------------------------------------------------------------------------
// 15.10.2026 (brief Klaudiusza „bezpieczeństwo strony”). Licznik w Supabase:
// funkcja rl_hit() + tabela rate_limit (RLS, wykonuje tylko service_role).
// Okno stałe, domyślnie 5 żądań / 60 s / IP na trasę. IP tylko jako hash.
// Fail-open: jeśli Supabase nie odpowie, NIE blokujemy człowieka — wtedy
// zostają dotychczasowe zabezpieczenia (pułapka na boty, limity w trasach).
// ============================================================================
import { createHash } from 'node:crypto';
import { supabaseAdmin } from './supabase';

const hash = (s: string) => createHash('sha256').update(`mbs-rl:${s}`).digest('hex').slice(0, 32);

export async function przepusc(trasa: string, ip: string | undefined, max = 5, oknoS = 60): Promise<boolean> {
  if (!supabaseAdmin) return true;
  try {
    const { data, error } = await supabaseAdmin.rpc('rl_hit', {
      p_klucz: `${trasa}:${hash(ip || 'brak')}`, p_limit: max, p_okno_s: oknoS,
    });
    if (error) return true;
    return data !== false;
  } catch {
    return true;
  }
}

export const zaDuzo = (msg = 'Za dużo prób w krótkim czasie. Odczekaj minutę i spróbuj ponownie. · Too many attempts — please wait a minute.') =>
  new Response(JSON.stringify({ error: msg }), {
    status: 429,
    headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
  });
