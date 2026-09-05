// Kontrola spójności: kanał YouTube ↔ src/data/odcinki.js
//
// Powód powstania: odcinek #4 (10.08) i #7 (31.08) wyszły na YouTube, a na stronie
// ich nie było — krok „nowy odcinek = nowy obiekt w odcinki.js" wypada w dniu premiery,
// bo uwaga idzie na YouTube i Spotify. To jest czujnik, nie naprawa pamięci.
//
// Sukces = cisza (kod 0). Rozjazd = kod 1 i lista brakujących filmów.
// Uruchamiane codziennie przez .github/workflows/kontrola-odcinkow.yml
// Lokalnie:  node scripts/sprawdz-odcinki.mjs

import { readFile } from 'node:fs/promises';

const CHANNEL_ID = process.env.YT_CHANNEL_ID || 'UC7-aC7WTFMbFrmUVLn7DdRw';
const PLIK_ODCINKI = 'src/data/odcinki.js';
const ILE_ODCINKOW = 3; // ostatnie N PEŁNYCH odcinków (shorty nie zajmują miejsc)
const MAX_SEKUND_SHORT = 180; // YouTube: short to film do 3 minut
const ILE_SPRAWDZIC = 15; // ile najnowszych wpisów RSS w ogóle oglądamy

const rss = await fetch(
  `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
).then((r) => {
  if (!r.ok) throw new Error(`RSS YouTube zwrócił ${r.status}`);
  return r.text();
});

const wpisy = [...rss.matchAll(
  /<yt:videoId>(.*?)<\/yt:videoId>[\s\S]*?<title>(.*?)<\/title>/g
)].map(([, id, tytul]) => ({ id, tytul }));

if (wpisy.length === 0) {
  console.error('RSS nie zwrócił żadnych filmów — sprawdź YT_CHANNEL_ID.');
  process.exit(2);
}

// Długość filmu, nie tytuł. 3.09 short „Jedno pytanie do szefa…" wyszedł bez
// #shorts w tytule i kontrola zgłosiła go jako brakujący odcinek — fałszywy alarm.
// Konwencja w tytule bywa zapomniana, długość nie kłamie.
async function dlugoscSekund(id) {
  const html = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: { 'Accept-Language': 'pl' },
  }).then((r) => (r.ok ? r.text() : ''));
  const m = html.match(/"lengthSeconds":"(\d+)"/);
  return m ? Number(m[1]) : null;
}

// Shorty odfiltrowujemy PRZED obcięciem do N. Inaczej trzy shorty tygodniowo
// wypychają odcinek poza okno i kontrola przechodzi, nie sprawdziwszy niczego.
const odcinki = [];
for (const f of wpisy.slice(0, ILE_SPRAWDZIC)) {
  if (odcinki.length >= ILE_ODCINKOW) break;
  if (/#short|shorts/i.test(f.tytul)) continue; // tanio: tytuł mówi wprost
  const sek = await dlugoscSekund(f.id);
  // sek === null → nie udało się odczytać długości; wtedy lepiej sprawdzić
  // film niż go przeoczyć (fałszywy alarm jest tańszy niż odcinek bez strony).
  if (sek !== null && sek <= MAX_SEKUND_SHORT) continue;
  odcinki.push({ ...f, sek });
}

if (odcinki.length === 0) {
  console.error('Wśród najnowszych filmów nie ma ani jednego pełnego odcinka — sprawdź kanał.');
  process.exit(2);
}

const zrodlo = await readFile(PLIK_ODCINKI, 'utf8');
const brakujace = odcinki.filter((f) => !zrodlo.includes(f.id));

if (brakujace.length === 0) {
  console.log(`OK — ostatnie ${odcinki.length} odcinków jest w ${PLIK_ODCINKI}`);
  process.exit(0);
}

console.error('\n⚠️  ODCINKI NIEOBECNE NA STRONIE:\n');
for (const f of brakujace) {
  console.error(`  • ${f.tytul}${f.sek ? ` (${f.sek}s)` : ''}`);
  console.error(`    https://youtu.be/${f.id}\n`);
}
console.error(`Dodaj brakujące obiekty na górze listy w ${PLIK_ODCINKI} i wypchnij zmianę.`);
console.error('Pola: nr, data, tytul, opis, yt, spotify.');
process.exit(1);
