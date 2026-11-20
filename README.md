# Home & Co. — sito vetrina

Sito di Home & Co. (HCO SRL), catena di casalinghi con tre negozi in Toscana (Prato, Lucca, Sesto Fiorentino). È uno sviluppo indipendente dal WordPress precedente: il cliente non richiede di riutilizzarne dominio e hosting. È pensato per diventare, in futuro, anche un e-commerce (`/shop`) appoggiato a API .NET.

## Indice

1. [Panoramica](#1-panoramica)
2. [Requisiti e comandi](#2-requisiti-e-comandi)
3. [Deploy su Cloudflare Pages](#3-deploy-su-cloudflare-pages)
4. [Struttura delle cartelle](#4-struttura-delle-cartelle)
5. [Come si modificano i contenuti](#5-come-si-modificano-i-contenuti)
6. [Design system](#6-design-system)
7. [Cookie, analytics e form contatti](#7-cookie-analytics-e-form-contatti)
8. [Collegare le API .NET in futuro](#8-collegare-le-api-net-in-futuro)
9. [Aggiungere un pannello admin](#9-aggiungere-un-pannello-admin)
10. [TODO aperti per il cliente](#10-todo-aperti-per-il-cliente)

## 1. Panoramica

- Next.js (App Router) + TypeScript strict, Tailwind CSS v4 (token in `@theme` dentro `app/globals.css`), `motion` per le animazioni, Zod per validare i contenuti.
- **Export statico** (`output: "export"`, `trailingSlash: true`): `npm run build` produce HTML in `out/`. Le immagini responsive vengono generate prima della build, senza un server immagini.
- Tutti i testi e le immagini stanno in `content/` e `public/uploads/`, mai nei componenti. I componenti ricevono i dati da `lib/content`.
- Dove manca una foto compare un segnaposto (`<Placeholder />`): l'elenco è in [ASSETS_TODO.md](ASSETS_TODO.md).

## 2. Requisiti e comandi

Serve **Node 22**.

```bash
npm install          # dipendenze
npm run dev          # sviluppo su http://localhost:3000
npm run build        # export statico in out/
npx serve out        # anteprima della build (oppure: npm start)
npm test             # vitest
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
```

`dev` e `build` preparano automaticamente le varianti WebP delle immagini con Sharp. Gli originali in `public/uploads/` restano intatti. Se aggiungi foto durante una sessione di sviluppo, esegui `npm run images:prepare` o riavvia `npm run dev`. `lib/image-manifest.json` è versionato; `public/_images/` è generato e ignorato da Git.

## 3. Deploy su Cloudflare Pages

Il sito può essere pubblicato su un dominio nuovo senza accessi a WordPress o al vecchio hosting. Prima della build finale impostare `NEXT_PUBLIC_SITE_URL` con l’URL canonico scelto; il cambio richiede una nuova build. Le email aziendali e le fonti delle foto mantengono i loro indirizzi originali.

Impostazioni del progetto:

| Voce | Valore |
|---|---|
| Framework preset | `Next.js (Static HTML Export)` |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Variabile `NODE_VERSION` | `22` |

- `public/_redirects` (301 dai vecchi URL WordPress) e `public/_headers` (cache lunga su `/_next/static/*`, header di sicurezza) vengono copiati in `out/` e letti da Cloudflare. `/offerte/`, `/contatti/`, `/privacy-policy/`, `/cookie-policy/` restano identici al vecchio sito grazie a `trailingSlash`.
- **Cache dei visitatori.** HTML, dati `.txt` delle navigazioni Next, foto originali, loghi e PDF hanno `max-age=0, must-revalidate`: ai nuovi accessi il browser verifica se il file è cambiato, riutilizzando la copia se invariata. JS/CSS e varianti responsive in `/_images/` hanno hash nel nome e cache lunga `immutable`: sostituire una foto produce automaticamente URL nuovi. Le regole sono pronte per Cloudflare Pages; il server locale Python non applica `_headers`. Al lancio verificare le intestazioni sul dominio reale, senza regole CDN aggiuntive che forzino cache lunghe sulle pagine. Un file già memorizzato con una vecchia scadenza non si può invalidare retroattivamente nel browser: per sostituzioni di materiali originali già pubblicati usare nomi di file nuovi.
- **Deploy Hook giornaliero.** La campagna attiva e i volantini validi vengono scelti **in build**, così l'HTML è già corretto e senza flash. Il browser ricontrolla la data dopo l’idratazione (non prima del primo paint), ogni 30 secondi e al ritorno sulla scheda, e aggiorna solo i contenuti: hero, collezione stagionale, reparti e volantini. Con un HTML di build vecchio può comparire per un istante l’hero della campagna precedente. La palette non cambia mai: i colori sono fissi. Ma lo HTML statico (SEO, anteprime social, elenco volantini) cambia solo con una nuova build: crea in Cloudflare Pages un **Deploy Hook** e salva il suo URL nel secret GitHub **`CLOUDFLARE_DEPLOY_HOOK_URL`**. Il workflow incluso `.github/workflows/seasonal-refresh.yml` lo richiama ogni notte alle 01:15 UTC (02:15/03:15 in Italia); si può anche avviare a mano. Senza il secret salta il rinnovo con un avviso: il cambio nei browser continua a funzionare, ma l’HTML per i motori di ricerca si aggiorna solo al prossimo deploy. Il richiamo conferma la richiesta di build, non l’esito del deploy: quest’ultimo va controllato su Cloudflare.

Per attivare il richiamo su un progetto Pages collegato a GitHub:

1. Cloudflare → Workers & Pages → progetto → Settings → Builds → Add deploy hook. Nome suggerito: `campagne-giornaliere`; branch: quello di produzione.
2. Copiare l'URL nel repository GitHub → Settings → Secrets and variables → Actions → New repository secret, nome `CLOUDFLARE_DEPLOY_HOOK_URL`. L'URL è riservato: non va nei file del sito o nelle variabili `NEXT_PUBLIC_*`.
3. Il workflow deve essere presente sul branch predefinito del repository e GitHub Actions deve essere abilitato. Avviare Actions → Aggiorna campagne stagionali → Run workflow e controllare che il nuovo deploy Cloudflare termini correttamente.
4. Verificare sul dominio pubblico cache, tema e HTML della nuova build. I job pianificati GitHub possono subire ritardi; nei repository pubblici inattivi per 60 giorni possono essere disabilitati. Il cambio nel browser non dipende dal job; verificare periodicamente che l'aggiornamento dell'HTML resti attivo.

Il solo caricamento manuale di `out/` non collega un repository che Cloudflare possa ricostruire con il Deploy Hook. Un progetto creato con Direct Upload non può essere convertito a Git integration: occorre un nuovo progetto collegato a Git oppure una pipeline di build e upload propria. [Guida ai Deploy Hook](https://developers.cloudflare.com/pages/configuration/deploy-hooks/) · [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/).

## 4. Struttura delle cartelle

```
app/
  layout.tsx, globals.css       layout radice, font, token del design system
  sitemap.ts, robots.ts         statici (force-static)
  (site)/                       sito vetrina
    page.tsx                    home
    offerte/  dove-siamo/ (indice) e dove-siamo/[slug]/ (un negozio)  carta-fedelta/  contatti/
    corridoi/[slug]/            pagine corridoio (generateStaticParams)
    privacy-policy/  cookie-policy/
    design-system/              vetrina dei componenti (non in sitemap)
  (shop)/                       RISERVATO al futuro e-commerce (oggi non esiste)
components/
  ui/ motion/ layout/ sections/ campaign/ aisles/ flyers/ stores/
  loyalty/ consent/ contact/ legal/ seo/
content/                        TUTTI i contenuti in JSON (validati con Zod)
lib/
  content/                      schemi Zod, ContentSource, FileContentSource, funzioni di comodo
  api/types.ts                  tipi dello shop futuro (Category, Product, Price)
  campaigns.ts flyers.ts stores.ts   logica pura (campagna attiva, validità volantini, orari)
  contact/adapter.ts            invio del form contatti
  seo.ts analytics.ts site.ts utils.ts
  __tests__/                    test vitest
public/
  uploads/<entità>/             immagini e PDF gestiti come contenuto
  _redirects  _headers
```

## 5. Come si modificano i contenuti

Ogni JSON è validato all'avvio/build: se sbagli un campo l'errore dice file e percorso. I campi `"provvisorio": true` segnalano testi o dati da confermare.

### Menu
Un solo file: `content/navigation.json`, oggetto con `voci` (array di `{ "label", "href", "evidenza"? }`, **massimo 10 voci** oltre ai reparti) e `gruppi` (i 5 gruppi della barra desktop e delle 5 schede di «I reparti» in home, ciascuno con `titolo`, `breve`, `immagine` `{ src, alt }` e `reparti`: href). Ogni reparto deve stare in un solo gruppo, altrimenti la build si ferma. `evidenza: true` mette la voce in risalto.

Su desktop i gruppi stanno direttamente nella barra bianca: passando il mouse (o con clic, Invio, freccia giù) si apre la tendina con i reparti del gruppo e la sua foto. Tra 1024 e 1279 px la barra usa `breve` («Casa», «Giardino»…), da 1280 px il `titolo` intero. Dopo i gruppi, in magenta, c'è la voce di stagione: compare solo se la campagna attiva per data ha una `collezione` (oggi «Natale», dal 1/11 al 25/12) e la sua tendina elenca le idee della collezione, ognuna verso il suo reparto. Negozi e Contatti stanno nella fascia blu in alto. Su mobile restano la tab bar in basso e il pannello «Tutti i reparti». In cima al pannello compare lo stesso gruppo di stagione, in magenta, con le idee e l'invito della campagna (`seasonalMenu` in `lib/navigation.ts`, usato da entrambi). La tab attiva ha la lineetta magenta in alto, come la sottolineatura della barra desktop.

### Desktop e mobile: cosa vale dove
Il feedback del 19/11/2026 riguardava **solo il desktop** (da 1024 px, `lg:` di Tailwind). Dal 20/11 anche il mobile riprende quel linguaggio.

Cosa è stato portato sul mobile (blocco A, home e navigazione):
- hero scorrevole (`HomeHeroMobile`) con le slide del banner;
- titoli sfumati e titoli di sezione più grandi;
- «Natale» con la parola grande e il ventaglio di foto;
- fascia dei fatti in vetro;
- riquadri che si colorano al tocco;
- gruppo di stagione nel pannello Reparti.

Cosa è stato portato sul mobile (blocco B, reparti e volantino):
- testata con foto e titolo sfumato (`MobileHero`);
- fascia di chiusura del reparto con sfondo sfumato e nome del reparto evidenziato, ferma;
- scheda «In breve» e miniature del volantino.

Restano solo desktop: neve, cuore allo scorrimento, splash, bagliori in movimento e cuore rotante della fascia di chiusura.

Ogni lato si modifica senza cambiare l'altro. Le regole:
- **lato desktop:** le classi nuove sono `lg:` o superiori; dove serve un layout diverso c'è un componente solo desktop (`HomeBanner`, `WideHero`) accanto a quello mobile con `lg:hidden`;
- **lato mobile:** classi `max-lg:` oppure classi base che hanno già la loro versione `lg:` (che vince da 1024 px), componenti con `lg:hidden` e CSS in `@media (max-width: 1023.98px)`;
- gli effetti (neve, cuore allo scorrimento) si montano solo dopo l'idratazione e solo se `(min-width: 1024px)` è vero (`lib/use-media-query.ts`): sotto quella larghezza non esistono nemmeno nel DOM;
- le immagini solo desktop non sono `priority`: in un contenitore nascosto non vengono scaricate su mobile;
- prima di chiudere si confrontano gli screenshot dell'altro lato, prima e dopo: mobile a 390 px, desktop a 1440 e 1024 px. Il desktop si confronta una vista alla volta, scorrendo: la cattura a pagina intera di Chrome (`captureBeyondViewport`) dipinge in modo diverso il vetro sfocato (`backdrop-filter`) e dà differenze di pixel che a schermo non esistono.

### Banner della home (desktop)
Da bordo a bordo, rapporto **3:1**. La prima slide è sempre la campagna attiva per data: la sua grafica `bannerDesktop` (3840 × 1280 px, testi nella grafica) o, se manca, `immagineHero` con titolo e pulsanti sopra. Le slide successive sono in `content/home.json` → `banner.slide` (massimo 4): con `titolo` mostrano testo e pulsante sulla foto, senza `titolo` sono grafiche e tutta la slide è un link (`link`). `src: null` mostra un segnaposto con l'`label` indicata. Oggi la terza slide è un segnaposto scelto da noi, con «(segnaposto)» nel titolo, in attesa della grafica. Cambio automatico ogni 7 s con frecce ai lati, pallini e pausa; si ferma solo con il pulsante di pausa, con la navigazione da tastiera dentro il banner, quando è fuori dallo schermo o la scheda non è visibile; con movimento ridotto non parte da solo. Le foto devono essere larghe almeno 2880 px (test `desktop-feedback`).

Sotto 1024 px le stesse slide sono schede che si scorrono col dito (`components/sections/HomeHeroMobile.tsx`). Prima viene la campagna (`immagineHero`, mai `bannerDesktop`), poi le slide con `titolo`. Le slide senza titolo (grafiche 3:1 con i testi dentro) e quelle con `"soloDesktop": true` restano solo al desktop: oggi il segnaposto. Niente scorrimento automatico: la scheda successiva si intravede a destra e i pallini sotto indicano la posizione.

### Effetti di stagione
Si accendono con le **date della campagna**, come tutto il resto: in `content/campaigns.json` la campagna elenca i suoi `effetti` (oggi `"neve"` su Natale). Il componente `components/campaign/SeasonalEffects.tsx` legge la campagna attiva con la stessa logica di `lib/campaigns.ts` e la ricontrolla nel browser, quindi l'effetto si spegne da solo il 26 dicembre senza nuova build. Solo desktop e mai con movimento ridotto. Per un evento nuovo: aggiungere il nome in `CAMPAIGN_EFFECTS` (`lib/content/schemas.ts`), il componente nel registro `EFFECTS` di `SeasonalEffects.tsx`, e il nome negli `effetti` della campagna.

La sezione della campagna in home (`collezione`) ha su desktop campi facoltativi: `titoloGrande` (la parola enorme, almeno metà schermo), `sottotitoloGrande`, `sfondo` (foto coperta da una velatura blu) e `galleria` (2-4 foto inclinate). Senza `titoloGrande` la sezione resta quella classica anche su desktop.

### Testata desktop dei reparti e del volantino
Ogni reparto ha `immagineWide` in `content/aisles.json`: foto 2880 × 1200 px in `public/uploads/aisles/wide/<slug>.webp`, dagli originali del cliente (cartella `_Selezione`). Su desktop copre la testata da bordo a bordo, alta circa metà schermo, con il titolo grande sopra; senza `immagineWide` resta la testata classica. La pagina del volantino usa la stessa testata (`components/layout/WideHero.tsx`) con `content/pages.json` → `offerte.immagineWide`.

**Sotto 1024 px** la testata è `components/layout/MobileHero.tsx`, con la foto mobile del reparto (`immagine`) e non quella larga, che tagliata per un telefono perderebbe il soggetto:
- **sotto 544 px:** la foto copre la testata, velata di blu dal basso, con percorso, titolo sfumato, descrizione e pulsanti sopra;
- **da 544 a 1023 px:** fondo blu, testo a sinistra e foto in un riquadro di 20 rem.

Il confine è a 544 px perché la foto più piccola dei reparti è larga 1086 px: a tutta larghezza resta nitida fino a 543 px CSS (`MOBILE_HERO_MAX_CSS_WIDTH`, test `mobile-feedback`). L'entrata è quella desktop accorciata (circa 0,9 s), e nulla si muove con movimento ridotto. Il volantino usa la versione bassa (`compact`) senza pulsanti, perché subito sotto c'è il volantino con le sue azioni. Senza `immagineWide` resta la testata classica a ogni larghezza.

Sulla pagina del volantino, da desktop, accanto alla copertina c'è la scheda «In breve» (`offerte.scheda`: pagine, date, negozi, PDF, tutti dai dati del volantino) e accanto al lettore le miniature di tutte le pagine (`offerte.miniature`): un clic apre quella pagina. Sotto 1024 px la scheda «In breve» sta sotto il titolo del volantino e sostituisce le righe di date e negozi. Le miniature sono una striscia da scorrere col dito sotto il lettore e prendono il posto dei pallini; la pagina aperta resta sempre in vista. Su desktop anche i titoli di sezione (`SectionTitle`) sono molto più grandi e la sezione delle aree merceologiche arriva a 96rem di larghezza.

### Aggiungere una campagna
In `content/campaigns.json` aggiungi un oggetto (la campagna senza date è il default e non va rimossa):

```json
{
  "id": "pasqua-2027",
  "titolo": "Pasqua da Home & Co.",
  "sottotitolo": "Tavola, decorazioni e uova da regalare.",
  "inizio": "2027-03-15",
  "fine": "2027-03-29",
  "immagineHero": { "src": "/uploads/campaigns/pasqua-2027.webp", "alt": "Tavola di Pasqua", "label": "Hero Pasqua" },
  "tema": "pasqua",
  "cta": { "label": "Vedi le offerte", "href": "/offerte/" },
  "ctaSecondaria": { "label": "Trova il negozio", "href": "/#dove-siamo" },
  "corridoiInEvidenza": ["casa-e-cucina", "biancheria-e-arredo"],
  "priorita": 10,
  "provvisorio": false
}
```

Regole: date `YYYY-MM-DD`, **entrambe inclusive**, fuso Europe/Rome. Se più campagne si sovrappongono vince la `priorita` più alta, a parità l'`inizio` più recente. Fuori da ogni campagna vale il default. I colori non si configurano per campagna: l'accento è sempre il magenta del logo.

### Halloween e anteprima per data

Halloween 2026 è già configurato dal **1 al 31 ottobre inclusi**, nel fuso **Europe/Rome**. I volantini hanno intervalli indipendenti: la home li rimuove dalla vetrina alla scadenza senza spegnere la campagna. La copia PDF scaricabile è ricompressa alla stessa risoluzione per rientrare nel limite di 25 MiB di Cloudflare Pages; l’originale ricevuto resta intatto. Il volantino «Halloween da brividi» (7 pagine, tutti i negozi) vale **dal 1 al 31 ottobre 2026** e dal 1 novembre passa in archivio. Il catalogo Sesto Fiorentino di ottobre sta nell’archivio e si apre nel lettore come volantino concluso, con le date originali. Dal **1 novembre al 25 dicembre** il tema è Natale; dal 26 dicembre torna il tema base.

In `content/campaigns.json` puoi modificare date, titolo, testo, etichetta, sticker, colore, CTA e reparti. Il blocco facoltativo `collezione` contiene titolo, descrizione e `idee` (`titolo`, `testo`, `corridoio`, `immagine` opzionale): compare solo durante quella campagna. Le date inesistenti, come il 30 febbraio, bloccano la build con un errore leggibile.

Per verificare senza modificare la data del computer, apri **`/design-system/#calendario-campagne`** e scegli una data. L’anteprima è isolata e non cambia la home. Questa pagina è esclusa dall’indicizzazione. Halloween e Natale hanno `"ricorrenza": "annuale"`: gli stessi contenuti, reparti, badge e blocchi stagionali tornano ogni anno usando giorno e mese delle date configurate. Le date mostrate vengono risolte nell’anno visualizzato, anche per campagne che attraversano il cambio anno. Gli ID esistenti rimangono identificativi stabili, anche se contengono il primo anno. Per una campagna una tantum ometti `ricorrenza`. Volantini e promozioni con prezzi hanno invece date di validità proprie: non vengono ripubblicati automaticamente l’anno successivo.

### Idee e prodotti in evidenza legati agli eventi

Le card della home sono **reparti**: `corridoiInEvidenza` ne imposta l’ordine e il badge della campagna attiva. Non sono prodotti di un catalogo e non confermano disponibilità.

Per ogni voce `inEvidenza` in `content/aisles.json`, il campo facoltativo `campagne` associa invece una vera selezione all’evento, per esempio `"campagne": ["halloween-2026"]`. Le idee associate compaiono per prime, soltanto quando quella campagna è attiva, con il suo badge automatico. Le idee senza associazione restano visibili tutto l’anno con il loro badge abituale. Non assegnare il badge Halloween automaticamente a un prodotto generico: i contenuti attuali non includono una selezione di prodotti stagionali confermata.

### Aggiungere un volantino
1. Metti le pagine e il PDF in `public/uploads/flyers/` (formati in [ASSETS_TODO.md](ASSETS_TODO.md)).
2. In `content/flyers.json`:

```json
{
  "id": "natale-2026",
  "titolo": "Speciale Natale",
  "validoDal": "2026-11-27",
  "validoAl": "2026-12-24",
  "negozi": "tutti",
  "copertina": { "src": "/uploads/flyers/natale-2026-copertina.jpg", "alt": "Copertina volantino Natale", "label": "Copertina" },
  "pagine": [
    { "src": "/uploads/flyers/natale-2026-p1.jpg", "alt": "Natale, pagina 1", "label": "Pagina 1" }
  ],
  "pdf": "/uploads/flyers/natale-2026.pdf",
  "provvisorio": false
}
```

`negozi` è `"tutti"` oppure un elenco di id sede (`["prato", "lucca"]`). Ordinamento: i volantini validi oggi compaiono dal più recente (`validoDal` decrescente); quelli scaduti passano da soli nell'archivio; quelli futuri sono consultabili come **anteprima**, con data di inizio esplicita e senza essere indicati come offerte già attive.

### Aggiungere o modificare un corridoio
In `content/aisles.json`: `slug` (compare nell'URL `/corridoi/<slug>/`), `titolo`, `titoloBreve`, `descrizione`, `descrizioneLunga`, `immagine`, `inEvidenza` (idee: titolo, descrizione, immagine, badge), `ordine`, `visibile`, `seo`, `categoryId` (futuro shop). Poi aggiungi la voce in `navigation.json` se vuoi il link nel menu. La pagina nasce da sola (generateStaticParams).

### Foto degli scaffali di una categoria
Ogni pagina `/corridoi/<slug>/` mostra la sezione "Gli scaffali in negozio" se la voce in `content/aisles.json` ha almeno una foto in `scaffali` (vuoto = la sezione non compare). Per aggiungerle:

1. Salva le foto in `public/uploads/aisles/<slug>/` (stesso `slug` del corridoio), nome in minuscolo con trattini, es. `scaffale-pentole-1.webp`.
2. Formato WebP, circa 1600 px sul lato lungo (meglio orizzontali 4:3), peso contenuto. `scripts/prepare-images.mjs` genera da solo varianti responsive e manifest al prebuild.
3. Aggiungi le voci in `scaffali`; `alt` è obbligatorio, `titolo` e `descrizione` sono facoltativi. Facoltativi anche `scaffaliTitolo` (default "Gli scaffali in negozio") e `scaffaliIntro` (testo sotto il titolo).

```json
"scaffali": [
  {
    "immagine": { "src": "/uploads/aisles/casa-e-cucina/scaffale-pentole-1.webp", "alt": "Scaffale di pentole e padelle nel negozio di Prato" },
    "titolo": "Pentole e padelle",
    "descrizione": "Il lato sinistro del reparto cucina."
  }
]
```

Su smartphone le foto scorrono in orizzontale; da tablet in su sono in griglia. Un tocco apre la foto a schermo intero (Esc chiude, frecce e swipe cambiano foto).

### Sedi, brand, promozioni, impostazioni
`content/stores.json` (orari: array `{ giorno 0-6, aperture:[{da,a}] }`, `null` = non noti), `brands.json` (con `getBrands`: oggi non usato dal sito, resta per il futuro `/shop`), `promotions.json`, `settings.json` (WhatsApp, social, dati societari, analytics), `loyalty.json`. Le mappe OpenStreetMap sono caricate automaticamente (`loading="eager"`) su ogni schermo, senza pulsante di attivazione. Anche le promozioni ricontrollano inizio e fine nel browser, senza restare visibili dopo la scadenza o comparire in anticipo.

### Foto e loghi

Le foto delle corsie arrivano dal sito Home & Co. esistente. Le fotografie di ambientazione Pexels sono accompagnate da autore e licenza in `public/uploads/PHOTO_CREDITS.md`; la provenienza di ogni file è anche in `content/photo-sources.json`. Tutto è servito localmente, senza hotlink. `ImageRef.fit: "contain"` mantiene interi i prodotti e i volantini; `position` controlla il punto del ritaglio per le foto. Nessuna fotografia stock viene attribuita a un negozio Home & Co.

`scripts/prepare-images.mjs` crea varianti da 96 a 1600 px (senza ingrandire gli originali), con qualità più alta per i testi dei volantini. Il loader di Next genera `srcset` e `sizes`: il browser sceglie la risoluzione adatta allo schermo e alla sua densità. L'immagine principale ha priorità alta; le altre si caricano avvicinandosi alla vista. Nel lettore, le pagine adiacenti vengono anticipate solo quando il volantino è vicino allo schermo; lo zoom usa l'originale e il PDF viene scaricato solo su richiesta.

Il copy della home è in `content/home.json`, letto e validato da `ContentSource`; le campagne, i reparti e la carta restano nei rispettivi JSON. Il tono è diretto e concreto: evitare superlativi, promesse di risparmio o disponibilità non confermate e badge come “più scelti” senza dati reali.
Vedi [ASSETS_TODO.md](ASSETS_TODO.md) (tabella di tutti i segnaposto, formati e dimensioni). Il logo ufficiale è in `public/brand/logo.svg`, estratto in vettoriale dal PDF dell’insegna. Il componente condiviso `components/ui/Logo.tsx` lo usa in header, menu, footer e tessera. Sui fondi scuri mantiene i colori originali su una base bianca. Favicon, icona Apple, immagine social e logo PNG per i dati strutturati sono già inclusi (dettagli in `public/brand/README.md`).

## 6. Design system

- Token (blu `#0F6BB4` e magenta `#D11559` del marchio, neutri azzurrati, raggi, ombre, `--accent` fisso in magenta) in `app/globals.css`, sezione `@theme`. Font: Figtree per titoli e testo, coerente con una vetrina fotografica.
- Componenti base in `components/ui/` (Button, Card, Section, Container, Badge, Notice, Icon, Logo, Placeholder, SmartImage, Accordion), intestazione delle pagine interne `components/layout/PageHeader.tsx` (percorso + titolo compatto), titoli di sezione `components/sections/SectionTitle.tsx` e `components/motion/` (solo `HoverLift` e `MotionProvider`, che rispetta `prefers-reduced-motion`). `Reveal` e `Stagger` non esistono più.
- **Scorrimento**: rotellina, trackpad e tocco usano lo scorrimento nativo del browser, senza intercettare i gesti o mantenere un ciclo JavaScript di animazione. I link interni conservano lo scorrimento morbido CSS e gli spazi sotto l'header; con `prefers-reduced-motion` lo spostamento è immediato. Menu e finestre modali bloccano la pagina tramite `overflow`, mantenendo scorrevole il proprio contenuto.
- **Mobile: niente comparse allo scroll, niente marquee, niente splash** (brief «sito da negozio»): solo hover e transizioni brevi, `prefers-reduced-motion` rispettato.
- **Desktop (da 1024 px), su richiesta del cliente del 20/11/2026**: effetti più marcati, tutti spenti con movimento ridotto e assenti sotto 1024 px. Splash alla prima visita della home (`HomeSplash`, una volta sola per browser, si salta con clic o tasto); entrata della testata dei reparti con bande magenta e blu e titolo sfumato nei colori del logo; fascia fatti con sfondo fluido e schede di vetro che si inclinano verso il cursore; riquadri Volantino e Negozi che si riempiono di colore al passaggio del mouse; tutti i pulsanti che si ingrandiscono leggermente al passaggio del mouse. Gli stili sono in `app/globals.css`, nelle sezioni commentate per componente.
- **Palette fissa**: le campagne cambiano foto e testi, non i colori. `--accent` è sempre il magenta del logo (definito una sola volta in `app/globals.css`; nessuno script o attributo `data-theme`); lo schema delle campagne non ha più il campo colore. Coppie di contrasto AA in testa a `app/globals.css`.
- **Testata e tab bar**: `components/layout/Header.tsx` (fascia informativa con «Il tuo negozio» e Instagram da 1024 px + riga bianca + mega-menu a gruppi), `StoreChip.tsx` («Il tuo negozio», `localStorage` chiave `homeco:negozio`), `TabBar.tsx` (sotto 1024 px). Etichette in `content/settings.json` → `testata` e `piede`; voci in `content/navigation.json` (`gruppi` per il mega-menu; campo `breve` per i chip nella pagina reparto). Il contenuto riserva lo spazio della tab bar con `pb-tabbar`; il pulsante WhatsApp fluttuante sta sopra la tab bar.
- **Regola immagini**: larghezza CSS mostrata ≤ larghezza intrinseca / 2 (`lib/image-rules.ts`, test `image-resolution`). I reel 360 px si mostrano a 180 px al massimo.
- **Smartphone**: schede dei reparti e delle collezioni con foto laterale sotto i 640 px, archivio compatto sotto i 420 px, pannello reparti a schermo intero con chiusura sempre raggiungibile e collegamenti grandi. Pulsanti alti almeno 44 px, campi del modulo da 16 px e spazi per le aree sicure nelle finestre modali.
- **Lettore volantini**: lo swipe orizzontale usa Pointer Events, senza dipendere dalle feature di trascinamento di Motion. Il gesto verticale mantiene lo scorrimento nativo e il pinch resta disponibile; frecce, tastiera e zoom sono sempre accessibili. Sui dispositivi touch le frecce sono sotto l'immagine per lasciare liberi prezzi e dettagli. I PDF usano link nativi, senza richieste di prefetch alle route Next.
- La pagina **`/design-system/`** mostra tutto dal vivo. È esclusa da sitemap e robots.

## 7. Cookie, analytics e form contatti

- **Consenso**: `components/consent/` (ConsentProvider, CookieBanner, `CookiePreferencesLink` nel footer). Scelta salvata in localStorage con versione (`CONSENT_VERSION`): aumentala se cambiano finalità o categorie.
- **Analytics**: scrivi l'ID in `content/settings.json` → `analytics.gaId` (es. `G-XXXXXXXXXX`) e/o `analytics.metaPixelId`. Gli script (`lib/analytics.ts`) si caricano solo dopo il consenso (statistiche per GA4, marketing per Meta Pixel). Con `null` non succede nulla. Poi aggiorna la tabella cookie in `cookie-policy/page.tsx` e valuta un CSP in `public/_headers`.
- **Form contatti**: `lib/contact/adapter.ts` implementa l'invio Formspree compatibile con l'export statico. Creare un modulo nell'account Formspree, impostare e verificare l'indirizzo destinatario e abilitare la notifica email. In Cloudflare impostare `NEXT_PUBLIC_CONTACT_ADAPTER=formspree` e `NEXT_PUBLIC_FORMSPREE_URL=https://formspree.io/f/ID_REALE`, quindi avviare un nuovo deploy. L'indirizzo destinatario si configura sul servizio, non nel browser. Il campo `email` del visitatore permette di rispondere al mittente.
- **Disponibilità e prove**: senza provider configurato, in produzione compare un collegamento all'email aziendale. Endpoint mancanti o non validi non attivano il modulo. `mock` è una prova esplicita con avviso e conferma «Nessuna email è stata inviata»; non registra dati personali. Gli errori del servizio, di rete o di timeout non mostrano una conferma di invio e conservano i campi; è disponibile il collegamento email. In sviluppo senza configurazione si usa la prova dichiarata.
- **Attivazione reale**: dopo il deploy, concordare un messaggio di prova e confermarne la ricezione nella casella corretta. Il codice può verificare l'accettazione del servizio; la consegna della notifica va verificata nella casella. Adeguare l'informativa al fornitore effettivamente scelto. [Configurazione ufficiale Formspree su Pages](https://developers.cloudflare.com/pages/tutorials/add-a-react-form-with-formspree/). Vedi `.env.example`.

## 8. Collegare le API .NET in futuro

1. **Contenuti**: l'accesso ai dati passa dall'interfaccia `ContentSource` (`lib/content/source.ts`). Oggi `FileContentSource` legge i JSON. Scrivi `ApiContentSource` (stub commentato in `lib/content/index.ts`) che chiama l'API, valida le risposte con gli stessi schemi Zod, e scegli la sorgente con `NEXT_PUBLIC_CONTENT_SOURCE=api` (aggiungendo il `case` in `createSource()`). Le pagine non cambiano.
2. **Tipi shop**: `lib/api/types.ts` definisce `Category`, `Product`, `Price` (importi in centesimi) con la mappatura sulle DTO .NET.
3. **Da statico a server**: oggi l'export statico vieta route handler, middleware, server actions e ISR. Per il catalogo dinamico: togli `output: "export"` in `next.config.ts` (istruzioni nel commento del file), valuta il loader immagini del CMS/API al posto delle varianti statiche, sposta i redirect in `redirects()` e abilita ISR/`revalidate`. Il codice del sito vetrina è già compatibile.
4. **/shop**: nascerà in `app/(shop)/` (route group riservato). I corridoi sono già il ponte: `Aisle.categoryId` ↔ `Category.id`; la pagina `corridoi/[slug]` può rimandare a `/shop/<categoria>/` quando `categoryId` è valorizzato, riusando gli stessi componenti (AisleHero, FeaturedIdeas) con i prodotti reali al posto delle idee.

## 9. Aggiungere un pannello admin

Tre strade, in ordine di impegno crescente.

### (a) Decap CMS su Git (compatibile con l'export statico)
Pro: nessun server, gratuito, i contenuti restano JSON versionati. Contro: ogni modifica è un commit e richiede una build (30-60 s); autenticazione tramite GitHub/Git Gateway. Va bene finché i contenuti sono pochi e a modifica sporadica.

Esempio di `public/admin/config.yml` (NON incluso nel repo: crealo solo quando decidi di adottare Decap, insieme a `public/admin/index.html` che carica `decap-cms.js`):

```yaml
backend:
  name: github            # oppure git-gateway
  repo: <organizzazione>/<repo>
  branch: main
media_folder: public/uploads      # dove Decap salva i file
public_folder: /uploads           # percorso scritto nei JSON

collections:
  - name: campaigns
    label: Campagne
    files:
      - name: campaigns
        label: Elenco campagne
        file: content/campaigns.json
        fields:
          - label: Campagne
            name: items          # NB: i JSON sono array alla radice: va aggiunto un livello "items" oppure convertire il file in oggetto (adeguando lo schema)
            widget: list
            fields:
              - { label: ID, name: id, widget: string }
              - { label: Titolo, name: titolo, widget: string }
              - { label: Sottotitolo, name: sottotitolo, widget: text }
              - { label: Inizio, name: inizio, widget: datetime, date_format: YYYY-MM-DD, time_format: false, format: YYYY-MM-DD, required: false }
              - { label: Fine (inclusa), name: fine, widget: datetime, date_format: YYYY-MM-DD, time_format: false, format: YYYY-MM-DD, required: false }
              - { label: Priorità, name: priorita, widget: number }
              - label: Immagine hero
                name: immagineHero
                widget: object
                fields:
                  - { label: File, name: src, widget: image, required: false }
                  - { label: Testo alternativo, name: alt, widget: string }
  - name: flyers
    label: Volantini
    files:
      - name: flyers
        label: Elenco volantini
        file: content/flyers.json
        fields:
          - label: Volantini
            name: items
            widget: list
            fields:
              - { label: ID, name: id, widget: string }
              - { label: Titolo, name: titolo, widget: string }
              - { label: Valido dal, name: validoDal, widget: datetime, date_format: YYYY-MM-DD, time_format: false, format: YYYY-MM-DD }
              - { label: Valido al, name: validoAl, widget: datetime, date_format: YYYY-MM-DD, time_format: false, format: YYYY-MM-DD }
              - { label: PDF, name: pdf, widget: file, required: false }
              - label: Pagine
                name: pagine
                widget: list
                fields:
                  - { label: Immagine, name: src, widget: image }
                  - { label: Testo alternativo, name: alt, widget: string }
```

Attenzione: i file JSON attuali sono array alla radice, mentre le "file collection" di Decap lavorano su oggetti. Per adottare Decap la strada più pulita è passare a un oggetto `{ "items": [...] }` (adeguando `file-source.ts`) o a un file per voce (folder collection).

### (b) CMS headless (Sanity, Strapi, Payload)
Pro: interfaccia ricca, ruoli, anteprime, workflow di pubblicazione, modifica senza toccare Git. Contro: un servizio in più da ospitare e pagare; serve mappare le entry sugli schemi Zod. Si implementa `CmsContentSource` (stub in `lib/content/index.ts`), `NEXT_PUBLIC_CONTENT_SOURCE=cms`, e un **webhook** del CMS che richiama il Deploy Hook di Cloudflare a ogni pubblicazione, così l'export statico si rigenera. Quando scegliere: più persone editano spesso, servono bozze e approvazioni.

### (c) Back-office sulle API .NET (`ApiContentSource`)
Pro: un solo sistema per catalogo, contenuti e ordini, controllo totale, nessun servizio terzo; ideale quando arriva lo shop. Contro: va costruita l'interfaccia admin (autenticazione, CRUD, upload) e mantenuta; è il lavoro più grande. Quando scegliere: si parte comunque con lo shop e si vuole un'unica fonte di verità. Il sito legge via `ApiContentSource` (in build, o a runtime in modalità server con ISR).

## 10. TODO aperti per il cliente

Dettaglio completo in [ASSETS_TODO.md](ASSETS_TODO.md). In sintesi:

- Foto aggiornate e identificate di ciascun punto vendita, nuovi volantini e loghi dei brand. Corsie e categorie hanno foto reali; le fonti sono in `content/photo-sources.json`. I marchi ancora provvisori non vengono mostrati.
- Telefoni, particolarità di ogni sede; conferma del CAP di Sesto Fiorentino e delle coordinate (`coordinateConfermate` in `stores.json`: finché è `false` niente mappa OSM né `geo`). Orari già confermati tutti i giorni: Prato/Lucca 09:00–20:00, Sesto 08:30–19:30, domeniche e festivi inclusi.
- Numero WhatsApp Business.
- Testi e regolamento della carta fedeltà.
- I prossimi volantini: il volantino Halloween 2026 è integrato (1–31 ottobre, 7 pagine, tutti i negozi) al posto del catalogo Sesto ottobre 2026. Le tre edizioni precedenti rimangono in archivio.
- ID Google Analytics 4 / Meta Pixel (se desiderati).
- Revisione legale di privacy e cookie policy.
- Scelta del nuovo dominio canonico e collegamento del form contatti. Impostare `NEXT_PUBLIC_SITE_URL` prima della build di pubblicazione: aggiorna canonical, sitemap, anteprime social, dati strutturati e impostazioni. In assenza resta il riferimento storico di `content/settings.json`, che non implica il riutilizzo del dominio.

### Video e anteprime Instagram

`content/home.json` → `social` contiene il video locale (MP4 H.264/AAC, poster, testi) e i due reel. Le copertine sono copie locali dei metadati Open Graph ufficiali: nessun player Instagram viene incorporato. I link aprono i reel originali in una nuova scheda. L’MP4 usa controlli nativi, `playsInline`, `preload="none"` e nessun autoplay.

### Catalogo dimostrativo e archivio senza date

I volantini conclusi non sono mai presentati come attuali né come esempio: in `/offerte/` stanno nell'archivio e si aprono nel lettore con l'etichetta «concluso» e le proprie date. Un PDF privo di date, come il foglio caramelle, usa `archiviato: true` con date `null` e un'etichetta `periodo`. I testi delle pagine interne stanno in `content/pages.json` (schema `PagesCopySchema`).

