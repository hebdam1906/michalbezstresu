# Michał bez Stresu — strona główna (Astro)

## Struktura

```
src/
  pages/index.astro        ← strona główna (składa komponenty)
  layouts/Layout.astro     ← meta, fonty, SEO
  components/
    Nav.astro
    Hero.astro             ← element podpisowy: notatka służbowa
    Odcinki.astro          ← renderuje z src/data/odcinki.js
    LeadMagnet.astro       ← TU wklejasz embed MailerLite
    Produkty.astro         ← książka + szkolenia B2B
    OMnie.astro
    Stopka.astro
  data/odcinki.js          ← lista odcinków (docelowo Supabase)
  styles/global.css        ← tokeny kolorów i typografia
```

## Uruchomienie lokalnie (Mac)

```bash
npm install
npm run dev        # → http://localhost:4321
```

## Wdrożenie na Vercel

1. Utwórz repo na GitHub i wypchnij projekt:
   ```bash
   git init && git add -A && git commit -m "start"
   git remote add origin git@github.com:TWOJ_LOGIN/michalbezstresu.git
   git push -u origin main
   ```
2. vercel.com → Add New Project → wybierz repo.
   Vercel sam wykryje Astro — zero konfiguracji.
3. Settings → Domains → dodaj `michalbezstresu.pl`
   i ustaw rekordy DNS u rejestratora wg wskazówek Vercela.

Od tej pory każdy `git push` = automatyczny deploy.

## Po wdrożeniu — 3 kroki

1. **MailerLite**: Forms → Embedded form → wklej kod w
   `LeadMagnet.astro` w oznaczonym miejscu (usuń placeholder).
2. **Nowy odcinek**: dodaj obiekt na górze `src/data/odcinki.js`,
   commit, push — gotowe.
3. **Linki social**: podmień adresy kanałów w `Stopka.astro`
   i `data/odcinki.js` na właściwe.

## Etap 2 (gdy pipeline ruszy)

- Tabela `odcinki` w Supabase + fetch w `Odcinki.astro`
- Scenariusz 3 w Make.com dopisuje rekord po akceptacji
- Deploy hook Vercela wywoływany z Make po publikacji
  (Settings → Git → Deploy Hooks → URL do modułu HTTP)
