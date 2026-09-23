#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generator PDF-a checklisty „Michał bez Stresu".

Odtworzony 8.09.2026 z gotowego PDF-a (oryginalny skrypt z 7.07 zaginął —
w repo została tylko treść `CHECKLISTA_dokumentowanie.md` i sam plik wynikowy).
Układ, fonty, pasek u góry i stopka odwzorowane 1:1 ze starej wersji.

Strony 1–2: dotychczasowa checklista (dokumentowanie) — bez zmian merytorycznych.
Strony 3–4: DODATEK · ODCINEK #9 — mapa cyklu budżetowego i formuła rozmowy
            o podwyżkę. Treść: Klaudiusz, `Checklista_dodatek-odc-09_...md`.
            Wariant A (decyzja Michała 8.09): tytuł całości zostaje, nowe strony
            są wyraźnie oznaczone jako dodatek — welcome mail obiecuje
            dokumentowanie i to dalej dostaje.

Nazwa pliku wynikowego MUSI zostać `checklista-dokumentowanie.pdf` — ten sam
link chodzi w automatyzacji MailerLite i w starych mailach.

Uruchomienie:  python3 gen-checklista.py [plik-wyjsciowy.pdf]
               python3 gen-checklista.py --en   (wersja angielska, str. 1-2)
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

# ════════════════════════════════════════════════════════════════════════════
def tresc():
    F = []
    # ── STRONA 1–2: dokumentowanie (bez zmian) ──────────────────────────────
    F += [P("P R A C A &nbsp; W &nbsp; K O R P O R A C J I &nbsp; · &nbsp; "
            "D O K U M E N T O W A N I E", "kicker"),
          P("Checklista: jak dokumentować<br/>trudne sytuacje w pracy", "h1"),
          P("Michał bez Stresu · materiał bezpłatny dla subskrybentów", "sub"),
          P("Firma dokumentuje wszystko od Twojego pierwszego dnia w pracy — maile, oceny, "
            "ustalenia. To normalne. I Ty masz do tego dokładnie takie samo prawo."),
          P("Dokumentowanie to nie donoszenie i nie szykowanie się do wojny. To spokojne "
            "zapisywanie" + M("faktów") + ", żeby za pół roku nie opierać się na pamięci — "
            "swojej ani cudzej. Zajmuje 5 minut po trudnej rozmowie. Czasem jest warte "
            "znacznie więcej."),
          P("1 · Zasada: notatka w 5 minut po rozmowie", "h2"),
          P("Zaraz po trudnej rozmowie zapisz fakty — póki pamiętasz dokładnie. "
            "Nie interpretacje, nie emocje. Fakty."),
          sp(3),
          ramka(["DATA i GODZINA: 7.07.2026, ok. 14:30",
                 "KTO BYŁ OBECNY: ja, [przełożony], [świadkowie]",
                 "GDZIE / JAK: sala / spotkanie online / przy biurku",
                 "CZEGO DOTYCZYŁO: (jedno–dwa zdania)", "",
                 "CO PADŁO (konkretnie):", "  - „[cytat lub bliska parafraza]”", "",
                 "USTALENIA / OCZEKIWANIA:", "  - co, do kiedy, wg jakiego kryterium", "",
                 "CO POWIEDZIAŁEM / O CO DOPYTAŁEM:", "  - ...", "",
                 "DO ZROBIENIA PO MOJEJ STRONIE:", "  [ ] ..."]),
          sp(7),
          P("Dlaczego działa: po tygodniu pamięć płata figle obu stronom. Notatka z datą, "
            "spisana na gorąco," + M("porządkuje fakty i uspokaja") + "."),
          P("2 · Co zapisać po każdej trudnej sytuacji", "h2")]
    for x in ["Data i godzina — zawsze, to podstawa",
              "Kto był obecny (i kto widział/słyszał)",
              "Kanał — rozmowa, spotkanie, mail, komunikator",
              "Konkretne słowa / oczekiwania — cytaty, nie ogólniki",
              "Ustalenia — co, do kiedy, wg jakiego kryterium „zrobione”",
              "Co Ty powiedziałeś / o co dopytałeś",
              "Twoje kroki po rozmowie (i czy wykonane)",
              "Ślad pisemny — krótkie podsumowanie mailem, jeśli rozmowa była ustna"]:
        F.append(checkbox(x))
    F += [sp(8),
          P("Zasada nadrzędna:" + M("fakty zamiast ocen") + ". Zamiast „szef był "
            "niesprawiedliwy” → „otrzymałem uwagę dot. X; nie podano konkretnego przykładu”."),
          P("3 · Gdzie trzymać dokumentację", "h2")]
    for x in ["Kopia poza sprzętem i kontami służbowymi — dostęp do służbowego laptopa "
              "i maila firma może odebrać z dnia na dzień",
              "Prywatna przestrzeń — prywatny e-mail, prywatna chmura, notatnik",
              "Nie kopiuj poufnych danych firmy ani danych innych osób — dokumentuj własną "
              "sytuację i własne ustalenia",
              "Zapisuj na bieżąco, nie „kiedyś” — wpis z datą tego samego dnia jest wart więcej"]:
        F.append(checkbox(x))
    F += [P("4 · 10 zdań: spokojna odpowiedź na niesprawiedliwy feedback", "h2"),
          P("Nie odpowiadaj „na gorąco”. Odczekaj, ochłoń, odpisz spokojnie i na piśmie. "
            "Zdania możesz łączyć.")]
    grupy = [("Żeby zyskać czas:",
              ["„Dziękuję. Chcę się rzetelnie odnieść — wrócę z odpowiedzią do [termin].”",
               "„Podsumuję nasze ustalenia mailem, żebyśmy mieli je spisane.”"]),
             ("Żeby doprecyzować (ogólnik → konkret):",
              ["„Czy możemy omówić to na konkretnym przykładzie?”",
               "„Jak w praktyce będzie wyglądał wystarczający efekt?”",
               "„Po czym poznamy, że oczekiwanie zostało spełnione?”"]),
             ("Żeby przedstawić swoją perspektywę:",
              ["„Rozumiem uwagę. Dodam kontekst, który może być istotny: [fakty].”",
               "„Odbieram to inaczej i chciałbym wyjaśnić — opieram się na [konkret].”",
               "„Zależy mi na poprawie. Chcę, żeby ocena opierała się na faktach.”"]),
             ("Żeby zostawić ślad i domknąć:",
              ["„Dla porządku podsumowuję ustalenia z rozmowy: [punkty]. Dajcie znać, "
               "jeśli coś ująłem inaczej.”",
               "„Jeśli dobrze rozumiem, do [termin] mam [zadanie] wg [kryterium]. "
               "Potwierdzacie?”"])]
    for tytul, zdania in grupy:
        F.append(P(tytul, "h3"))
        for i, z in enumerate(zdania, 1):
            F.append(numer(i, z))
    F.append(P("5 · Czego NIE robić", "h2"))
    for x in ["Nie odpowiadaj na trudny feedback tego samego dnia, pod wpływem emocji",
              "Nie pisz etykiet („mobbing”, „złośliwość”) tam, gdzie wystarczą fakty",
              "Nie nagrywaj rozmów bez sprawdzenia, czy i kiedy wolno Ci to zrobić",
              "Nie wynoś poufnych materiałów firmy ani danych innych osób",
              "Nie zostawiaj jedynej kopii dokumentacji na sprzęcie służbowym"]:
        F.append(checkbox(x))
    F += [sp(9),
          Table([[P("<b>Ważne:</b> to materiał edukacyjny, nie porada prawna. Każda sytuacja "
                    "jest inna, a przepisy i regulaminy się różnią. Jeśli sprawa jest poważna "
                    "(podejrzenie mobbingu, dyscyplinarne, spór o wypowiedzenie) — skonsultuj "
                    "się z prawnikiem lub inspekcją pracy.", "small")]],
                colWidths=[W - 2 * MARG],
                style=TableStyle([("BOX", (0, 0), (-1, -1), 0.6, LINIA),
                                  ("LEFTPADDING", (0, 0), (-1, -1), 10),
                                  ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                                  ("TOPPADDING", (0, 0), (-1, -1), 8),
                                  ("BOTTOMPADDING", (0, 0), (-1, -1), 8)])),
          sp(12),
          P("MICHAŁ BEZ STRESU · 20 lat w korporacji. Znam zasady gry i uczę w nią grać.<br/>"
            "Konkret. Spokój. Po Twojej stronie. · michalbezstresu.pl", "stopka"),
          PageBreak()]

    # ── STRONA 3: mapa cyklu budżetowego ────────────────────────────────────
    F += [P("D O D A T E K &nbsp; · &nbsp; O D C I N E K &nbsp; # 9 &nbsp; · &nbsp; "
            "P O D W Y Ż K A", "kicker"),
          P("Mapa cyklu budżetowego", "h1"),
          P("Kiedy naprawdę zapada decyzja o Twoich pieniądzach", "sub"),
          P("Podwyżka to łańcuch. Pięć ogniw, jedno Twoje.", "h3"),
          sp(3),
          tabela(["ogniwo", "kto/co decyduje", "Twój wpływ"],
                 [["1. Wynik firmy", "rok budżetowy wykonany → jest pula", "żaden"],
                  ["2. Podział puli", "Twój szef walczy o swój dział", "żaden"],
                  ["3. Kalibracja", "Twój szef broni Twojej oceny — musi mieć liczby",
                   "<b>stuprocentowy</b>"],
                  ["4. Inwestycja", "czy firma wiąże z Tobą przyszłość", "częściowy"],
                  ["5. Rynek", "ile kosztuje ktoś taki jak Ty na lokalnym rynku", "częściowy"]],
                 [95, 240, 75]),
          P("„Twoja podwyżka konkuruje z podwyżkami ludzi, których nigdy nie spotkałeś.”", "cyt"),
          P("Rok podwyżki — kiedy co się dzieje", "h3"),
          sp(3),
          tabela(["miesiące", "co robi firma", "co robisz Ty"],
                 [["<b>styczeń – sierpień</b>", "realizuje budżet",
                   "<b>amunicja:</b> rejestr wyników z liczbami · sukcesy w małych porcjach "
                   "na 1:1 · ustalenia potwierdzane mailem"],
                  ["<b>wrzesień – październik</b>", "<b>planuje budżet na kolejny rok</b>",
                   "<b>rozmowa o pieniądzach — TERAZ</b>, zanim pula zostanie zamknięta"],
                  ["<b>listopad</b>", "domyka pulę podwyżkową",
                   "ostatni moment na zapowiedź rozmowy"],
                  ["<b>grudzień – styczeń</b>", "oceny roczne → kalibracja → pula podzielona",
                   "odbierasz wynik"],
                  ["<b>luty – marzec</b>", "komunikuje decyzje",
                   "jeśli „nie”: zamieniasz je na kryteria i termin (str. 4)"]],
                 [95, 150, 165]),
          P("„O podwyżkę grasz od stycznia do listopada. Grudzień tylko odbiera wynik.”", "cyt"),
          P("Twoja firma — uzupełnij", "h3"),
          P("Terminy różnią się między firmami. Dowiedz się — pytanie na 1:1 albo do HR:"),
          pole("Budżet na kolejny rok planuje się u nas w:"),
          pole("Oceny roczne / kalibracja:"),
          pole("Decyzje o podwyżkach ogłaszane:"),
          pole("<b>→ Mój moment na rozmowę:</b>"),
          sp(4),
          P("(miesiąc–dwa przed zamknięciem budżetu)", "small"),
          PageBreak()]

    # ── STRONA 4: formuła rozmowy ───────────────────────────────────────────
    F += [P("D O D A T E K &nbsp; · &nbsp; O D C I N E K &nbsp; # 9 &nbsp; · &nbsp; "
            "P O D W Y Ż K A", "kicker"),
          P("Formuła rozmowy o podwyżkę", "h1"),
          P("Cztery kroki — od zapowiedzi po „nie”", "sub"),
          P("Krok 1 · Zapowiedź (na 1:1, spokojnie, jesienią)", "h2"),
          P("„Chciałbym porozmawiać o moim wynagrodzeniu w kontekście przyszłorocznego "
            "budżetu. Kiedy jest na to dobry moment?”", "cyt"),
          P("Nie prosisz o podwyżkę. Prosisz o termin rozmowy." + M("To zmienia wszystko") + "."),
          P("Krok 2 · Argument: wartość i rynek, nigdy potrzeba", "h2"),
          P("„Firmy nie płacą za potrzeby. Płacą za wartość i za rynek.”", "cyt"),
          tabela(["DZIAŁA", "POGRĄŻA"],
                 [["konkretne wyniki z liczbami (jaki projekt, jaki procent, jaki efekt)",
                   "„Mam kredyt.”"],
                  ["poszerzony zakres odpowiedzialności — od kiedy, o co",
                   "„Koledzy zarabiają więcej.”"],
                  ["widełki rynkowe podane rzeczowo (skąd dane)", "„Należy mi się za staż.”"]],
                 [255, 155]),
          P("„Twój szef nie może pójść do swojego szefa ze zdaniem: bo on ma kredyt.”", "cyt"),
          P("Przygotuj przed rozmową — to jest to, z czym Twój szef idzie na kalibrację:"),
          pole("3 wyniki z ostatnich 12 miesięcy, każdy z liczbą:"),
          pole("Co doszło do zakresu od ostatniej zmiany pensji:"),
          pole("Widełki rynkowe dla mojej roli i lokalizacji (źródło):"),
          pole("Kwota / procent, o który proszę:"),
          P("Krok 3 · Domknięcie pisemne (tego samego dnia)", "h2"),
          ramka(["Dziękuję za rozmowę o wynagrodzeniu. Zrozumiałem, że umówiliśmy",
                 "się wrócić do tematu w ______ [miesiąc]. Do tego czasu ______",
                 "[ustalone kryteria / co ma się wydarzyć]."]),
          sp(2),
          P("„Obietnice płacowe mają najkrótszą pamięć ze wszystkich obietnic korporacyjnych. "
            "Mail ją wydłuża.”", "cyt"),
          P("Krok 4 · Gdy słyszysz „nie”", "h2"),
          P("„Odmowa nie kończy gry. Źle obsłużona odmowa — tak.”", "cyt"),
          numer(1, "<b>Bez dąsów i bez gróźb.</b> Odmowa naprawdę bywa matematyką. "
                   "Nie oceną Twojej wartości."),
          numer(2, "<b>Zamieniasz „nie” na kryteria i termin:</b> „Co konkretnie musi się "
                   "wydarzyć, żebyśmy wrócili do tej rozmowy za pół roku z innym wynikiem?”"),
          numer(3, "<b>Mail z ustaleniami i terminem. Zawsze.</b>"),
          numer(4, "Jeśli „nie” powtarza się cykl po cyklu mimo spełnionych kryteriów — "
                   "to już nie jest informacja o budżecie, tylko o Twojej pozycji w tej firmie."),
          P("Na koniec — oferta z rynku", "h3"),
          P("„Ofertę z rynku traktuj jako decyzję o odejściu, nie jako dźwignię do podwyżki.” "
            "Jesteś gotów odejść? Możesz o niej uczciwie porozmawiać. Nie jesteś gotów? "
            "Nie wyciągaj tej karty —" + M("licytujesz czymś, czego nie chcesz położyć "
            "na stole") + "."),
          sp(3),
          P("MICHAŁ BEZ STRESU · michalbezstresu.pl · dodatek do odcinka #9 "
            "„Staraj się, staraj”", "stopka")]
    return F

# ════════════════════════════════════════════════════════════════════════════
# WERSJA ANGIELSKA — strony 1–2 (dokumentowanie). Strony 3–4 (dodatek
# z odcinka #9 o podwyżce) celowo NIE tłumaczone: odcinek jest po polsku,
# więc dodatek bez niego wisi w próżni. Decyzja Klaudiusza i Michała, 23.09.
# Tłumaczenie: Klaudiusz. Struktura wywołań identyczna jak w tresc().
# ════════════════════════════════════════════════════════════════════════════
def tresc_en():
    F = []
    F += [P("W O R K I N G &nbsp; I N &nbsp; A &nbsp; C O R P O R A T I O N &nbsp; · &nbsp; "
            "D O C U M E N T I N G", "kicker"),
          P("Checklist: how to document<br/>difficult situations at work", "h1"),
          P("Michał bez Stresu · free material for subscribers", "sub"),
          P("The company documents everything from your first day at work — emails, reviews, "
            "agreements. That's normal. And you have exactly the same right to do so."),
          P("Documenting is not informing on anyone and not preparing for war. It's calmly "
            "writing down " + M("facts") + " so that six months from now you don't have to rely "
            "on memory — yours or anyone else's. It takes 5 minutes after a difficult conversation. "
            "Sometimes it's worth a great deal more."),
          P("1 · The rule: a note within 5 minutes of the conversation", "h2"),
          P("Right after a difficult conversation, write down the facts — while you still remember "
            "them exactly. Not interpretations, not emotions. Facts."),
          sp(3),
          ramka(["DATE and TIME: 7 Jul 2026, approx. 2:30 pm",
                 "WHO WAS PRESENT: me, [manager], [witnesses]",
                 "WHERE / HOW: meeting room / online call / at the desk",
                 "WHAT IT WAS ABOUT: (one or two sentences)", "",
                 "WHAT WAS SAID (specifically):", "  - \"[quote or close paraphrase]\"", "",
                 "AGREEMENTS / EXPECTATIONS:", "  - what, by when, by what criterion", "",
                 "WHAT I SAID / WHAT I ASKED ABOUT:", "  - ...", "",
                 "TO DO ON MY SIDE:", "  [ ] ..."]),
          sp(7),
          P("Why it works: a week later, memory plays tricks on both sides. A dated note, "
            "written while it's fresh, " + M("sorts out the facts and calms things down") + "."),
          P("2 · What to write down after every difficult situation", "h2")]
    for x in ["Date and time — always, that's the basis",
              "Who was present (and who saw/heard it)",
              "Channel — conversation, meeting, email, messenger",
              "Specific words / expectations — quotes, not generalities",
              "Agreements — what, by when, by what criterion \"done\"",
              "What you said / what you asked about",
              "Your next steps after the conversation (and whether done)",
              "Written trail — a short summary by email, if the conversation was verbal"]:
        F.append(checkbox(x))
    F += [sp(8),
          P("The overriding rule: " + M("facts instead of judgements") + ". Instead of \"my boss was "
            "unfair\" → \"I received feedback on X; no specific example was given\"."),
          ]
    # naglowek 3 trzymany razem z lista — inaczej zostaje sierota na dole str. 1
    _s3 = [P("3 · Where to keep your documentation", "h2")]
    for x in ["A copy outside company equipment and accounts — access to your work laptop "
              "and email can be cut off overnight",
              "Private space — private email, private cloud, a notebook",
              "Don't copy confidential company data or other people's data — document your own "
              "situation and your own agreements",
              "Write as you go, not \"someday\" — an entry dated the same day is worth more"]:
        _s3.append(checkbox(x))
    F.append(KeepTogether(_s3))
    F += [P("4 · 10 sentences: a calm reply to unfair feedback", "h2"),
          P("Don't reply \"in the heat of the moment\". Wait, cool down, reply calmly and in writing. "
            "You can combine the sentences.")]
    grupy = [("To buy time:",
              ["\"Thank you. I want to respond properly — I'll come back to you by [date].\"",
               "\"I'll summarise what we agreed by email, so we have it in writing.\""]),
             ("To pin things down (generality → specific):",
              ["\"Could we go through this on a specific example?\"",
               "\"What would a sufficient result look like in practice?\"",
               "\"How will we know the expectation has been met?\""]),
             ("To present your perspective:",
              ["\"I understand the feedback. Let me add context that may matter: [facts].\"",
               "\"I see this differently and I'd like to explain — I'm basing this on [specifics].\"",
               "\"I want to improve. I'd like the assessment to be based on facts.\""]),
             ("To leave a trail and close:",
              ["\"For the record, here's a summary of what we agreed: [points]. Let me know "
               "if I've captured anything differently.\"",
               "\"If I understand correctly, by [date] I'm to [task] according to [criterion]. "
               "Can you confirm?\""])]
    for tytul, zdania in grupy:
        F.append(P(tytul, "h3"))
        for i, z in enumerate(zdania, 1):
            F.append(numer(i, z))
    F.append(P("5 · What NOT to do", "h2"))
    for x in ["Don't reply to difficult feedback the same day, in the grip of emotion",
              "Don't write labels (\"bullying\", \"spite\") where facts are enough",
              "Don't record conversations without checking whether and when you're allowed to",
              "Don't take confidential company materials or other people's data",
              "Don't leave the only copy of your documentation on company equipment"]:
        F.append(checkbox(x))
    F += [sp(9),
          Table([[P("<b>Important:</b> this is educational material, not legal advice. Every "
                    "situation is different, and laws and internal regulations vary. If the matter "
                    "is serious (suspected bullying, disciplinary action, a dispute over dismissal) — "
                    "consult a lawyer or your labour inspectorate.", "small")]],
                colWidths=[W - 2 * MARG],
                style=TableStyle([("BOX", (0, 0), (-1, -1), 0.6, LINIA),
                                  ("LEFTPADDING", (0, 0), (-1, -1), 10),
                                  ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                                  ("TOPPADDING", (0, 0), (-1, -1), 8),
                                  ("BOTTOMPADDING", (0, 0), (-1, -1), 8)])),
          sp(12),
          P("MICHAŁ BEZ STRESU · 20 years in corporate life. I know the rules of the game and "
            "I teach how to play it.<br/>"
            "Straight talk. Calm. On your side. · michalbezstresu.pl", "stopka")]
    return F


def main():
    global STRONA
    argv = [a for a in sys.argv[1:] if a != "--en"]
    ang  = "--en" in sys.argv

    if ang:
        STRONA = "p."
        domyslna = "checklist-documenting-EN.pdf"
        tytul = "Checklist: documenting difficult situations at work"
        zawartosc = tresc_en
    else:
        domyslna = "checklista-dokumentowanie.pdf"
        tytul = "Checklista: dokumentowanie trudnych sytuacji w pracy"
        zawartosc = tresc

    out = argv[0] if argv else os.path.join(
        os.path.dirname(os.path.abspath(__file__)), domyslna)
    doc = BaseDocTemplate(out, pagesize=A4,
                          leftMargin=MARG, rightMargin=MARG,
                          topMargin=20 * mm, bottomMargin=20 * mm,
                          title=tytul,
                          author="Michał bez Stresu")
    frame = Frame(MARG, 20 * mm, W - 2 * MARG, H - 40 * mm, id="tresc",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="std", frames=[frame], onPage=rama)])
    doc.build(zawartosc())
    print("zapisano:", out)


if __name__ == "__main__":
    main()
