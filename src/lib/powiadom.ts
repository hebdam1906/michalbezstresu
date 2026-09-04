/**
 * Powiadomienie o nowym zapytaniu (konsultacje / firmy).
 *
 * Dlaczego to istnieje: do 4.09.2026 oba formularze zapisywały zapytanie do
 * Supabase i dopisywały człowieka do grupy w MailerLite — i na tym koniec.
 * Nikt nie dostawał żadnego sygnału. Michał dowiadywał się o zapytaniu tylko
 * wtedy, gdy sam otworzył panel. Strona konsultacji obiecuje odpowiedź w ciągu
 * 48 godzin, a takiej obietnicy nie da się dotrzymać na czujność.
 *
 * Celowo BEZ nowej usługi i BEZ nowej zależności: wysyłamy POST na webhook
 * (u nas: Make.com), a co on z tym zrobi — mail, Slack, push na telefon — jest
 * decyzją poza kodem i można ją zmienić bez wdrożenia.
 *
 * Gdy POWIADOMIENIA_WEBHOOK nie jest ustawiony, funkcja nie robi NIC. Dzięki
 * temu tę zmianę można wdrożyć, zanim webhook w ogóle powstanie — nic się nie
 * psuje, po prostu jest jak było.
 *
 * Funkcja nigdy nie rzuca wyjątkiem i nigdy nie wpływa na odpowiedź dla
 * użytkownika: zapytanie jest już w bazie, a nieudane powiadomienie nie może
 * zamienić udanego zgłoszenia w błąd na stronie. Timeout jest po to, żeby
 * martwy webhook nie trzymał funkcji Vercela do jej własnego limitu.
 */

const WEBHOOK = import.meta.env.POWIADOMIENIA_WEBHOOK;

export type Powiadomienie = {
  typ: 'konsultacje' | 'firmy';
  imie: string;
  email: string;
  tresc: string;
  extra?: Record<string, unknown>;
};

export async function powiadom(p: Powiadomienie): Promise<void> {
  if (!WEBHOOK) return;
  try {
    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, kiedy: new Date().toISOString() }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    /* patrz komentarz wyżej — zapytanie jest w bazie, to wystarczy */
  }
}
