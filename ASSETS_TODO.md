# ASSETS_TODO — segnaposto da sostituire

Elenco di OGNI immagine, dato o testo provvisorio del sito. Aggiornare questo file quando si aggiunge un nuovo segnaposto.

## Come si sostituisce un segnaposto

1. Ottimizza la foto (vedi sotto) e salvala in `public/uploads/<entità>/` (cartelle: `campaigns`, `aisles`, `stores`, `brands`, `flyers`, `promotions`).
2. Apri il JSON corrispondente in `content/` e metti il percorso nel campo indicato, per esempio
   `"immagine": { "src": "/uploads/aisles/casa-e-cucina.webp", "alt": "Cucina con stoviglie colorate", "label": "Casa e cucina" }`.
   Il percorso inizia con `/uploads/...` (senza `public`). Scrivi sempre un `alt` descrittivo.
3. Se il testo/dato era marcato `"provvisorio": true`, dopo la conferma del cliente mettilo a `false` (o rimuovi il campo).
4. `npm run build`: se un JSON è malformato l'errore indica file e campo.

**Ottimizzare le foto** (consigliato, da terminale, serve ImageMagick o `sharp-cli`):

```bash
# ridimensiona e converte in WebP qualità 80 (esempio: hero)
npx sharp-cli -i originale.jpg -o hero.webp resize 2400 1350 --fit cover -f webp -q 80
# alternativa con ImageMagick
magick originale.jpg -resize 2400x1350^ -gravity center -extent 2400x1350 -quality 80 hero.webp
```

Il sito è un export statico con `images.unoptimized`: le immagini vanno quindi consegnate GIÀ ridimensionate e compresse.

## Logo

| Cosa | Dove compare | File/campo | Formato | Dimensioni | Stato |
|---|---|---|---|---|---|
| Logo vettoriale (colore e bianco) | Header, menu mobile, footer | `components/ui/Logo.tsx` (unico file; istruzioni nel commento in testa) + `public/brand/logo.svg`, `logo-white.svg` | SVG | altezza 40 px visualizzata | Provvisorio: wordmark testuale |
| Favicon / icone app | Scheda browser | `app/` (icon.svg o icon.png, apple-icon.png) | SVG o PNG | 512×512 | Mancante |
| Immagine Open Graph di default | Anteprime social | `lib/seo.ts` (parametro `image`) + file in `public/` | JPG/PNG | 1200×630 | Mancante |

## Campagne / hero

| Cosa | Dove compare | File/campo | Formato | Dimensioni | Stato |
|---|---|---|---|---|---|
| Hero di default | Home, hero | `content/campaigns.json` → `default.immagineHero.src` | WebP/AVIF | 2400×1350, ≤300 KB | Segnaposto (null) |
| Hero Halloween 2026 | Home, hero (1/10–1/11/2026) | `campaigns.json` → `halloween-2026.immagineHero.src` | WebP/AVIF | 2400×1350, ≤300 KB | Segnaposto (null) |
| Hero Natale 2026 | Home, hero (27/11/2026–6/1/2027) | `campaigns.json` → `natale-2026.immagineHero.src` | WebP/AVIF | 2400×1350, ≤300 KB | Segnaposto (null) |
| Testi delle 3 campagne | Home, hero | `campaigns.json` (titolo, sottotitolo) | testo | — | Provvisori |

## Corridoi

| Cosa | Dove compare | File/campo | Formato | Dimensioni | Stato |
|---|---|---|---|---|---|
| Foto corridoio Casa e cucina | Home (bento), pagina corridoio (4/5) | `content/aisles.json` → `casa-e-cucina.immagine.src` | WebP | 1200×1500 (copre anche 4:3 con ritaglio centrale; per le card bento 1200×900) | Segnaposto |
| Foto Biancheria e arredo | idem | `biancheria-e-arredo.immagine.src` | WebP | idem | Segnaposto |
| Foto Pulizia e cura persona | idem | `pulizia-e-cura-persona.immagine.src` | WebP | idem | Segnaposto |
| Foto Animali | idem | `animali.immagine.src` | WebP | idem | Segnaposto |
| Foto Giardinaggio | idem | `giardinaggio.immagine.src` | WebP | idem | Segnaposto |
| Foto Hobby, cartoleria e auto | idem | `hobby-cartoleria-auto.immagine.src` | WebP | idem | Segnaposto |
| Testi dei 6 corridoi (descrizioni, SEO) | Home, pagine corridoio | `aisles.json` | testo | — | Provvisori |
| Elenco e nomi dei corridoi | Menu, home, footer | `aisles.json` + `content/navigation.json` | — | — | Provvisorio, da confermare |

## Idee in evidenza (4 per corridoio, 24 in tutto)

| Cosa | Dove compare | File/campo | Formato | Dimensioni | Stato |
|---|---|---|---|---|---|
| Foto idea (Pentole, Tavola, Contenitori, Piccoli elettrodomestici; Lenzuola, Asciugamani, Tende e tappeti, Cuscini e plaid; Bucato, Scope e mop, Igiene e carta, Bagno e benessere; Cibo, Cucce, Giochi, Igiene animali; Vasi, Attrezzi, Irrigazione, Semi e bulbi; Cancelleria, Fai da te, Elettronica, Auto) | Pagina corridoio, "Idee in evidenza" | `aisles.json` → `<corridoio>.inEvidenza[n].immagine.src` | WebP | 1200×900 (4:3), ≤150 KB | Segnaposto |

## Sedi / foto negozi

| Cosa | Dove compare | File/campo | Formato | Dimensioni | Stato |
|---|---|---|---|---|---|
| Foto negozio Prato | Dove siamo (home e pagina) | `content/stores.json` → `prato.immagine.src` | WebP | 1600×1000 (16:10) | Segnaposto |
| Foto negozio Lucca | idem | `lucca.immagine.src` | WebP | 1600×1000 | Segnaposto |
| Foto negozio Sesto Fiorentino | idem | `sesto-fiorentino.immagine.src` | WebP | 1600×1000 | Segnaposto |

## Brand (loghi)

| Cosa | Dove compare | File/campo | Formato | Dimensioni | Stato |
|---|---|---|---|---|---|
| 14 loghi segnaposto ("Brand Cucina" ... "Brand Hobby") | Home, marquee brand | `content/brands.json` → `[n].logo.src`, `nome`, `url` | SVG o PNG trasparente | altezza 120 px, monocromatici se possibile | Segnaposto (nomi fittizi) |

## Volantini

| Cosa | Dove compare | File/campo | Formato | Dimensioni | Stato |
|---|---|---|---|---|---|
| Volantino "Speciale Halloween" (copertina, 3 pagine, PDF) | Offerte, home (teaser) | `content/flyers.json` → `halloween-2026` (`copertina`, `pagine`, `pdf`) | JPG/WebP + PDF | pagine 1600×2263 (A4), ≤400 KB; PDF ≤10 MB | Prova: SVG e PDF generati in `public/uploads/flyers/` |
| Volantino "Torna la scuola" (copertina, 2 pagine, PDF) | Offerte, archivio | `flyers.json` → `settembre-2026` | idem | idem | Prova (scaduto, serve a testare l'archivio) |
| Volantini reali | Offerte | `flyers.json` + `public/uploads/flyers/` | idem | idem | Da fornire; poi cancellare i due di prova |

## Promozioni

| Cosa | Dove compare | File/campo | Formato | Dimensioni | Stato |
|---|---|---|---|---|---|
| Immagini delle 3 promozioni (Halloween, Bucato in scorta, Coccole per i tuoi amici) | Offerte, schede promozione | `content/promotions.json` → `[n].immagine.src` | WebP | 1200×750 (16:10) | Segnaposto |
| Testi delle promozioni | Offerte | `promotions.json` | testo | — | Provvisori |

## Carta fedeltà

| Cosa | Dove compare | File/campo | Formato | Dimensioni | Stato |
|---|---|---|---|---|---|
| Testi (intro, 3 vantaggi, come richiederla, FAQ), regolamento, costi, punti | Home (blocco), /carta-fedelta/ | `content/loyalty.json` | testo | — | Provvisori: da fornire dal cliente |
| Grafica tessera reale | Mockup tessera | `components/loyalty/LoyaltyCardMockup.tsx` | SVG/PNG | 856×540 | Mockup generico blu/magenta |

## Dati mancanti

| Cosa | Dove compare | File/campo | Stato |
|---|---|---|---|
| Numero WhatsApp Business (formato internazionale senza +, es. 39333...) | Pulsante flottante, footer, contatti, carta fedeltà | `content/settings.json` → `whatsapp.numero` | Mancante (null: il pulsante non compare) |
| Telefoni dei 3 negozi | Dove siamo, JSON-LD | `content/stores.json` → `[n].telefono` (anche `email`, `whatsapp`) | Mancanti (null) |
| Orari dei 3 negozi (settimana 0=domenica...6) | Dove siamo, stato "Aperto ora", JSON-LD | `stores.json` → `[n].orari` e `noteOrari` | Mancanti (null: niente "Aperto ora") |
| Particolarità e servizi di ogni sede | Dove siamo | `stores.json` → `particolarita`, `servizi` | Provvisorie, da validare |
| CAP Sesto Fiorentino (50019) | Dove siamo, JSON-LD | `stores.json` → `sesto-fiorentino.indirizzo.cap` | Da confermare |
| Coordinate delle sedi | Mappe, indicazioni, JSON-LD | `stores.json` → `coordinate` | Approssimate, da verificare |
| Google Analytics 4 | Dopo consenso statistiche | `settings.json` → `analytics.gaId` (G-XXXXXXXXXX) | Mancante (null: nessuno script) |
| Meta Pixel | Dopo consenso marketing | `settings.json` → `analytics.metaPixelId` | Mancante (null) |
| Testi legali (privacy e cookie policy) | /privacy-policy/, /cookie-policy/ | `app/(site)/privacy-policy/page.tsx`, `cookie-policy/page.tsx` | Provvisori: far validare a un consulente / Iubenda; completare elenco fornitori e durate cookie |
| Dominio canonico (apex `home-co.it` vs `www.home-co.it`) | Canonical, sitemap, Open Graph | `lib/site.ts` (`SITE_URL`) e `settings.json` → `siteUrl` | Oggi apex; verificare e configurare il redirect dell'altro su Cloudflare |
| Integrazione invio form contatti | /contatti/ | `lib/contact/adapter.ts` + `NEXT_PUBLIC_CONTACT_ADAPTER` | Mock: i messaggi NON vengono inviati |
| Redirect vecchi URL WordPress | Vecchio sito | `public/_redirects` | Da verificare su un elenco reale di URL indicizzati |
