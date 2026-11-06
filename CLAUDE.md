# Home & Co. — sito vetrina

Sito vetrina di Home & Co. (home-co.it, HCO SRL): catena di casalinghi con 3 negozi in Toscana
(Prato, Lucca, Sesto Fiorentino). Sostituisce un WordPress del 2021. In futuro diventerà anche
e-commerce (`/shop` su API .NET): oggi NON si costruisce, ma niente deve impedirlo.

## Stack
Next.js (App Router) + TypeScript strict, Tailwind CSS v4 (token in `@theme`), `motion`
(ex Framer Motion), Zod. Export statico (`output: "export"`, `images.unoptimized`,
`trailingSlash: true`) su Cloudflare Pages.

## Struttura — dove sta cosa
- `app/(site)/` pagine del sito (home, offerte, dove-siamo con una pagina per negozio in `[slug]`, carta-fedelta, contatti, corridoi/[slug], legali, design-system); `app/(shop)/` riservato al futuro shop.
- `components/` ui, motion, layout (testata, TabBar mobile, StoreChip, PageHeader, footer), sections, campaign, aisles, flyers, stores, loyalty, consent, contact, legal, seo.
- `docs/redesign-negozio.md` direzione di UI, UX e copy, vincolante; `docs/copy-per-francesco.md` frasi cambiate e dati da chiedere al cliente.
- `lib/content/` schemi Zod + `ContentSource` (`NEXT_PUBLIC_CONTENT_SOURCE`); `lib/campaigns|flyers|stores.ts` logica pura; `lib/api/types.ts` tipi shop; `lib/contact/adapter.ts` form.
- `public/_redirects`, `public/_headers` per Cloudflare Pages. Segnaposto da sostituire: `ASSETS_TODO.md`. Guida completa: `README.md`.
- `content/` — TUTTI i contenuti (campagne, corridoi, sedi, brand, volantini, promozioni,
  carta fedeltà, impostazioni). Mai testi o dati cablati nei componenti.
- `lib/content/` — unico accesso ai dati, dietro interfacce (oggi file locali, domani CMS/API .NET).
- `public/uploads/` — immagini e PDF gestiti come contenuto.

## Comandi
- `npm install`, `npm run dev` (sviluppo), `npm run build` (export statico in `out/`), `npx serve out` (anteprima).
- `npm test` (vitest), `npm run lint`, `npm run typecheck`. Node 22. Variabili in `.env.example`.
- Deploy: Cloudflare Pages, build `npm run build`, output `out`, `NODE_VERSION=22`; Deploy Hook giornaliero per aggiornare campagna e volantini.

## Convenzioni specifiche di questo repo
- Contenuto e codice separati: un componente riceve dati, non li importa da `content/`.
- Immagini mancanti → `<Placeholder />`; ogni segnaposto va censito in `ASSETS_TODO.md`.
- Solo i colori del logo: blu per orientamento e informazioni, magenta per le chiamate commerciali. Le campagne cambiano immagini e testi, mai la palette (`--accent` fisso, presidiato da `palette.test.ts`).
- Mobile first, raggi 8–14 px, animazioni minime e sempre con `prefers-reduced-motion`.
- Mai ingrandire un'immagine: larghezza CSS ≤ larghezza reale / 2 (`lib/image-rules.ts`).
- Mai inventare prezzi, sconti, marchi, telefoni o vantaggi della carta. La carta fedeltà torna in home, testata e tab bar solo con dati veri (`ASSETS_TODO.md`); oggi resta raggiungibile dal footer.
- Massimo 10 pagine nel menu; elenco corridoi provvisorio, modificabile da un solo file.
- URL in italiano con slash finale; i vecchi URL WordPress restano validi o hanno 301 in `public/_redirects`.
- Testi in italiano; i provvisori sono marcati come tali nei file di contenuto.

## Trappole / cosa non toccare
- Niente funzionalità che richiedono un server (route handler dinamici, middleware, ISR):
  l'export statico rompe la build. Restare compatibili con una futura modalità server.
- La campagna attiva è scelta in build e il contenuto è ricontrollato nel client dopo l'idratazione: al cambio di data, senza nuova build, può comparire per un attimo la campagna precedente.
- Coordinate dei negozi non confermate (`coordinateConfermate: false` in `stores.json`): niente mappa né `geo` finché il cliente non dà il pin di ogni sede; «Indicazioni» va sempre per indirizzo.
- Non committa Claude: a fine lavoro propone il messaggio di commit, committa l'utente.
- > TODO: remote git non ancora configurato; quando c'è, aggiornare la chiave nel registry dell'harness.
