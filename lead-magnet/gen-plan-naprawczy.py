#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generator PDF-a „PLAN NAPRAWCZY — wzór do wypełnienia".

Materiał B2B (menedżerowie i HR), 2 strony A4. Treść: Klaudiusz,
`Strona-B2B_plan-naprawczy-wzor_tresc-i-PDF.md` z 23.09.2026.
Oprawa graficzna: `marka.py` — wspólna z checklistą.

To jest dokument DO WYPEŁNIENIA, nie do czytania: puste wiersze tabel
i linie mają stałą wysokość, żeby dało się je wypełnić ręcznie po wydruku
albo w czytniku PDF-a. Dlatego własne helpery na tabele z pustymi
wierszami — `tabela()` z marka.py skleja wiersze do zera przy pustych
komórkach.

⚠️ Nazwa pliku i URL bez słowa „zwolnienie" — decyzja Klaudiusza 23.09:
   ta strona ma być planem, nie instrukcją zwalniania.

Uruchomienie:  python3 gen-plan-naprawczy.py [plik-wyjsciowy.pdf]
"""
from marka import (A4, mm, BaseDocTemplate, PageTemplate, Frame, Table, TableStyle,
                   PageBreak, W, H, MARG, LINIA, SYGNAL, SZALWIA, MGLA, S,
                   P, sp, rama, colors, Paragraph, pdfmetrics)
import sys, os

SZER = W - 2 * MARG


def linie(ile=1, odstep=9 * mm):
    """Puste linie do wpisania ręką — kreska u dołu każdego wiersza."""
    t = Table([[""] for _ in range(ile)], colWidths=[SZER],
              rowHeights=[odstep] * ile)
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, LINIA),
        ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t


def metryczka(pary):
    """Nagłówek dokumentu: etykieta + miejsce na wpis, po dwie pary w wierszu.

    Szerokość kolumn z etykietami liczona z najdłuższej etykiety — inaczej
    „Data zakończenia planu:" łamie się na dwie linie i rozjeżdża wiersz.
    """
    def szeroka(i):
        naj = max((pdfmetrics.stringWidth(w[i], "Lato-B", 8.5)
                   for w in pary if len(w) > i), default=0)
        return naj + 4 * mm

    e0, e1 = szeroka(0), szeroka(1)
    dane, szer = [], [e0, SZER / 2 - e0, e1, SZER / 2 - e1]
    styl = [("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]
    for nr, w in enumerate(pary):
        wiersz = []
        for etykieta in w:
            wiersz += [Paragraph(f"<b>{etykieta}</b>", S["tab"]), ""]
        # kreska tylko tam, gdzie jest etykieta — inaczej w wierszu z jedną parą
        # zostaje wisząca linia po prawej, bez podpisu
        for kol in (1, 3):
            if kol // 2 < len(w):
                styl.append(("LINEBELOW", (kol, nr), (kol, nr), 0.5, LINIA))
        while len(wiersz) < 4:
            wiersz.append("")
        dane.append(wiersz)
    t = Table(dane, colWidths=szer, rowHeights=[9 * mm] * len(dane))
    t.setStyle(TableStyle(styl))
    return t


def tabela_pusta(naglowki, ile_wierszy, szer, wys=11 * mm):
    """Tabela z nagłówkiem i pustymi wierszami o stałej wysokości."""
    dane = [[Paragraph(h, S["tabh"]) for h in naglowki]]
    dane += [[""] * len(naglowki) for _ in range(ile_wierszy)]
    t = Table(dane, colWidths=szer, rowHeights=[None] + [wys] * ile_wierszy,
              repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SYGNAL),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, MGLA]),
        ("GRID", (0, 0), (-1, -1), 0.5, LINIA),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t


def wskazowka(txt):
    return P(f'<i>{txt}</i>', "small")


# ════════════════════════════════════════════════════════════════════════════
def tresc():
    F = []
    # ── STRONA 1 ────────────────────────────────────────────────────────────
    F += [P("D L A &nbsp; M E N E D Ż E R Ó W &nbsp; I &nbsp; H R &nbsp; · &nbsp; "
            "W Z Ó R &nbsp; D O &nbsp; W Y P E Ł N I E N I A", "kicker"),
          P("PLAN NAPRAWCZY", "h1"),
          P("Michał bez Stresu · wzór struktury, nie dokument prawny", "sub"),
          sp(4),
          metryczka([["Pracownik:", "Stanowisko:"],
                     ["Przełożony:", "Data wręczenia:"],
                     ["Data zakończenia planu:"]]),
          sp(10),

          P("1 · CEL PLANU", "h2"),
          wskazowka("Jedno zdanie: co konkretnie ma się zmienić i po czym to poznamy. "
                    "Jeśli nie da się tego zmieścić w jednym zdaniu, plan nie ma celu."),
          sp(2), linie(2, 11 * mm), sp(12),

          P("2 · KRYTERIA", "h2"),
          wskazowka("Mierzalne, nie opisowe. Każde z wartością docelową i sposobem pomiaru. "
                    "Kryterium, którego nie da się sprawdzić na koniec planu, będzie sporem "
                    "na koniec planu."),
          sp(3),
          tabela_pusta(["kryterium", "wartość dziś", "wartość docelowa", "jak mierzymy"],
                       4, [SZER * 0.34, SZER * 0.18, SZER * 0.20, SZER * 0.28]),
          sp(12),

          P("3 · WSPARCIE ZE STRONY FIRMY", "h2"),
          wskazowka("Szkolenie, mentor, narzędzia, zmiana zakresu — z terminami. "
                    "Plan bez wsparcia jest testem, nie planem."),
          sp(2), linie(4, 11 * mm),
          PageBreak()]

    # ── STRONA 2 ────────────────────────────────────────────────────────────
    F += [P("4 · SPOTKANIA KONTROLNE", "h2"),
          wskazowka("Daty ustalone w dniu wręczenia. Po każdym spotkaniu krótka notatka, "
                    "wysłana tego samego dnia do pracownika."),
          sp(3),
          tabela_pusta(["data", "omówione", "ustalenia"],
                       6, [SZER * 0.16, SZER * 0.42, SZER * 0.42], 12 * mm),
          sp(12),

          P("5 · CO OZNACZA SPEŁNIENIE KRYTERIÓW", "h2"),
          wskazowka("Napisane w dniu wręczenia, nie w dniu zakończenia."),
          sp(2), linie(2, 11 * mm), sp(10),

          P("6 · CO OZNACZA NIESPEŁNIENIE KRYTERIÓW", "h2"),
          wskazowka("Też w dniu wręczenia. Pracownik, który zna obie odpowiedzi od "
                    "pierwszego dnia, pracuje. Pracownik, który zgaduje — szuka."),
          sp(2), linie(2, 11 * mm), sp(14),

          metryczka([["Podpis przełożonego:", "Podpis pracownika:"]]),
          sp(4),
          P("Podpis pracownika potwierdza otrzymanie dokumentu, nie zgodę na jego treść.",
            "small"),
          sp(12),

          Table([[P("<b>Ważne:</b> to jest wzór struktury, nie dokument prawny. Plan naprawczy "
                    "nie ma w polskim prawie ustawowej formy; jego skutki zależą od regulaminów "
                    "obowiązujących w firmie i od Kodeksu pracy. Dostosuj wzór do swojej "
                    "organizacji, a w sprawach spornych skonsultuj się z prawnikiem.", "small")]],
                colWidths=[SZER],
                style=TableStyle([("BOX", (0, 0), (-1, -1), 0.6, LINIA),
                                  ("LEFTPADDING", (0, 0), (-1, -1), 10),
                                  ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                                  ("TOPPADDING", (0, 0), (-1, -1), 8),
                                  ("BOTTOMPADDING", (0, 0), (-1, -1), 8)])),
          sp(12),
          P("MICHAŁ BEZ STRESU · 20 lat w korporacji, po obu stronach stołu. Warsztaty dla "
            "menedżerów i HR: jak przygotować, wręczyć i poprowadzić plan naprawczy.<br/>"
            "Prosto. Spokojnie. Po Twojej stronie. · michalbezstresu.pl/dla-firm",
            "stopka")]
    return F


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "plan-naprawczy-wzor.pdf")
    doc = BaseDocTemplate(out, pagesize=A4,
                          leftMargin=MARG, rightMargin=MARG,
                          topMargin=20 * mm, bottomMargin=20 * mm,
                          title="Plan naprawczy — wzór do wypełnienia",
                          author="Michał bez Stresu")
    frame = Frame(MARG, 20 * mm, W - 2 * MARG, H - 40 * mm, id="tresc",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="std", frames=[frame], onPage=rama)])
    doc.build(tresc())
    print("zapisano:", out)


if __name__ == "__main__":
    main()
