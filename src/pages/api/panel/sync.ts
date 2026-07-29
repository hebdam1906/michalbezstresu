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

// ────────────────────────────────────────────────────────────────────────────
async function uruchom(): Promise<{ wyniki: Wynik[] }> {
  const db = supabaseAdmin!;
  const zadania: Array<[string, () => Promise<Wynik>]> = [
    ['newsletter', () => syncMailerLite(db)],
    ['yt', () => syncYouTube(db)],
    ['fb', () => syncFacebook(db)],
    ['ig', () => syncInstagram(db)],
    ['tt', () => syncTikTok()],
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
