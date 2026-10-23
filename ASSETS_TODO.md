# Materiali del sito: stato e dati da confermare

Aggiornato al 19 ottobre 2026.

## Già inseriti

- Logo ufficiale vettoriale dal PDF dell’insegna, favicon, icona Apple e anteprima social.
- Fotografie autentiche delle corsie Home & Co. dal sito esistente: casa, cucina, detersivi, accessori e giardino.
- Foto reali per tutte le categorie, gli hero e le schede della collezione Halloween. Foto di ambientazione Pexels per biancheria, animali e altri soggetti non disponibili nell’archivio del marchio.
- Fotografie per le selezioni di assortimento, senza prezzi o badge di popolarità non verificati. Le immagini troppo piccole dei PDF compressi non sono usate come foto prodotto nella vetrina.
- Tre volantini ufficiali completi: primavera 2026 (11–19 aprile, Prato/Lucca), apertura Sesto (27 giugno–12 luglio), settembre 2026 (7–14 settembre, tutti). Copertine, 24 pagine WebP e PDF originali.
- Volantino ufficiale «Halloween da brividi» 2026: 7 pagine WebP e PDF originale, tutti i negozi, valido dal 1 al 31 ottobre. Ha sostituito il catalogo Sesto Fiorentino di ottobre.
- Orari confermati: Prato e Lucca 09:00–20:00, Sesto 08:30–19:30; tutti i giorni, domeniche e festivi inclusi.
- Calendario confermato: Halloween fino al 31 ottobre, Natale dal 1 novembre al 31 dicembre; temi ricorrenti annuali, scadenze dei singoli volantini indipendenti.
- Fonti, autori, licenze e hash dei PDF in `content/photo-sources.json` e `public/uploads/PHOTO_CREDITS.md`.
- Copy riscritto in `content/campaigns.json`, `content/aisles.json`, `content/loyalty.json` e `content/home.json`.

Le tre edizioni recuperate dal vecchio sito restano nell’archivio. Il catalogo fornito direttamente dal cliente è ora in evidenza. La validità stampata sul PDF (23 ottobre–1 novembre) prevale sull’indicazione generale «fino a fine mese» per le sue offerte.

## Materiali ancora da fornire o confermare

| Materiale / dato | Dove | Azione |
|---|---|---|
| Foto attuali e identificate di Prato, Lucca e Sesto, già organizzate con Mike | `stores.json` → `immagine` | Inserire foto della sede corretta. In assenza la scheda mostra la mappa, senza foto fittizie o segnaposto pubblici. |
| Numeri telefonici di ogni negozio | `stores.json` | Gli orari sono confermati e gli stati aperto/chiuso sono attivi. I numeri restano da fornire. |
| Coordinate, CAP e servizi / particolarità delle sedi | `stores.json` | Verificare i dati ancora marcati `provvisorio`. |
| Catalogo / disponibilità dei singoli prodotti | `aisles.json` → `inEvidenza` | Le foto illustrano l’assortimento. Nessuna giacenza o disponibilità attuale è confermata. |
| Foto degli scaffali di ogni categoria (in arrivo dal cliente) | `aisles.json` → `scaffali` | Salvarle in `public/uploads/aisles/<slug>/` (WebP, ~1600 px lato lungo, alt obbligatorio). Finché `scaffali` è vuoto la sezione non compare. Procedura nel README. |
| Loghi e marchi realmente distribuiti | `brands.json`, `public/uploads/brands/` | SVG o PNG trasparente (altezza 96 px); poi `provvisorio: false`. I provvisori sono nascosti. |
| Loghi e marchi realmente distribuiti | `brands.json` | I nomi provvisori sono nascosti. |
| Carta fedeltà: regolamento e condizioni | `loyalty.json` | Testi da confermare. Rimossi punti, buoni e tempi di attivazione non verificati. |
| Numero WhatsApp Business | `settings.json` | Aggiungere il numero reale. |
| Dominio definitivo del nuovo sito | `NEXT_PUBLIC_SITE_URL` | Da scegliere; il cliente non richiede il riutilizzo del dominio e del vecchio hosting. Impostarlo prima della pubblicazione. Il riferimento attuale in `settings.json` non è una scelta definitiva. |
| Form contatti | `lib/contact/adapter.ts` | Collegare un invio reale: l’adapter di partenza è ancora dimostrativo. |
| Privacy e cookie policy | Pagine legali | Far validare i testi prima del lancio. |
| Analytics e consenso | `settings.json` | Configurare soltanto gli strumenti scelti dal titolare. |
| Rinnovo SEO giornaliero | Secret GitHub `CLOUDFLARE_DEPLOY_HOOK_URL` | Collegare il Deploy Hook descritto nel README. |

## Come aggiornare una foto

1. Conservare la fonte e verificare i diritti d’uso.
2. Salvare una copia WebP ottimizzata in `public/uploads/photos/` oppure `products/`.
3. Aggiornare il JSON e scrivere un alt fedele al soggetto. Non attribuire foto stock a una sede reale.
4. Usare `fit: "contain"` per articoli su fondo bianco e `position` per controllare il ritaglio delle foto.
5. Aggiungere fonte e autore al registro delle immagini.

La pagina `/design-system/` conserva segnaposto dimostrativi per il controllo dei componenti; è esclusa dall’indicizzazione.
