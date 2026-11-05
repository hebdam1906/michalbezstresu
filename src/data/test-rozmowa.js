// /test „Która trudna rozmowa Cię czeka?” — teksty i logika wyniku (jedno źródło dla strony i /api/test).
// Źródło tekstów: claude/Test-Ktora-trudna-rozmowa-Cie-czeka_5-pytan_logika_wyniki_04-11.md (zatwierdzone 5.11).
// Reguła: „Trzy zdania na start” TYLKO dla strona = pracownik (ekran i mail).

export const PYTANIA = [
  { pole: 'rozmowa', pytanie: 'Co jest najbliżej?', opcje: [
    ['podwyzka', 'Rozmowa o pieniądzach (podwyżka, widełki)'],
    ['ocena', 'Ocena roczna albo feedback, z którym się nie zgadzam'],
    ['pip', 'Plan naprawczy, ostrzeżenie, „musimy porozmawiać”'],
    ['odejscie', 'Odejście: moje albo kogoś z zespołu'],
    ['awans', 'Awans, nowa rola, nowy szef'],
    ['zespol', 'Konflikt w zespole, trudna osoba'],
  ] },
  { pole: 'strona', pytanie: 'Po której stronie stołu siedzisz w tej rozmowie?', opcje: [
    ['pracownik', 'Jestem pracownikiem, rozmawiam z przełożonym'],
    ['menedzer', 'Prowadzę zespół, to ja prowadzę rozmowę'],
    ['hr', 'Jestem z HR, jestem pomiędzy'],
  ] },
  { pole: 'kiedy', pytanie: 'Kiedy?', opcje: [
    ['pilne', 'W tym tygodniu'],
    ['wkrotce', 'W tym miesiącu'],
    ['kiedys', 'Nie wiem, ale wisi w powietrzu'],
  ] },
  { pole: 'trudnosc', pytanie: 'Co jest najtrudniejsze?', opcje: [
    ['start', 'Nie wiem, co powiedzieć na początku'],
    ['argumenty', 'Boję się, że zabraknie mi argumentów'],
    ['emocje', 'Boję się, jak to przyjmie druga strona'],
    ['po', 'Nie wiem, co zrobić po rozmowie'],
  ] },
  { pole: 'historia', pytanie: 'Czy ta rozmowa już kiedyś się odbyła?', opcje: [
    ['powtorka', 'Tak, i nic z niej nie wyszło'],
    ['pierwszy', 'Nie, to pierwszy raz'],
    ['zaocznie', 'Odbyła się, ale bez mojego udziału (ktoś zdecydował za mnie)'],
  ] },
];

export const STRONA_NAZWA = { pracownik: 'pracownika', menedzer: 'menedżera', hr: 'HR' };
const KOLEJNOSC = ['start', 'argumenty', 'emocje', 'po'];

export const WYNIKI = {
  podwyzka: {
    nazwa: 'rozmowa o podwyżce',
    akapit: '„Nie ma budżetu” prawie nigdy nie znaczy tego, co słyszysz. Czasem „nie teraz”, czasem „nie w tej kwocie”, czasem „nie przekonałeś mnie”. Twoja praca to dowiedzieć się, które.',
    zdania: {
      start: '„Chcę porozmawiać o moim wynagrodzeniu. Mam przygotowane, co zmieniło się w moim zakresie przez ostatni rok.”',
      argumenty: '„W ciągu roku doszło mi X i Y. Rynek za taki zakres płaci Z. Chcę, żebyśmy do tego doszli.”',
      emocje: '„Rozumiem, że to nie jest łatwa decyzja. Dlatego pytam, co musiałoby się wydarzyć, żeby była możliwa.”',
      po: '„Zapiszę, co ustaliliśmy, i wyślę dziś mailem. Kiedy wracamy do tematu?”',
    },
    strona: {
      pracownik: 'Rozmowa o podwyżce zaczyna się trzy miesiące przed rozmową: wtedy, gdy zaczynasz zapisywać, co zrobiłeś.',
      menedzer: 'Jeśli to Ty mówisz „nie”, powiedz, które to „nie”, i daj termin. Osoba bez terminu zacznie szukać.',
      hr: 'Twoja rola to widełki i kryteria na stole, zanim ktoś usłyszy „nie” bez wyjaśnienia.',
    },
    rozdzial: 'Rozdział 9: „Staraj się, staraj”', pdf: '9',
    odcinek: ['Jak rozmawiać o podwyżce', 'https://youtu.be/1zLZM7ofM6w'], symulator: true,
  },
  ocena: {
    nazwa: 'ocena roczna',
    akapit: 'Ocena roczna, z którą się nie zgadzasz, zwykle została napisana wcześniej, niż myślisz, i z innych powodów, niż mówi. Spór o nią w gabinecie rzadko coś zmienia. Pytanie o kryteria: zawsze.',
    zdania: {
      start: '„Chcę dobrze zrozumieć tę ocenę. Z czego konkretnie wynika?”',
      argumenty: '„Mam notatki z całego roku. Które z tych rzeczy były brane pod uwagę?”',
      emocje: '„Nie zgadzam się, ale nie chcę się kłócić. Chcę wiedzieć, co ma się zmienić do następnej.”',
      po: '„Potwierdzę to mailem. Czy możemy ustalić, po czym poznamy, że jest lepiej?”',
    },
    strona: {
      pracownik: 'Nie podpisuj i nie odrzucaj w gabinecie. Weź dzień.',
      menedzer: 'Ocena bez przykładów to opinia. Człowiek zapamięta ton, nie wynik.',
      hr: 'Jeśli w ocenie nie ma kryteriów, nie ma czego bronić w odwołaniu.',
    },
    rozdzial: 'Rozdział 5: „Twoja ocena została napisana…”', pdf: '1',
    odcinek: ['Ocena roczna', 'https://youtu.be/IBgoUr40pXk'],
  },
  pip: {
    nazwa: 'plan naprawczy',
    akapit: 'Plan naprawczy bywa planem i bywa wypowiedzeniem na raty. Rozpoznasz po jednym: czy cele są mierzalne i osiągalne w podanym czasie. Jeśli nie, to nie jest plan.',
    zdania: {
      start: '„Chcę to dobrze zrozumieć. Co konkretnie ma się zmienić i po czym to poznamy?”',
      argumenty: '„Proszę o cele na piśmie, z terminami i z tym, kto mi w tym pomoże.”',
      emocje: '„To dla mnie trudne, ale chcę przez to przejść. Jak często będziemy rozmawiać o postępach?”',
      po: '„Potwierdzę ustalenia mailem dziś. Prośba o pierwsze spotkanie kontrolne w przyszłym tygodniu.”',
    },
    strona: {
      pracownik: 'Od tej chwili każda rozmowa to dokument. Zapisuj.',
      menedzer: 'Jeśli nie wierzysz, że osoba może dowieźć ten plan, nie rób planu. Zrób uczciwą rozmowę.',
      hr: 'Plan bez wsparcia i bez terminów nie obroni się nigdzie.',
    },
    rozdzial: 'Rozdział 2: „Przygotowaliśmy dla Ciebie plan poprawy”', pdf: '1',
    odcinek: ['PIP — plan naprawczy od środka', 'https://youtu.be/s_H-Ks-8urQ'],
  },
  odejscie: {
    nazwa: 'odejście',
    akapit: 'Jak odchodzisz, mówi o Tobie więcej niż jak przychodzisz. Dotyczy obu stron: tego, kto odchodzi, i tego, kto zostaje.',
    zdania: {
      start: '„Decyzja zapadła. Chcę, żeby ta wiadomość dotarła do Ciebie ode mnie, zanim od kogokolwiek innego.”',
      argumenty: '„To nie jest negocjacja. Chcę dobrze przekazać sprawy i zostawić porządek.”',
      emocje: '„Wiem, że to nie jest dobry moment. Dlatego mówię teraz, a nie za tydzień.”',
      po: '„Wyślę plan przekazania do piątku. Co jest dla Ciebie najważniejsze w tym okresie?”',
    },
    strona: {
      pracownik: 'Kontroferta to osobna rozmowa. Nie odpowiadaj w tym samym spotkaniu.',
      menedzer: 'Pierwsze 10 minut po „odchodzę” decyduje, czy ta osoba poleci Cię innym.',
      hr: 'Exit interview ma sens tylko, jeśli ktoś potem czyta notatki.',
    },
    rozdzial: 'Rozdział 12: „Zmiana pracy”', pdf: '1',
    odcinek: ['Odejście z pracy: po czym poznać, że to ten moment', 'https://youtu.be/TF6fsXyhqOY'],
  },
  awans: {
    nazwa: 'awans',
    akapit: 'Awans to zmiana zawodu, nie większa wersja tego samego. Najtrudniejsza rozmowa przychodzi pierwsza: z ludźmi, którzy tydzień temu byli kolegami, a dziś raportują do Ciebie. Albo z nowym szefem, który jeszcze nie wie, kim jesteś.',
    zdania: {
      start: '„Chcę to nazwać od razu: dalej się znamy i lubimy, ale w pracy relacja się zmienia.”',
      argumenty: '„Oto, czym chcę się zająć w pierwszych 30 dniach. Co jest dla Was najważniejsze?”',
      emocje: '„Wiem, że to dziwna sytuacja. Wolę o tym mówić niż udawać, że jej nie ma.”',
      po: '„Umówmy pierwsze 1:1 w tym tygodniu. Krótko, o tym, czego ode mnie potrzebujesz.”',
    },
    strona: {
      pracownik: 'Powiedz to pierwszego dnia, nie po trzech miesiącach, gdy już jest niezręcznie.',
      menedzer: 'Dostęp do systemów ma pierwszego dnia. Przećwiczoną pierwszą rozmowę: prawie nigdy. Daj mu ją.',
      hr: 'Program dla nowych menedżerów bez ćwiczenia rozmów to program o narzędziach.',
    },
    rozdzial: 'Rozdział 11: „Nowy tylko dla Ciebie”', pdf: '1',
    odcinek: ['Awans to zmiana zawodu', 'https://youtu.be/0_eBIhkAAi0'],
  },
  zespol: {
    nazwa: 'trudny zespół',
    akapit: 'Trudna osoba w zespole rzadko jest problemem sama w sobie. Problemem jest to, czego nikt jej nie powiedział na czas. Każdy miesiąc zwłoki to droższa rozmowa.',
    zdania: {
      start: '„Chcę porozmawiać o jednej konkretnej sytuacji z zeszłego tygodnia.”',
      argumenty: '„Oto, co się wydarzyło, i oto, jaki to miało skutek dla zespołu.”',
      emocje: '„Nie chodzi mi o Ciebie jako osobę. Chodzi o to jedno zachowanie i o to, co dalej.”',
      po: '„Ustalmy jedną rzecz do zmiany i termin, kiedy do tego wrócimy.”',
    },
    strona: {
      pracownik: 'Jeśli to Ty jesteś w konflikcie z kimś w zespole, idź do szefa z sytuacją, nie z osobą.',
      menedzer: 'Nie musisz być lubiany. Musisz być przewidywalny.',
      hr: 'Mediacja po 6 miesiącach milczenia to już nie mediacja.',
    },
    rozdzial: 'Rozdział 15: „Trudny zespół”', pdf: '1',
    odcinek: ['Dostałem zespół, który wolałby kogoś innego', 'https://youtu.be/BxVlXp7MISA'],
  },
};

export const DOPISKI = {
  powtorka: 'Skoro ta rozmowa już była i nic nie dała: tym razem zakończ ją mailem z ustaleniami i terminem. To zmienia najwięcej.',
  pierwszy: 'Pierwszy raz: przećwicz pierwsze zdanie na głos. Serio, na głos. Reszta pójdzie.',
  zaocznie: 'Jeśli ktoś zdecydował bez Ciebie, pierwsza rozmowa jest o tym, żeby następna odbyła się z Tobą.',
};

/** Odpowiedzi → wynik. Zwraca null przy niepoprawnych odpowiedziach. */
export function wynik(o) {
  const w = WYNIKI[o.rozmowa];
  if (!w || !STRONA_NAZWA[o.strona] || !DOPISKI[o.historia]) return null;
  const pierwsze = KOLEJNOSC.includes(o.trudnosc) ? o.trudnosc : 'start';
  const zdania = o.strona === 'pracownik'
    ? [pierwsze, ...KOLEJNOSC.filter((k) => k !== pierwsze)].slice(0, 3).map((k) => w.zdania[k])
    : [];
  return {
    rozmowa: o.rozmowa, nazwa: w.nazwa, stronaNazwa: STRONA_NAZWA[o.strona],
    akapit: w.akapit, zdania, stronaTekst: w.strona[o.strona], dopisek: DOPISKI[o.historia],
    rozdzial: w.rozdzial, pdf: w.pdf, odcinek: w.odcinek, symulator: !!w.symulator,
  };
}
