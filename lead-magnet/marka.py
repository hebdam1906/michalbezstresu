#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Wspólna oprawa graficzna PDF-ów „Michał bez Stresu".

Wyjęte 23.09.2026 z `gen-checklista.py`, gdy powstał drugi dokument
(wzór planu naprawczego). Paleta, fonty, style akapitów, pasek u góry
i stopka mają JEDNO źródło — inaczej dwa generatory rozjadą się po
pierwszej zmianie w brandingu.

Treść dokumentów zostaje w ich własnych skryptach:
  gen-checklista.py       — checklista PL (4 str.) i EN (2 str.)
  gen-plan-naprawczy.py   — wzór planu naprawczego B2B (2 str.)

Etykieta numeru strony: ustawiana przez skrypt wywołujący —
  import marka; marka.STRONA = "p."
Funkcja `rama()` czyta ją w momencie rysowania, nie importu.
"""
import sys, os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph,
                                Spacer, Table, TableStyle, KeepTogether, PageBreak)

# ── paleta marki (global.css) ────────────────────────────────────────────────
MGLA     = colors.HexColor("#EDF1EF")
ATRAMENT = colors.HexColor("#1E2B28")
SYGNAL   = colors.HexColor("#2E6B5D")
SZALWIA  = colors.HexColor("#7C9E8E")
MARKER   = colors.HexColor("#FFE9A3")
LINIA    = colors.HexColor("#D8E0DC")

L = "/usr/share/fonts/truetype/lato"
D = "/usr/share/fonts/truetype/dejavu"
for name, path in [("Lato", f"{L}/Lato-Regular.ttf"), ("Lato-B", f"{L}/Lato-Black.ttf"),
                   ("Lato-M", f"{L}/Lato-Medium.ttf"), ("Serif", f"{D}/DejaVuSerif.ttf"),
                   ("Mono", f"{D}/DejaVuSansMono.ttf"), ("Sym", f"{D}/DejaVuSans.ttf")]:
    pdfmetrics.registerFont(TTFont(name, path))
pdfmetrics.registerFontFamily("Lato", normal="Lato", bold="Lato-B",
                              italic="Lato", boldItalic="Lato-B")

# etykieta numeru strony — podmieniana przez main() dla wersji EN
STRONA = "str."

W, H = A4
MARG = 24 * mm

def st(name, **kw):
    base = dict(fontName="Lato", fontSize=9.5, leading=14, textColor=ATRAMENT,
                alignment=TA_LEFT, spaceBefore=0, spaceAfter=0)
    base.update(kw)
    return ParagraphStyle(name, **base)

S = {
    "kicker":  st("kicker", fontName="Mono", fontSize=7.5, textColor=SYGNAL, leading=11),
    "h1":      st("h1", fontName="Serif", fontSize=20, leading=25, spaceBefore=6, spaceAfter=2),
    "sub":     st("sub", fontName="Lato", fontSize=9, textColor=SZALWIA, spaceAfter=10),
    "h2":      st("h2", fontName="Serif", fontSize=13.5, leading=18, textColor=SYGNAL,
                  spaceBefore=10, spaceAfter=4),
    "h3":      st("h3", fontName="Lato-B", fontSize=10, leading=14, textColor=ATRAMENT,
                  spaceBefore=7, spaceAfter=3),
    "p":       st("p", spaceAfter=6),
    "mono":    st("mono", fontName="Mono", fontSize=8, leading=12.5),
    "check":   st("check", fontSize=9.5, leading=14.5, leftIndent=10),
    "num":     st("num", fontSize=9.5, leading=14.5, leftIndent=10),
    "cyt":     st("cyt", fontName="Serif", fontSize=10, leading=15, textColor=SYGNAL,
                  spaceBefore=2, spaceAfter=4, leftIndent=6),
    "small":   st("small", fontSize=8.5, leading=12, textColor=SZALWIA),
    "stopka":  st("stopka", fontName="Lato-M", fontSize=9, leading=13.5),
    "tabh":    st("tabh", fontName="Lato-B", fontSize=8.5, leading=11.5, textColor=colors.white),
    "tab":     st("tab", fontSize=8.5, leading=11.5),
}

def P(txt, s="p"): return Paragraph(txt, S[s])
def M(txt):        return f'<font backColor="#FFE9A3"> {txt} </font>'   # marker
def sp(h):         return Spacer(1, h)

def checkbox(txt):
    return Paragraph(f'<font name="Sym" size="10">☐</font> {txt}', S["check"])

def numer(n, txt):
    return Paragraph(f'<font name="Lato-B" color="#2E6B5D">{n}</font> {txt}', S["num"])

def ramka(linie):
    """Blok monospace w ramce — wzór notatki."""
    t = Table([[Paragraph("<br/>".join(linie).replace(" ", "&nbsp;"), S["mono"])]],
              colWidths=[W - 2 * MARG])
    t.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.6, LINIA),
        ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 9), ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return t

def tabela(naglowki, wiersze, szer):
    dane = [[Paragraph(h, S["tabh"]) for h in naglowki]]
    dane += [[Paragraph(c, S["tab"]) for c in w] for w in wiersze]
    t = Table(dane, colWidths=szer, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SYGNAL),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, MGLA]),
        ("GRID", (0, 0), (-1, -1), 0.5, LINIA),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t

def pole(etykieta):
    return Paragraph(f'{etykieta} <font color="#7C9E8E">'
                     f'________________________________</font>', S["check"])

# ── pasek u góry i stopka ────────────────────────────────────────────────────
def rama(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(MARKER);  canvas.rect(0, H - 7, W * 0.29, 7, stroke=0, fill=1)
    canvas.setFillColor(SYGNAL);  canvas.rect(W * 0.29, H - 7, W * 0.71, 7, stroke=0, fill=1)
    canvas.setFont("Lato", 8.5); canvas.setFillColor(SZALWIA)
    canvas.drawRightString(W - MARG, 14 * mm,
                           f"michalbezstresu.pl · {STRONA} {canvas.getPageNumber()}")
    canvas.restoreState()

