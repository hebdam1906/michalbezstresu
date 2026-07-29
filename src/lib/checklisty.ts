// ✅ Checklisty produkcyjne — szablony punktów do odklikania przy każdej publikacji.
//
// DLACZEGO TO ISTNIEJE: `Checklista-montazowa.md` opisuje standardy serii, ale ma
// 74 linijki i przy montażu nikt jej nie otwiera. 29.07 odcinek #3 poszedł do eksportu
// BEZ planszy końcowej CTA — mimo że ten punkt był w tamtym dokumencie. Dokument do
// czytania ≠ kontrola. Te listy są krótkie i widoczne w panelu przy materiale.
//
// Punkt `krytyczny: true` blokuje ustawienie statusu „opublikowane" w panelu.

export type Etap = 'produkcja' | 'publikacja';

export type PunktChecklisty = {
  klucz: string;
  tekst: string;
  etap: Etap;
  krytyczny?: boolean;
  /** skąd wiadomo, że punkt jest spełniony — podpowiedź pod tekstem */
  jak?: string;
};

// ── ODCINEK (YouTube long-form) ─────────────────────────────────────────────
const ODCINEK: PunktChecklisty[] = [
  { klucz: 'bloki_przyciete', tekst: 'Rozbiegi przycięte na starcie każdego bloku', etap: 'produkcja',
    jak: 'Bloki mają 8–15 s „siadania" — punkty cięcia z VAD, nie z poziomu głośności' },
  { klucz: 'plansze_srodtyt', tekst: 'Plansze śródtytułowe między sekcjami', etap: 'produkcja', krytyczny: true,
    jak: 'Standard serii od odc. #3 (decyzja Klaudiusza, update-05)' },
  { klucz: 'napisy_wypalone', tekst: 'Napisy wypalone i sprawdzone pod kątem przekłamań', etap: 'produkcja', krytyczny: true,
    jak: 'Transkrypcja automatyczna myli terminy (mobbing, PIP, checklista) — porównać ze scenariuszem' },
  { klucz: 'plansza_koncowa', tekst: 'Plansza końcowa CTA (4,5 s) z linkiem do checklisty', etap: 'produkcja', krytyczny: true,
    jak: 'To ten punkt umknął w odc. #3. Generator: Scenki/Odcinek N/_robocze/gen-plansza-koniec.py' },
  { klucz: 'audio_loudnorm', tekst: 'Dźwięk wyrównany do −14 LUFS', etap: 'produkcja',
    jak: 'Surówka bywa cicha (~−32 LUFS). Sprawdzić: ffmpeg loudnorm print_format=json' },
  { klucz: 'miniatura', tekst: 'Miniatura gotowa', etap: 'produkcja',
    jak: 'Miniatury YT/gen-miniatury.py — sprawdź, czy wpis dla tego odcinka już nie istnieje' },

  { klucz: 'opis_rozdzialy', tekst: 'Opis z rozdziałami liczonymi z gotowego pliku', etap: 'publikacja', krytyczny: true,
    jak: 'Timestampy z finalnego montażu, nie z planu' },
  { klucz: 'link_pierwsza_linia', tekst: 'Link do checklisty w PIERWSZEJ linii opisu', etap: 'publikacja', krytyczny: true },
  { klucz: 'tagi', tekst: 'Tagi wklejone', etap: 'publikacja' },
  { klucz: 'ai_nie', tekst: 'Wykorzystanie AI: NIE · Film dla dzieci: NIE', etap: 'publikacja' },
  { klucz: 'ekran_koncowy', tekst: 'Ekran końcowy YouTube ustawiony', etap: 'publikacja' },
  { klucz: 'napisy_srt', tekst: 'Plik SRT wgrany jako napisy PL', etap: 'publikacja' },
  { klucz: 'komentarz_przypiety', tekst: 'Komentarz dodany i przypięty', etap: 'publikacja' },
  { klucz: 'playlista', tekst: 'Dodane do playlisty', etap: 'publikacja' },
  { klucz: 'podcast_mp3', tekst: 'MP3 wyeksportowany i wgrany do Spotify', etap: 'publikacja',
    jak: 'Tylko długie odcinki. Opis przez przełącznik HTML — edytor gubi polskie znaki' },
];

// ── SHORT / SCENKA (pion 9:16) ──────────────────────────────────────────────
const SHORT: PunktChecklisty[] = [
  { klucz: 'format_pion', tekst: 'Pion 1080×1920, 30 fps', etap: 'produkcja', krytyczny: true },
  { klucz: 'napisy_wypalone', tekst: 'Napisy wypalone', etap: 'produkcja', krytyczny: true,
    jak: 'Zasada nadrzędna Klaudiusza — scenki i shorty ZAWSZE z wypalonymi' },
  { klucz: 'strefa_bezpieczna', tekst: 'Nic ważnego niżej niż ~250 px nad dolną krawędzią', etap: 'produkcja', krytyczny: true,
    jak: 'Interfejs TikToka/Reels zasłania dolny pas' },
  { klucz: 'hook_gora', tekst: 'Hook u góry, jedno słowo w markerze', etap: 'produkcja' },
  { klucz: 'bez_watermarku', tekst: 'Plik natywny, zero watermarków', etap: 'produkcja', krytyczny: true },
  { klucz: 'audio_loudnorm', tekst: 'Dźwięk wyrównany do −14 LUFS', etap: 'produkcja' },

  { klucz: 'opisy_per_platforma', tekst: 'Opis osobny na każdą platformę', etap: 'publikacja' },
  { klucz: 'link_bio', tekst: 'CTA prowadzi do checklisty', etap: 'publikacja', krytyczny: true },
  { klucz: 'wszystkie_platformy', tekst: 'Wrzucone na wszystkie zaplanowane platformy', etap: 'publikacja' },
  { klucz: 'godzina_zgodna', tekst: 'Godzina publikacji zgodna z planem', etap: 'publikacja',
    jak: 'Sprawdź w podglądzie właściciela — YT pokazuje zaplanowane jakby były publiczne' },
];

// ── MAIL (newsletter) ───────────────────────────────────────────────────────
const MAIL: PunktChecklisty[] = [
  { klucz: 'tresc_zatwierdzona', tekst: 'Treść zatwierdzona przez Michała', etap: 'produkcja', krytyczny: true },
  { klucz: 'html_zip', tekst: 'Zbudowany jako custom HTML (import ZIP)', etap: 'produkcja',
    jak: 'Edytora drag & drop nie da się obsłużyć zdalnie. Wzorzec: Mail-02-PIP.html' },
  { klucz: 'preheader', tekst: 'Preheader jako ukryty div na początku body', etap: 'produkcja',
    jak: 'W trybie HTML MailerLite nie ma pola preheader' },
  { klucz: 'linki_dzialaja', tekst: 'Linki i {$unsubscribe} sprawdzone', etap: 'produkcja', krytyczny: true },

  { klucz: 'test_wyslany', tekst: 'Test wysłany do siebie i obejrzany', etap: 'publikacja', krytyczny: true },
  { klucz: 'harmonogram', tekst: 'Harmonogram: strefa → godzina → data (w tej kolejności)', etap: 'publikacja', krytyczny: true,
    jak: 'Zmiana strefy resetuje datę. Nie klikać w puste miejsce — włącza smart sending' },
  { klucz: 'bez_smart_sending', tekst: 'Smart sending WYŁĄCZONY', etap: 'publikacja', krytyczny: true },
  { klucz: 'reply_to', tekst: 'Reply-to na michal@michalbezstresu.pl', etap: 'publikacja' },
];

export const SZABLONY: Record<string, PunktChecklisty[]> = {
  yt: ODCINEK,
  tt: SHORT,
  ig: SHORT,
  fb: SHORT,
  newsletter: MAIL,
  blog: [
    { klucz: 'tekst_gotowy', tekst: 'Tekst gotowy i przeczytany na głos', etap: 'produkcja' },
    { klucz: 'cta_checklista', tekst: 'CTA do checklisty w treści', etap: 'publikacja', krytyczny: true },
    { klucz: 'seo_meta', tekst: 'Tytuł i opis SEO uzupełnione', etap: 'publikacja' },
  ],
};

/** Punkty dla danej platformy; pusty szablon = brak checklisty. */
export function punktyDla(platforma: string): PunktChecklisty[] {
  return SZABLONY[platforma] ?? [];
}

/** Klucze punktów, które muszą być odhaczone przed statusem „opublikowane". */
export function krytyczneDla(platforma: string): string[] {
  return punktyDla(platforma).filter(p => p.krytyczny).map(p => p.klucz);
}
