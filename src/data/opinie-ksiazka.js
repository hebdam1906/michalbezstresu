/* Opinie o „Z obu stron stołu” na /ksiazka/ (sekcja „Co mówią pierwsi czytelnicy”).
 * 9.11.2026: 3 cytaty z lubimyczytać.pl, zgody autorek potwierdził Michał (brief Klaudiusza 9.11).
 * Cytaty DOSŁOWNIE, z pisownią autorek; skróty […] tylko tam, gdzie zatwierdził Klaudiusz.
 * Kolejne karty: dopisz obiekt na końcu tablicy (ok. 16.11: Ewelina, Sebastian).
 * Pola: tekst, kto, rola, link (opcjonalnie), uwaga (opcjonalnie, np. egzemplarz recenzencki).
 */
export const LUBIMYCZYTAC = 'https://lubimyczytac.pl/ksiazka/5267391/z-obu-stron-stolu';
/* Podsumowanie ocen z lubimyczytać — aktualizuj ręcznie wg stanu na LC (nie liczy się z tablicy, bo dojdą opinie spoza LC). */
export const LC_PODSUMOWANIE = '10/10 · 3 opinie na lubimyczytać.pl';

export const opinie = [
  {
    tekst: 'Bardzo ciekawa i wartościowa książka, która zawiera same konkrety, bez zbędnego lania wody i pustych sloganów. […] przedstawione wskazówki można od razu wykorzystać w praktyce.',
    kto: 'Justyna',
    rola: 'lubimyczytać.pl, 10/10',
    link: LUBIMYCZYTAC,
    uwaga: 'otrzymała egzemplarz recenzencki od autora',
  },
  {
    tekst: 'Takie pytania i takie sytuacje pojawiały się w mojej 20 letniej karierze i szkoda że nie trafiłam na taki zbiór prostych a zarazem genialnych w swej prostocie rozwiązań […] mogłabym uniknąć wielu złych decyzji.',
    kto: 'czytelniczka po 20 latach kariery',
    rola: 'lubimyczytać.pl, 10/10',
    link: LUBIMYCZYTAC,
  },
  {
    tekst: 'Nie jest pisana z pozycji »guru«, wręcz przeciwnie, autor nie unika pokazania błędów, które sam popełnił, ich konsekwencji, jednocześnie daje narzędzia i sposoby abyś Ty ich uniknął (uniknęła). […] sprawdzą się nie tylko w korporacji – zasady i reguły gry wszędzie są bardzo podobne, zmienia się tylko otoczenie (pracuję w »budżetówce«).',
    kto: 'Edyta',
    rola: 'lubimyczytać.pl, 10/10',
    link: LUBIMYCZYTAC,
  },
];
