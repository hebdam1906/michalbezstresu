// 🔄 /api/panel/sync — automatyczne pobranie statystyk z API platform
//
// GET  → uruchamiany przez Vercel Cron (nagłówek `Authorization: Bearer $CRON_SECRET`)
// POST → uruchomienie ręczne z panelu (cookie) albo przez Klaudiusza (PANEL_API_KEY)
//
// Każda platforma leci w osobnym try/catch — padnięcie jednej nie psuje reszty.
// Wynik każdej próby ląduje w panel_sync_log, żeby było widać, czy automat żyje.
//
// ŹRÓDŁA:
//   newsletter → MailerLite API      (MAILERLITE_API_KEY)
//   yt         → YouTube Data API v3 (YOUTUBE_API_KEY + YOUTUBE_CHANNEL_ID)
//   fb, ig     → Meta Graph API      (META_ACCESS_TOKEN + FB_PAGE_ID / IG_USER_ID)
//   tt         → BRAK publicznego API dla własnych statystyk bez zatwierdzonej
//                aplikacji TikTok for Developers → wpis ręczny w panelu.
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';
import { isAuthorized } from '../../../lib/panel-auth';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

const DZIS = () => new Date().toISOString().slice(0, 10);
const GRAPH = 'https://graph.facebook.com/v21.0';

type Wynik = { platforma: string; status: 'ok' | 'blad' | 'pominieto'; szczegoly: string };

/** fetch + JSON z czytelnym błędem zamiast gołego `undefined`. */
async function pobierz(url: string, opcje?: RequestInit): Promise<any> {
  const r = await fetch(url, opcje);
  const tekst = await r.text();
  let dane: any;
  try { dane = JSON.parse(tekst); } catch { throw new Error(`niepoprawny JSON (HTTP ${r.status})`); }
  if (!r.ok) {
    const msg = dane?.error?.message || dane?.message || `HTTP ${r.status}`;
    throw new Error(String(msg).slice(0, 300));
  }
  return dane;
}

/**
 * Liczba aktywnych subskrybentów MailerLite.
 *
 * ⚠️ `GET /api/subscribers` używa kursorowej paginacji i **nie zwraca `meta.total`**
 * (meta ma tylko path, per_page, next_cursor, prev_cursor). Wcześniejsza wersja
 * czytała `meta.total` i zawsze dostawała 0.
 * Liczbę daje osobny wariant: `?limit=0` → `{ "total": N }` w korzeniu odpowiedzi.
 * Gdyby MailerLite kiedyś zmienił kształt odpowiedzi, liczymy stronicowaniem.
 */
async function policzSubskrybentow(key: string): Promise<number> {
  const naglowki = { Authorization: `Bearer ${key}`, Accept: 'application/json' };

  const d = await pobierz(
    'https://connect.mailerlite.com/api/subscribers?limit=0&filter[status]=active',
    { headers: naglowki },
  );
  const total = Number(d?.total ?? d?.meta?.total ?? NaN);
  if (Number.isFinite(total)) return total;

  // fallback: przejście po stronach (przy naszej skali to jedno zapytanie)
  let razem = 0;
  let url = 'https://connect.mailerlite.com/api/subscribers?limit=500&filter[status]=active';
  for (let strona = 0; strona < 40; strona++) {
    const s = await pobierz(url, { headers: naglowki });
    razem += (s?.data ?? []).length;
    const kursor = s?.meta?.next_cursor;
    if (!kursor) break;
    url = `https://connect.mailerlite.com/api/subscribers?limit=500&filter[status]=active&cursor=${encodeURIComponent(kursor)}`;
  }
  return razem;
}

// ── MAILERLITE ──────────────────────────────────────────────────────────────
// Zapisuje snapshot do panel_metryki oraz — dla ciągłości z Etapem 3 —
// dopisuje wpis do istniejącej tabeli panel_lejek.
async function syncMailerLite(db: NonNullable<typeof supabaseAdmin>): Promise<Wynik> {
  const key = process.env.MAILERLITE_API_KEY;
  if (!key) return { platforma: 'newsletter', status: 'pominieto', szczegoly: 'brak MAILERLITE_API_KEY' };

  const razem = await policzSubskrybentow(key);

  await db.from('panel_metryki').upsert(
    { data: DZIS(), platforma: 'newsletter', obserwujacy: razem, zrodlo: 'api' },
    { onConflict: 'data,platforma' },
  );

  // przyrost względem ostatniego wpisu w lejku
  const { data: ostatni } = await db
    .from('panel_lejek').select('subskrybenci,data').order('data', { ascending: false }).limit(1);
  const poprzednio = ostatni?.[0]?.subskrybenci ?? 0;
  if (ostatni?.[0]?.data !== DZIS()) {
    await db.from('panel_lejek').insert({
      data: DZIS(), subskrybenci: razem, nowi: razem - poprzednio, notatka: 'auto (MailerLite)',
    });
  }

  return { platforma: 'newsletter', status: 'ok', szczegoly: `${razem} aktywnych subskrybentów` };
}

// ── YOUTUBE ─────────────────────────────────────────────────────────────────
// Kanał (subskrybenci, wyświetlenia, liczba filmów) + statystyki 50 ostatnich filmów.
async function syncYouTube(db: NonNullable<typeof supabaseAdmin>): Promise<Wynik> {
  const key = process.env.YOUTUBE_API_KEY;
  const kanal = process.env.YOUTUBE_CHANNEL_ID;
  if (!key || !kanal)
    return { platforma: 'yt', status: 'pominieto', szczegoly: 'brak YOUTUBE_API_KEY / YOUTUBE_CHANNEL_ID' };

  const kan = await pobierz(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${kanal}&key=${key}`,
  );
  const item = kan?.items?.[0];
  if (!item) throw new Error('kanał nie znaleziony — sprawdź YOUTUBE_CHANNEL_ID');

  const st = item.statistics ?? {};
  await db.from('panel_metryki').upsert(
    {
      data: DZIS(), platforma: 'yt',
      obserwujacy: Number(st.subscriberCount ?? 0),
      wyswietlenia_28: Number(st.viewCount ?? 0),   // API daje total, nie 28 dni
      materialy: Number(st.videoCount ?? 0),
      zrodlo: 'api',
    },
    { onConflict: 'data,platforma' },
  );

  // filmy z playlisty „uploads"
  const uploads = item?.contentDetails?.relatedPlaylists?.uploads;
  let filmy = 0;
  if (uploads) {
    const lista = await pobierz(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}&key=${key}`,
    );
    const ids: string[] = (lista?.items ?? [])
      .map((i: any) => i?.contentDetails?.videoId).filter(Boolean);

    if (ids.length) {
      const vid = await pobierz(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids.join(',')}&key=${key}`,
      );
      const wiersze = (vid?.items ?? []).map((v: any) => ({
        tytul: String(v?.snippet?.title ?? '(bez tytułu)').slice(0, 300),
        platforma: 'yt',
        data_pub: v?.snippet?.publishedAt ? String(v.snippet.publishedAt).slice(0, 10) : null,
        wyswietlenia: Number(v?.statistics?.viewCount ?? 0),
        polubienia: Number(v?.statistics?.likeCount ?? 0),
        komentarze: Number(v?.statistics?.commentCount ?? 0),
        link: `https://www.youtube.com/watch?v=${v.id}`,
        external_id: v.id,
        zrodlo: 'api',
        zaktualizowano: new Date().toISOString(),
      }));
      if (wiersze.length) {
        // ⚠️ bez sprawdzenia `error` upsert potrafi cicho nie zapisać nic,
        // a log i tak pokazuje „N filmów" — tak było przy indeksie częściowym.
        const { error } = await db
          .from('panel_materialy').upsert(wiersze, { onConflict: 'platforma,external_id' });
        if (error) throw new Error(`zapis materiałów: ${error.message}`);
        filmy = wiersze.length;
      }
    }
  }

  return { platforma: 'yt', status: 'ok', szczegoly: `${st.subscriberCount ?? 0} subskrybentów, ${filmy} filmów` };
}

// ── FACEBOOK (Page) ─────────────────────────────────────────────────────────
async function syncFacebook(db: NonNullable<typeof supabaseAdmin>): Promise<Wynik> {
  const token = process.env.META_ACCESS_TOKEN;
  const page = process.env.FB_PAGE_ID;
  if (!token || !page)
    return { platforma: 'fb', status: 'pominieto', szczegoly: 'brak META_ACCESS_TOKEN / FB_PAGE_ID' };

  const d = await pobierz(`${GRAPH}/${page}?fields=followers_count,fan_count&access_token=${token}`);

  let zasieg28 = 0;
  try {
    const ins = await pobierz(
      `${GRAPH}/${page}/insights/page_impressions_unique?period=days_28&access_token=${token}`,
    );
    zasieg28 = Number(ins?.data?.[0]?.values?.at(-1)?.value ?? 0);
  } catch { /* insights bywają puste dla świeżych stron — nie przerywamy */ }

  await db.from('panel_metryki').upsert(
    {
      data: DZIS(), platforma: 'fb',
      obserwujacy: Number(d?.followers_count ?? d?.fan_count ?? 0),
      wyswietlenia_28: zasieg28,
      zrodlo: 'api',
    },
    { onConflict: 'data,platforma' },
  );

  return { platforma: 'fb', status: 'ok', szczegoly: `${d?.followers_count ?? 0} obserwujących` };
}

// ── INSTAGRAM (konto biznesowe/twórcy) ──────────────────────────────────────
async function syncInstagram(db: NonNullable<typeof supabaseAdmin>): Promise<Wynik> {
  const token = process.env.META_ACCESS_TOKEN;
  const ig = process.env.IG_USER_ID;
  if (!token || !ig)
    return { platforma: 'ig', status: 'pominieto', szczegoly: 'brak META_ACCESS_TOKEN / IG_USER_ID' };

  const d = await pobierz(`${GRAPH}/${ig}?fields=followers_count,media_count&access_token=${token}`);

  await db.from('panel_metryki').upsert(
    {
      data: DZIS(), platforma: 'ig',
      obserwujacy: Number(d?.followers_count ?? 0),
      materialy: Number(d?.media_count ?? 0),
      zrodlo: 'api',
    },
    { onConflict: 'data,platforma' },
  );

  // ostatnie 25 postów/reelsów
  let posty = 0;
  try {
    const media = await pobierz(
      `${GRAPH}/${ig}/media?fields=id,caption,timestamp,permalink,like_count,comments_count,media_product_type&limit=25&access_token=${token}`,
    );
    const wiersze = (media?.data ?? []).map((m: any) => ({
      tytul: String(m?.caption ?? m?.media_product_type ?? 'post').replace(/\s+/g, ' ').slice(0, 120),
      platforma: 'ig',
      data_pub: m?.timestamp ? String(m.timestamp).slice(0, 10) : null,
      polubienia: Number(m?.like_count ?? 0),
      komentarze: Number(m?.comments_count ?? 0),
      link: m?.permalink ?? null,
      external_id: m?.id,
      zrodlo: 'api',
      zaktualizowano: new Date().toISOString(),
    }));
    if (wiersze.length) {
      const { error } = await db
        .from('panel_materialy').upsert(wiersze, { onConflict: 'platforma,external_id' });
      if (error) throw new Error(`zapis materiałów: ${error.message}`);
      posty = wiersze.length;
    }
  } catch { /* brak uprawnień do media — snapshot i tak zapisany */ }

  return { platforma: 'ig', status: 'ok', szczegoly: `${d?.followers_count ?? 0} obserwujących, ${posty} postów` };
}

// ── TIKTOK ──────────────────────────────────────────────────────────────────
async function syncTikTok(): Promise<Wynik> {
  return {
    platforma: 'tt',
    status: 'pominieto',
    szczegoly: 'brak publicznego API dla własnych statystyk — wpis ręczny w panelu',
  };
}

// ── RUCH NA STRONIE (Vercel Web Analytics) ──────────────────────────────────
// Panel czyta tabelę `panel_ruch`. Do 19.09.2026 NIKT jej nie zapisywał — ten
// cron uzupełniał tylko panel_metryki / panel_lejek / panel_materialy — więc
// kafelek „Ruch na stronie" i cały lejek pokazywały zera. Dane cały czas były,
// tyle że wyłącznie w Vercel Web Analytics. To jest ten brakujący most.
//
// API: https://vercel.com/docs/analytics/web-analytics-api
//   ANALYTICS_TOKEN      — Vercel → Account Settings → Tokens
//   ANALYTICS_PROJECT_ID — Project → Settings → General → Project ID (prj_…)
//   ANALYTICS_TEAM_ID    — Project → Settings → General → Team ID (team_…)
//
// ⚠️ Prefiks `VERCEL_` jest zarezerwowany dla zmiennych systemowych Vercela —
// własnej zmiennej o takiej nazwie nie da się tam założyć. Stąd `ANALYTICS_`.
//
// „Zapisy" liczymy jako odwiedzających `/dziekuje` — to jedyna strona,
// na którą wchodzi się wyłącznie po zapisaniu się na checklistę.
const VA = 'https://api.vercel.com/v1/query/web-analytics/visits/aggregate';

async function vercelRuch(
  token: string,
  projekt: string,
  zespol: string | undefined,
  by: string[],
  od: string,
  doDnia: string,
  filtr?: string,
): Promise<any[]> {
  const q = new URLSearchParams({ projectId: projekt, since: od, until: doDnia, limit: '100' });
  by.forEach((b) => q.append('by', b));
  if (zespol) q.set('teamId', zespol);
  if (filtr) q.set('filter', filtr);
  const d = await pobierz(`${VA}?${q.toString()}`, { headers: { Authorization: `Bearer ${token}` } });
  return Array.isArray(d?.data) ? d.data : [];
}

/**
 * Przy grupowaniu po czasie API zwraca datę w polu `timestamp`
 * (np. "2026-09-18T00:00:00Z" — schemat odpowiedzi w dokumentacji Vercela).
 * Pozostałe nazwy to zabezpieczenie na wypadek zmiany wersji API.
 */
const dzienZ = (r: any): string | null => {
  const v = r?.timestamp ?? r?.day ?? r?.date ?? r?.key ?? null;
  if (typeof v === 'number') return new Date(v).toISOString().slice(0, 10);
  return typeof v === 'string' ? v.slice(0, 10) : null;
};
const osobyZ = (r: any): number => Number(r?.visitors ?? r?.count ?? 0) || 0;

async function syncRuch(db: NonNullable<typeof supabaseAdmin>): Promise<Wynik> {
  // Zmienne w Vercelu założone 19.09 jako `Vercel_token` / `Vercel_project_id` /
  // `Vercel_Team_ID` (prefiks VERCEL_ wielkimi literami jest zarezerwowany),
  // a Vercel nie pozwala zmienić nazwy zmiennej typu Secret. Czytamy więc
  // najpierw docelowe ANALYTICS_*, potem nazwy, które faktycznie istnieją.
  const env = process.env;
  const token = env.ANALYTICS_TOKEN ?? env.Vercel_token;
  const projekt = env.ANALYTICS_PROJECT_ID ?? env.Vercel_project_id;
  const zespol = env.ANALYTICS_TEAM_ID ?? env.Vercel_Team_ID;
  if (!token || !projekt)
    return { platforma: 'ruch', status: 'pominieto', szczegoly: 'brak ANALYTICS_TOKEN / ANALYTICS_PROJECT_ID' };

  // 8 dni wstecz: bieżąca doba jest niepełna, więc nadpisujemy ją przy każdym biegu
  const dzien = (ile: number) => new Date(Date.now() - ile * 86400000).toISOString().slice(0, 10);
  const od = dzien(8);
  const doDnia = dzien(0);

  const [wizytyD, zapisyD, zrodlaD] = await Promise.all([
    vercelRuch(token, projekt, zespol, ['day'], od, doDnia),
    vercelRuch(token, projekt, zespol, ['day'], od, doDnia, "requestPath eq '/dziekuje'"),
    vercelRuch(token, projekt, zespol, ['day', 'referrerHostname'], od, doDnia),
  ]);

  const zapisyWg = new Map<string, number>();
  zapisyD.forEach((r) => {
    const d = dzienZ(r);
    if (d) zapisyWg.set(d, osobyZ(r));
  });

  const zrodlaWg = new Map<string, Record<string, number>>();
  zrodlaD.forEach((r) => {
    const d = dzienZ(r);
    if (!d) return;
    const host = String(r?.referrerHostname ?? r?.referrer ?? '').trim() || 'wejscia-bezposrednie';
    const m = zrodlaWg.get(d) ?? {};
    m[host] = (m[host] ?? 0) + osobyZ(r);
    zrodlaWg.set(d, m);
  });

  const wiersze = wizytyD
    .map((r) => {
      const d = dzienZ(r);
      if (!d) return null;
      return {
        data: d,
        wizyty: osobyZ(r),
        zapisy: zapisyWg.get(d) ?? 0,
        zrodla: zrodlaWg.get(d) ?? {},
        zrodlo: 'api',
      };
    })
    .filter((w): w is NonNullable<typeof w> => w !== null);

  if (!wiersze.length) {
    // Zamiast zgadywać: w logu ląduje liczba wierszy i nazwy pól z pierwszego.
    const pola = wizytyD[0] ? Object.keys(wizytyD[0]).join(',') : '—';
    return {
      platforma: 'ruch',
      status: 'blad',
      szczegoly: `API zwrocilo ${wizytyD.length} wierszy bez rozpoznanej daty; pola: ${pola}`.slice(0, 300),
    };
  }

  const { error } = await db.from('panel_ruch').upsert(wiersze, { onConflict: 'data' });
  if (error) throw new Error(error.message);

  const suma = wiersze.reduce((s, w) => s + w.wizyty, 0);
  const zap = wiersze.reduce((s, w) => s + w.zapisy, 0);
  return { platforma: 'ruch', status: 'ok', szczegoly: `${wiersze.length} dni, ${suma} wizyt, ${zap} zapisow` };
}

// ────────────────────────────────────────────────────────────────────────────
async function uruchom(): Promise<{ wyniki: Wynik[] }> {
  const db = supabaseAdmin!;
  const zadania: Array<[string, () => Promise<Wynik>]> = [
    ['newsletter', () => syncMailerLite(db)],
    ['yt', () => syncYouTube(db)],
    ['fb', () => syncFacebook(db)],
    ['ig', () => syncInstagram(db)],
    ['tt', () => syncTikTok()],
    ['ruch', () => syncRuch(db)],
  ];

  const wyniki: Wynik[] = [];
  for (const [platforma, fn] of zadania) {
    try {
      wyniki.push(await fn());
    } catch (e: any) {
      wyniki.push({ platforma, status: 'blad', szczegoly: String(e?.message ?? e).slice(0, 300) });
    }
  }

  await db.from('panel_sync_log').insert(
    wyniki.map((w) => ({ platforma: w.platforma, status: w.status, szczegoly: w.szczegoly })),
  );

  return { wyniki };
}

/** Cron Vercela przychodzi jako GET z `Authorization: Bearer $CRON_SECRET`. */
function toCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

export const GET: APIRoute = async ({ request, cookies }) => {
  if (!toCron(request) && !isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  return json({ ok: true, ...(await uruchom()) });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!toCron(request) && !isAuthorized(request, cookies).ok) return json({ error: 'Unauthorized' }, 401);
  if (!supabaseAdmin) return json({ error: 'Brak konfiguracji Supabase' }, 500);
  return json({ ok: true, ...(await uruchom()) });
};
