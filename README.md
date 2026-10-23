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
- **Deploy Hook giornaliero.** La campagna attiva e i volantini validi vengono scelti **in build**, così l'HTML è già corretto e senza flash. Il browser ricontrolla la data prima del primo paint e ogni 30 secondi, oltre che al ritorno sulla scheda: tema, hero, collezione stagionale, reparti e volantini restano sincronizzati, anche oltre la mezzanotte italiana. Ma lo HTML statico (SEO, anteprime social, elenco volantini) cambia solo con una nuova build: crea in Cloudflare Pages un **Deploy Hook** e salva il suo URL nel secret GitHub **`CLOUDFLARE_DEPLOY_HOOK_URL`**. Il workflow incluso `.github/workflows/seasonal-refresh.yml` lo richiama ogni notte alle 01:15 UTC (02:15/03:15 in Italia); si può anche avviare a mano. Senza il secret salta il rinnovo con un avviso: il cambio nei browser continua a funzionare, ma l’HTML per i motori di ricerca si aggiorna solo al prossimo deploy. Il richiamo conferma la richiesta di build, non l’esito del deploy: quest’ultimo va controllato su Cloudflare.

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
    offerte/  dove-siamo/  carta-fedelta/  contatti/
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
Un solo file: `content/navigation.json`, array di `{ "label", "href", "evidenza"? }`. **Massimo 10 voci** (lo impone lo schema). `evidenza: true` mette la voce in risalto.

### Aggiungere una campagna
In `content/campaigns.json` aggiungi un oggetto (la campagna senza date è il default e non va rimossa):

```json
{
  "id": "pasqua-2027",
  "titolo": "Pasqua in casa, che bella idea",
  "sottotitolo": "Tavola, decorazioni e uova da regalare.",
  "inizio": "2027-03-15",
  "fine": "2027-03-29",
  "immagineHero": { "src": "/uploads/campaigns/pasqua-2027.webp", "alt": "Tavola di Pasqua", "label": "Hero Pasqua" },
  "accento": "#2F7D5B",
  "tema": "pasqua",
  "cta": { "label": "Vedi le offerte", "href": "/offerte/" },
  "ctaSecondaria": { "label": "Trova il negozio", "href": "/#dove-siamo" },
  "corridoiInEvidenza": ["casa-e-cucina", "biancheria-e-arredo"],
  "priorita": 10,
  "provvisorio": false
}
```

Regole: date `YYYY-MM-DD`, **entrambe inclusive**, fuso Europe/Rome. Se più campagne si sovrappongono vince la `priorita` più alta, a parità l'`inizio` più recente. Fuori da ogni campagna vale il default. `accento` controlla il colore di pulsanti e badge. `contrastoAccento` sceglie il testo sui fondi colorati (default bianco) e `accentoTesto` il colore dei link su fondo chiaro: Halloween usa il magenta del marchio `#D11559`, testo bianco e link magenta scuro `#B01556`, niente arancione, come il volantino Halloween. Il banner iniziale ha fondo bianco, titoli blu e l’illustrazione di ripiego (`HeroArt`) con onde magenta, macchia blu, zucca, fantasma, pipistrello e ragnetto. Senza immagine (`src: null`) compare la grafica di ripiego.

### Halloween e anteprima per data

Halloween 2026 è già configurato dal **1 al 31 ottobre inclusi**, nel fuso **Europe/Rome**. I volantini hanno intervalli indipendenti: la home li rimuove dalla vetrina alla scadenza senza spegnere la campagna. La copia PDF scaricabile è ricompressa alla stessa risoluzione per rientrare nel limite di 25 MiB di Cloudflare Pages; l’originale ricevuto resta intatto. Il volantino «Halloween da brividi» (7 pagine, tutti i negozi) vale **dal 1 al 31 ottobre 2026** e dal 1 novembre passa in archivio. Ha sostituito il catalogo Sesto Fiorentino di ottobre, rimosso dal sito su richiesta. Dal **1 novembre al 31 dicembre** il tema è Natale, secondo il calendario confermato da Alessandro.

In `content/campaigns.json` puoi modificare date, titolo, testo, etichetta, sticker, colore, CTA e reparti. Il blocco facoltativo `collezione` contiene titolo, descrizione e `idee` (`titolo`, `testo`, `corridoio`, `icona`, `immagine` opzionale): compare solo durante quella campagna. Le date inesistenti, come il 30 febbraio, bloccano la build con un errore leggibile.

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
In `content/aisles.json`: `slug` (compare nell'URL `/corridoi/<slug>/`), `titolo`, `titoloBreve`, `descrizione`, `descrizioneLunga`, `immagine`, `icona`, `inEvidenza` (idee: titolo, descrizione, immagine, badge), `ordine`, `visibile`, `seo`, `categoryId` (futuro shop). Poi aggiungi la voce in `navigation.json` se vuoi il link nel menu. La pagina nasce da sola (generateStaticParams).

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
`content/stores.json` (orari: array `{ giorno 0-6, aperture:[{da,a}] }`, `null` = non noti), `brands.json`, `promotions.json`, `settings.json` (WhatsApp, social, dati societari, analytics), `loyalty.json`. Le mappe si caricano su richiesta su ogni schermo. Anche le promozioni ricontrollano inizio e fine nel browser, senza restare visibili dopo la scadenza o comparire in anticipo.

### Striscia dei marchi (home)
`components/sections/BrandMarquee.tsx` mostra i loghi in un banner che ruota di continuo (solo CSS, circa 36 px/s, pausa al passaggio del mouse e al focus, scorrimento da destra verso sinistra). Con `prefers-reduced-motion` diventa una riga scorrevole a mano. La sezione compare solo se c'è almeno un marchio con `provvisorio: false` in `content/brands.json`. Per aggiungere un logo: file in `public/uploads/brands/` (SVG oppure PNG trasparente, altezza consigliata 96 px per il PNG, orizzontale, senza margini vuoti attorno), poi nel marchio `logo.src` = `/uploads/brands/nome.svg`, `url` facoltativo e `provvisorio: false`. Senza logo il marchio compare come testo. Anteprima con 8 marchi finti in `/design-system/`.

### Foto e loghi

Le foto delle corsie arrivano dal sito Home & Co. esistente. Le fotografie di ambientazione Pexels sono accompagnate da autore e licenza in `public/uploads/PHOTO_CREDITS.md`; la provenienza di ogni file è anche in `content/photo-sources.json`. Tutto è servito localmente, senza hotlink. `ImageRef.fit: "contain"` mantiene interi i prodotti e i volantini; `position` controlla il punto del ritaglio per le foto. Nessuna fotografia stock viene attribuita a un negozio Home & Co.

`scripts/prepare-images.mjs` crea varianti da 96 a 1600 px (senza ingrandire gli originali), con qualità più alta per i testi dei volantini. Il loader di Next genera `srcset` e `sizes`: il browser sceglie la risoluzione adatta allo schermo e alla sua densità. L'immagine principale ha priorità alta; le altre si caricano avvicinandosi alla vista. Nel lettore, le pagine adiacenti vengono anticipate solo quando il volantino è vicino allo schermo; lo zoom usa l'originale e il PDF viene scaricato solo su richiesta.

Il copy della home è in `content/home.json`, letto e validato da `ContentSource`; le campagne, i reparti e la carta restano nei rispettivi JSON. Il tono è diretto e concreto: evitare superlativi, promesse di risparmio o disponibilità non confermate e badge come “più scelti” senza dati reali.
Vedi [ASSETS_TODO.md](ASSETS_TODO.md) (tabella di tutti i segnaposto, formati e dimensioni). Il logo ufficiale è in `public/brand/logo.svg`, estratto in vettoriale dal PDF dell’insegna. Il componente condiviso `components/ui/Logo.tsx` lo usa in header, menu, footer e tessera. Sui fondi scuri mantiene i colori originali su una base bianca. Favicon, icona Apple, immagine social e logo PNG per i dati strutturati sono già inclusi (dettagli in `public/brand/README.md`).

## 6. Design system

- Token (blu `#0F6BB4` e magenta `#D11559` del marchio, neutri azzurrati, raggi, ombre, `--accent` di campagna) in `app/globals.css`, sezione `@theme`. Font: Figtree per titoli e testo, coerente con una vetrina fotografica.
- Componenti base in `components/ui/` (Button, Card, Section, Container, SectionHeading, Badge, Icon, Logo, Placeholder, SmartImage, Accordion) e animazioni in `components/motion/` (Reveal, Stagger, HoverLift; `MotionProvider` rispetta `prefers-reduced-motion`).
- **Scorrimento**: `SmoothScroll` carica Lenis solo con puntatore fine e senza preferenza di movimento ridotto. Inerzia morbida della rotellina con `lerp: 0.085`; il tocco resta nativo (`syncTouch: false`). Menu e finestre modali fermano anche l'inerzia già in corso; i link interni usano gli spazi CSS sotto l'header. La preferenza di movimento ridotto viene recepita anche durante la visita.
- **Comparsa allo scroll**: `Reveal` e `StaggerItem` usano un osservatore per elemento, con dissolvenza lenta con easing `cubic-bezier(0.16, 1, 0.3, 1)`: 1050 ms, salita di 28 px e blur di 5 px che si scioglie su desktop; 950 ms, 20 px e nessun blur su smartphone. Le colonne della stessa riga si sfalsano di 110 ms (tetto 450 ms); le righe successive aspettano di entrare nello schermo. L'effetto parte una sola volta. L'HTML iniziale è visibile: si preparano solo gli elementi sotto la vista dopo l'idratazione. Con JavaScript disattivato, movimento ridotto, focus da tastiera o stampa, il contenuto resta subito leggibile.
- **Smartphone**: schede dei reparti e delle collezioni con foto laterale sotto i 640 px, archivio compatto sotto i 420 px, menu a schermo intero con chiusura sempre raggiungibile e collegamenti grandi. Pulsanti alti almeno 44 px, campi del modulo da 16 px e spazi per le aree sicure nelle finestre modali. La striscia dei marchi, quando presente, si scorre manualmente al tocco.
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
              - { label: Accento, name: accento, widget: color }
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
- Telefoni, particolarità di ogni sede; conferma del CAP di Sesto Fiorentino e delle coordinate. Orari già confermati tutti i giorni: Prato/Lucca 09:00–20:00, Sesto 08:30–19:30, domeniche e festivi inclusi.
- Numero WhatsApp Business.
- Testi e regolamento della carta fedeltà.
- I prossimi volantini: il volantino Halloween 2026 è integrato (1–31 ottobre, 7 pagine, tutti i negozi) al posto del catalogo Sesto ottobre 2026. Le tre edizioni precedenti rimangono in archivio.
- ID Google Analytics 4 / Meta Pixel (se desiderati).
- Revisione legale di privacy e cookie policy.
- Scelta del nuovo dominio canonico e collegamento del form contatti. Impostare `NEXT_PUBLIC_SITE_URL` prima della build di pubblicazione: aggiorna canonical, sitemap, anteprime social, dati strutturati e impostazioni. In assenza resta il riferimento storico di `content/settings.json`, che non implica il riutilizzo del dominio.
