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

Letti Risparmio Casa, Tigotà, Acqua & Sapone, Maury's e il vecchio home-co.it. Pattern ricorrenti:
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
[blu 900] Aperti tutti i giorni, anche domenica e festivi · Prato · Lucca · Sesto F.no   Instagram
[bianco ] LOGO     [Reparti ▾] Volantino  Negozi  Carta fedeltà  Contatti   [Il tuo negozio: Prato · Aperto fino alle 20:00]
[blu 600] Cucina · Tessile · Pulizia · Beauty · Animali · Giardino · ... (reparti con icona, scorribile)
```

- «Reparti» apre un mega-menu con tutti i reparti e relativa icona.
- «Il tuo negozio»: scelta salvata in `localStorage`, stato aperto/chiuso da `useOpenStatus`; stato neutro
  fino al mount, così non c'è mismatch di idratazione e l'export statico resta valido.
- Mobile: barra compatta logo + stato negozio; **tab bar fissa in basso come una app**: Home, Reparti,
  Volantino, Negozi, Carta. Rispetta `env(safe-area-inset-bottom)`; il contenuto non ci finisce sotto.
- Niente ricerca: senza catalogo sarebbe una promessa falsa.

### Home, in quest'ordine

1. **Tabellone promozionale** (non un hero a tutto schermo): griglia a un blocco grande e due riquadri.
   Grande = campagna attiva con foto, titolo, date, chiamata. Riquadri = volantino con copertina e stato;
   negozi con aperti/chiusi ora. Mobile: impilati; tutto il primo schermo deve dire «negozio». Nessun carosello.
2. **Fascia fatti**: 3–4 fatti verificati con icona (tutti i giorni, orario continuato, tre negozi in Toscana,
   domeniche e festivi).
3. **Reparti**: griglia fitta dei 13 reparti, foto vera con etichetta piena e icona. 2 colonne mobile, 4–5 desktop.
4. **Campagna in corso**: rail orizzontale di articoli (`CampaignCollection`), senza prezzi inventati.
5. **Volantino**: fascia magenta a tutta larghezza, copertina grande, date, stato veritiero, archivio.
6. **Negozi**: tre schede con stato ora, indirizzo, orari, «Indicazioni», foto o mappa.
7. **Carta fedeltà + video** affiancati su desktop: riquadro carta compatto; video e reel in formato piccolo.
8. **Footer ricco**: reparti, negozi con orari, link utili, social, dati legali.

Via: splash `BrandIntro` (ritarda il negozio) e marquee.

### Pagine interne

Stessa grammatica: intestazione compatta con breadcrumb, niente hero enormi.
- `/offerte/`: volantino corrente in cima, archivio a griglia, lettore invariato nel funzionamento.
- `/dove-siamo/`: selettore negozio, schede con stato, mappa, indicazioni.
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
