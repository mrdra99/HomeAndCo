# Redesign "sito da negozio" — brief

Base: `main` @ `ec3ea08`. Branch: `feature/redesign-negozio`. Data: 5 novembre 2026.

## Perché

Critiche del PM (Francesco) alla preview:

| # | Critica | Risposta richiesta |
|---|---|---|
| 1 | Il logo in cima è sgranato | Trovare la causa e correggerla: nitido su ogni schermo, anche 3x |
| 2 | Le copertine dei video sono sgranate; «se li straccia troppo conviene farli più piccoli» | Mai ingrandire un'immagine oltre la sua risoluzione: fonte migliore o formato più piccolo |
| 3 | «Chiedila in cassa» sa di «super cazzola», va approfondito o posto in altro modo | Via ogni rimando generico alla cassa o al personale: si dice cosa si sa, in concreto |
| 4 | La struttura trasmette tutto tranne il senso di negozio: è il template a non tornare | Struttura nuova, non un restyling |

Altri punti aperti: foto di Natale presa da internet; volantino «esempio» di offerte concluse.

## Riferimenti

Letti Risparmio Casa, Tigotà, Acqua & Sapone, Maury's e il vecchio home-co.it. In una seconda passata, con schermate
salvate, Eurospin, Lidl, IKEA, Kasanova, Risparmio Casa e Pepco: da Eurospin il volantino come blocco principale della
home (colore pieno, insegna con le date, copertina vera grande a lato, selettore del negozio nella fascia in alto) e le
grandi schede di categoria; da Lidl e Pepco il peso dato al volantino e alle categorie come schede con foto. Pattern ricorrenti:
il volantino è una chiamata primaria (menu e primo schermo); la prima cosa che si vede è una
promozione, non un manifesto; punti vendita e orari sempre a un clic; carta fedeltà come riquadro,
non come sezione-manifesto; footer ricco di informazioni. 21st.dev: nessun template negozio, solo
spunti di componente (griglia «shop by category», sezione promo).

## Direzione: l'insegna, non la landing

Deve sembrare il sito di una catena con le serrande alzate: denso, diretto, orientato al «cosa
trovo, dove, quando, a quali condizioni». Niente respiro da agenzia, niente frasi-manifesto, niente
splash.

Colori **solo del logo**:
- blu `#0f6bb4` = orientamento: header, navigazione, informazioni, link;
- magenta `#d11559` = commerciale: offerte, volantino, chiamate primarie;
- bianco come sfondo dominante, blu 900 per il testo forte, grigio-blu chiarissimo per le fasce.

Le campagne stagionali cambiano immagini e testi, **non la palette**: `--accent` resta nel magenta,
niente rosso Natale o arancio Halloween. Contrasto AA verificato: bianco su `#0f6bb4` e `#d11559`
va bene solo se il rapporto calcolato è ≥ 4.5:1, altrimenti usare le tinte 700.

Forme: raggio 8–14 px, bottoni rettangolari arrotondati (non pillole), ombre minime, bordi netti, blocchi
di colore pieno. Tipografia: Figtree, titoli 800–900 compatti, gerarchia da cartellonistica. Densità: griglie fitte, sezioni
vicine (py massimo ~56 px desktop, ~36 px mobile). Animazioni minime e funzionali: niente comparse
allo scroll, niente marquee; hover e transizioni brevi; `prefers-reduced-motion` rispettato.

## Struttura

### Testata (tutte le pagine)

```
[blu 900] Aperti tutti i giorni, anche domenica e festivi · Prato · Lucca · Sesto F.no   [Il tuo negozio: Prato · Aperto fino alle 20:00 ▾]  Instagram
[bianco ] LOGO   [Tutti i reparti ▾]  Negozi  Contatti                                                                       [Volantino]
```

- **Il tuo negozio in cima (da 1024 px).** Il selettore sta nella fascia blu 900, a destra, prima di Instagram: bordo
  bianco, testo bianco, una riga, 44 px di altezza; il menu a tendina si apre sopra la riga bianca (la fascia ha `z-50`,
  la riga bianca `z-40`). A 1024 px le città dopo l'avviso spariscono (tornano da 1280 px) per lasciare posto al
  selettore. Sotto 1024 px non c'è la fascia: il selettore resta nella barra compatta. La riga bianca chiude a destra
  con «Volantino» (voce con `evidenza`), così non resta un vuoto.
- **Scorrimento.** Solo la riga bianca è `sticky`; la fascia blu scorre via con la pagina. Scelta voluta: il negozio si
  imposta in cima e, scorrendo, resta il pulsante «Imposta come il tuo negozio» nella pagina di ogni negozio.

- Direzione scelta dal titolare: **«testata pulita»**. Una sola riga bianca sotto la fascia informativa; nessuna
  striscia di reparti e nessuna icona di reparto.
- «Tutti i reparti» è un pulsante che apre un mega-menu a tutta larghezza del contenitore, solo testo, in 5 gruppi:
  Casa; Pulizia e cura; Regali e tempo libero; Animali e giardino; Fai da te e auto. I gruppi sono dati in
  `content/navigation.json` (`gruppi`), validati da Zod: ognuno dei 13 reparti compare una sola volta (test).
  Tastiera: Invio/clic apre, Freccia giù entra nel menu, Esc chiude e riporta il focus sul pulsante; chiude anche
  con clic fuori e a ogni navigazione. Mobile: il pannello «Reparti» della tab bar mostra gli stessi 5 gruppi come
  elenchi di testo con righe piene da 44 px.
- **Perché la barra blu e le icone sono state tolte.** Nessun sito visto ha una barra colorata piena con tutti i
  reparti: Kasanova usa un mega-menu raggruppato in 5 macro-aree con elenchi di testo, Tigotà un pulsante «Tutti i
  prodotti» senza riga di categorie. La barra pesava sulla testata e le 13 icone al tratto risultavano economiche
  (decisione del titolare). Le icone di reparto sono state rimosse ovunque (griglia, hero, chip, footer, rail,
  menu): restano solo le icone funzionali di interfaccia (tab bar, pin del negozio, fascia fatti, link esterno, frecce).
- **Siti realmente visti.** Con schermate: Kasanova, IKEA, Tigotà, Risparmio Casa (indicato come esempio dal CEO del
  cliente, ma è un riferimento fra gli altri). Leroy Merlin, Bricocenter, Maisons du Monde e Action hanno bloccato i
  browser automatici: non visti, non citati come riferimenti.
- **Possibile evoluzione.** Una riga di foto tonde di prodotto in stile Kasanova si può aggiungere quando esistono
  13 foto di singoli prodotti su fondo chiaro (una per reparto): le foto di scaffale non sono leggibili a quella
  dimensione. La richiesta è in `docs/copy-per-francesco.md` e in `ASSETS_TODO.md`.
- «Il tuo negozio»: scelta salvata in `localStorage`, stato aperto/chiuso da `useOpenStatus`; stato neutro
  fino al mount, così non c'è mismatch di idratazione e l'export statico resta valido.
- Mobile: barra compatta logo + stato negozio; **tab bar fissa in basso come una app**: Home, Reparti,
  Volantino, Negozi, Carta. Rispetta `env(safe-area-inset-bottom)`; il contenuto non ci finisce sotto.
- Niente ricerca: senza catalogo sarebbe una promessa falsa.

### Home, in quest'ordine

1. **Tabellone promozionale** (non un hero a tutto schermo): griglia a un blocco grande e due riquadri. Nessun carosello.
   Due stati, scelti da `homeFlyer()` (build + ricontrollo della data nel client, come per le campagne):
   - **con un volantino in corso o in arrivo** (come Eurospin): blocco grande = volantino, a colore pieno magenta,
     insegna «Volantino» con le date, titolo del volantino come H1, negozi coperti, «Sfoglia il volantino» (o
     «Guarda l'anteprima»), copertina vera a lato con una piccola inclinazione fissa (nessuna animazione); riquadro
     in alto a destra = campagna stagionale in forma compatta (etichetta, titolo, link); sotto, negozi. La fascia
     magenta del volantino non ripete lo stesso volantino: resta una striscia sottile col rimando all'archivio;
   - **senza volantino**: blocco grande = campagna (H1), riquadro «Volantino» neutro, negozi; striscia sottile
     «Nessun volantino in corso». Nessuna copertina di volantini conclusi.
2. **Fascia fatti**: 3–4 fatti verificati con icona (tutti i giorni, orario continuato, tre negozi in Toscana,
   domeniche e festivi).
3. **Reparti** (`#corridoi`): 5 schede grandi, una per macro-area di `content/navigation.json` → `gruppi` (Casa; Pulizia e cura;
   Regali e tempo libero; Animali e giardino; Fai da te e auto). Ognuna: una foto pulita (campo `immagine` del gruppo,
   con alt, validato da Zod), titolo del gruppo e i suoi reparti come link di testo su fondo blu 900, alti 44 px.
   Griglia a 12 colonne da 1024 px: 7 + 5 sulla prima riga, 4 + 4 + 4 sulla seconda; da 480 a 1023 px due colonne con
   Casa su tutta la riga; sotto 480 px una sotto l'altra. Nessuna icona. Il test verifica che i 13 reparti restino
   raggiungibili e che le foto non siano ingrandite (`DEPARTMENT_CARD_MAX_CSS_WIDTH`).
4. **Campagna in corso**: rail orizzontale di articoli (`CampaignCollection`), senza prezzi inventati.
5. **Volantino**: striscia sottile con rimando all'archivio (il volantino in corso è già nel tabellone).
6. **Negozi**: tre schede compatte con stato ora, indirizzo, orari, «Indicazioni» (verso l'indirizzo, mai le coordinate) e «Orari e mappa», che porta alla pagina del negozio.
7. **Carta fedeltà + video** affiancati su desktop: riquadro carta compatto; video e reel in formato piccolo.
8. **Footer ricco**: reparti, negozi con orari, link utili, social, dati legali.

Via: splash `BrandIntro` (ritarda il negozio) e marquee.

### Pagine interne

Stessa grammatica: intestazione compatta con breadcrumb, niente hero enormi.
- `/offerte/`: volantino corrente in cima, archivio a griglia, lettore invariato nel funzionamento.
- `/dove-siamo/`: indice con tre schede (stesse della home) che portano alle pagine dei negozi. Gli `id` `prato`,
  `lucca`, `sesto-fiorentino` restano come ancore (`/dove-siamo/#prato`) per i link storici.
- `/dove-siamo/<id>/` (una pagina statica per negozio, `generateStaticParams` sugli id di `content/stores.json`):
  percorso, H1 col nome del negozio, stato aperto/chiuso dal vivo, indirizzo, orari, «Indicazioni», «Imposta come il tuo
  negozio» (stessa scelta della testata), riquadro «Apri in Google Maps» (la mappa OpenStreetMap compare solo con `coordinateConfermate: true`), foto esterna solo se esiste (oggi Lucca, mai un ripiego), fatti solo
  dai dati (`particolarita`, `servizi`), volantino valido per quel negozio solo se in corso o in arrivo, link agli altri
  due negozi, «Reparti Home & Co.» (link ai reparti senza dire che il negozio li ha tutti). Titolo, descrizione e
  canonical propri. Dati strutturati: BreadcrumbList e HomeGoodsStore di quel negozio (indirizzo senza note, `geo` solo con coordinate confermate,
  OpeningHoursSpecification, immagine solo se la foto c'è). `Organization` resta globale nel layout; i negozi non sono più
  ripetuti su ogni pagina. Sitemap: indice, tre negozi, reparti.
- `/corridoi/[slug]/`: testata reparto con foto, scaffali, altri reparti sempre visibili. URL invariati.
- `/carta-fedelta/`, `/contatti/`: compatte, informative, coerenti.

## Copy

Registro da insegna: frasi brevi, concrete, senza poesia. Ogni frase deve poter stare su un cartello in negozio.

Vietati: «lasciati ispirare», «con calma», «dare un'occhiata», «un mondo di», aforismi su casa e
vita quotidiana, ogni rimando generico a cassa o personale come risposta a una domanda del cliente.

**Fatti verificati, unica base ammessa:**
- claim storico «Il negozio su misura per la tua casa!»;
- tre negozi: Prato (Viale G. Marconi 38), Lucca (Via Romana 3137), Sesto Fiorentino (Via G. Leopardi 66, ex Coop Il Neto);
- orario continuato tutti i giorni, domeniche e festivi inclusi: Prato e Lucca 09:00–20:00, Sesto 08:30–19:30;
- assortimento del vecchio sito e dei 13 reparti in `content/aisles.json`;
- i dati nel file di contenuto non marcati `provvisorio`; date dei volantini in `content/flyers.json`.

**Mai inventare**: prezzi, sconti, marchi, telefoni, condizioni o vantaggi della carta, disponibilità, primati
(«i più convenienti», «il più grande»). Se manca un dato, riformulare senza, oppure non dire la cosa, e annotarlo
in `docs/copy-per-francesco.md`.

## Vincoli tecnici

- Export statico; nessun route handler dinamico o middleware. Compatibilità con il futuro `/shop`.
- Testi in `content/` e validati dagli schemi Zod di `lib/content/schemas.ts`; i componenti ricevono dati.
- URL e `public/_redirects` invariati. Massimo 10 voci nel menu. Mobile first.
- Prima di usare API Next leggere `node_modules/next/dist/docs/` (versione con breaking change).
- Nessun commit da parte degli agenti: committa l'orchestratore a review superata.
- Niente nuove dipendenze senza una ragione seria.
- `npm run typecheck`, `npm test`, `npm run lint`, `npm run build` verdi a fine lavoro.
