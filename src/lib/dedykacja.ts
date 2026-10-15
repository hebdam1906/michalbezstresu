// ============================================================================
// ✍️ src/lib/dedykacja.ts — strona dedykacji w PDF „Z obu stron stołu”
// ----------------------------------------------------------------------------
// 15.10.2026. Wstawia stronę dedykacji przed stroną tytułową (po okładce).
// Tekst: Klaudiusz, zatwierdził Michał 15.10. Forma z imieniem w mianowniku
// („Aleksandra, dziękuję…”) — decyzja Michała 15.10, bez odmiany imion.
// Pliki (PDF final, podpis PNG, Lora) leżą w PRYWATNYM buckecie Supabase
// `ksiazka-prywatne` — PDF jest produktem płatnym, nie może trafić do repo.
// ============================================================================
import { PDFDocument, rgb, type PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { supabaseAdmin } from './supabase';

const TEKST1 = 'Dziękuję za zaufanie od pierwszego dnia — zanim ktokolwiek wiedział, czy ta książka w ogóle powstanie.';
const TEKST2 = 'Niech żadna rozmowa przy stole już Cię nie zaskoczy.';
const PODPIS_LINIA = 'Michał Hebda, listopad 2026';

/** Pierwszy wyraz, wielka litera; >20 znaków albo cyfry → null („Dla Ciebie”). */
export function normalizujImie(raw: unknown): string | null {
  const w = String(raw ?? '').trim().split(/\s+/)[0] || '';
  if (!w || w.length > 20 || /\d/.test(w) || /[<>{}@/\\]/.test(w)) return null;
  return w.charAt(0).toLocaleUpperCase('pl-PL') + w.slice(1);
}

function zawin(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const out: string[] = []; let line = '';
  for (const w of text.split(' ')) {
    const t = line ? line + ' ' + w : w;
    if (font.widthOfTextAtSize(t, size) > maxW && line) { out.push(line); line = w; } else line = t;
  }
  if (line) out.push(line);
  // polska typografia: jednoliterowe spójniki/przyimki nie zostają na końcu wiersza
  for (let i = 0; i < out.length - 1; i++) {
    const m = out[i].match(/^(.*) ([a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ])$/);
    if (m) { out[i] = m[1]; out[i + 1] = m[2] + ' ' + out[i + 1]; }
  }
  return out;
}

function zawinRowno(text: string, font: PDFFont, size: number, minW: number, maxW: number): string[] {
  let best: { l: string[]; score: number } | null = null;
  for (let w = minW; w <= maxW; w += 4) {
    const l = zawin(text, font, size, w);
    const sz = l.map((x) => font.widthOfTextAtSize(x, size));
    const score = l.length * 10000 + (Math.max(...sz) - Math.min(...sz));
    if (!best || score < best.score) best = { l, score };
  }
  return best!.l;
}

let cache: { baza: Uint8Array; podpis: Uint8Array; reg: Uint8Array; it: Uint8Array } | null = null;

async function pobierzPliki() {
  if (cache) return cache;
  if (!supabaseAdmin) throw new Error('brak Supabase');
  const get = async (p: string) => {
    const { data, error } = await supabaseAdmin!.storage.from('ksiazka-prywatne').download(p);
    if (error || !data) throw new Error(`brak pliku ${p}`);
    return new Uint8Array(await data.arrayBuffer());
  };
  const [baza, podpis, reg, it] = await Promise.all([
    get('ksiazka-final.pdf'), get('podpis.png'), get('Lora-Regular.ttf'), get('Lora-Italic.ttf'),
  ]);
  cache = { baza, podpis, reg, it };
  return cache;
}

export async function pdfZDedykacja(imie: string | null): Promise<Uint8Array> {
  const f = await pobierzPliki();
  const doc = await PDFDocument.load(f.baza);
  doc.registerFontkit(fontkit);
  const reg = await doc.embedFont(f.reg, { subset: true });
  const it = await doc.embedFont(f.it, { subset: true });
  const png = await doc.embedPng(f.podpis);
  const W = 419.53, H = 595.28, mm = 2.8346;
  const page = doc.insertPage(1, [W, H]);
  const ink = rgb(0.114, 0.141, 0.133), green = rgb(0.18, 0.42, 0.365), grey = rgb(0.35, 0.4, 0.38);
  const size = 13, lh = size * 1.55;
  const naglowek = imie ? `${imie},` : 'Dla Ciebie';
  const t1 = imie ? TEKST1.charAt(0).toLowerCase() + TEKST1.slice(1) : TEKST1;
  const b1 = zawinRowno(t1, reg, size, 80 * mm, 112 * mm);
  const b2 = zawinRowno(TEKST2, reg, size, 80 * mm, 112 * mm);
  const sigW = 45 * mm, sigH = (sigW * png.height) / png.width;
  const blokH = 22 + 18 + b1.length * lh + 12 + b2.length * lh + 22 + sigH + 6 + 12;
  let y = H / 2 + blokH / 2;
  const center = (t: string, font: PDFFont, s: number, c: ReturnType<typeof rgb>) => {
    const w = font.widthOfTextAtSize(t, s);
    page.drawText(t, { x: (W - w) / 2, y, size: s, font, color: c });
  };
  y -= 20; center(naglowek, it, 20, green); y -= 18 + lh;
  for (const l of b1) { center(l, reg, size, ink); y -= lh; }
  y -= 12;
  for (const l of b2) { center(l, reg, size, ink); y -= lh; }
  y -= 22 - lh + sigH;
  page.drawImage(png, { x: (W - sigW) / 2, y, width: sigW, height: sigH });
  y -= 16; center(PODPIS_LINIA, it, 10, grey);
  doc.setSubject(`Egzemplarz z dedykacją${imie ? ' dla ' + imie : ''}`);
  return await doc.save();
}
