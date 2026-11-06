# Materiali del sito: stato e dati da confermare

Aggiornato al 5 novembre 2026.

## Aggiornamento video, offerte e mappe (5 novembre 2026)

- Due reel con copertine originali locali e link diretti a Instagram, senza incorporare il player esterno.
- Video MP4 fornito dal cliente, ottimizzato H.264 per il sito, avvio manuale e copertina locale.
- Catalogo Sesto ottobre e iniziativa caramelle in archivio, con le date originali e l’etichetta «concluso». Nessun volantino concluso è presentato come attuale.
- Mappe OSM caricate automaticamente; footer ridotto a una barra essenziale.

## Aggiornamento testi (5 novembre 2026)

- Testi di reparti, campagne, volantino, negozi, contatti, cookie, 404 e SEO riscritti su dati verificati. Le frasi sostituite e i dati richiesti al cliente sono in `docs/copy-per-francesco.md`.
- Carta fedeltà: la pagina dice soltanto che vantaggi, costo e regolamento non sono pubblicati. Compaiono da soli quando si compilano `vantaggi`, `passi`, `costo`, `regolamento` in `content/loyalty.json`.
- Negozi: in `stores.json` servizi e particolarità non verificati (parcheggio, ascensore, carte e bancomat, palestra accanto, carta fedeltà) sono passati nel campo `daConfermare`, che non viene mostrato.
- Volantino: oggi nessuno è in corso (Halloween concluso il 31 ottobre). Il volantino di novembre non è stato fornito: quando arriva si aggiunge a `flyers.json` e sostituisce lo stato «concluso» in home e in /offerte/.

## Già inseriti

- Logo ufficiale vettoriale dal PDF dell’insegna, favicon, icona Apple e anteprima social.
- Fotografie autentiche delle corsie Home & Co. dal sito esistente: casa, cucina, detersivi, accessori e giardino.
- Foto originali fornite dal cliente per i 13 reparti e i relativi dettagli. Tre corsie ritoccate per eliminare gli scatoloni; foto esterna di Lucca inserita. Le fonti precedenti restano per i contenuti stagionali in archivio.
- Fotografie per le selezioni di assortimento, senza prezzi o badge di popolarità non verificati. Le immagini troppo piccole dei PDF compressi non sono usate come foto prodotto nella vetrina.
- Tre volantini ufficiali completi: primavera 2026 (11–19 aprile, Prato/Lucca), apertura Sesto (27 giugno–12 luglio), settembre 2026 (7–14 settembre, tutti). Copertine, 24 pagine WebP e PDF originali.
- Volantino ufficiale «Halloween da brividi» 2026: 7 pagine WebP e PDF originale, tutti i negozi, valido dal 1 al 31 ottobre. Ha sostituito il catalogo Sesto Fiorentino di ottobre.
- Orari confermati: Prato e Lucca 09:00–20:00, Sesto 08:30–19:30; tutti i giorni, domeniche e festivi inclusi.
- Calendario confermato: Halloween fino al 31 ottobre, Natale dal 1 novembre al 31 dicembre; temi ricorrenti annuali, scadenze dei singoli volantini indipendenti.
- Fonti, autori, licenze e hash dei PDF in `content/photo-sources.json` e `public/uploads/PHOTO_CREDITS.md`.
- Copy riscritto in `content/campaigns.json`, `content/aisles.json`, `content/loyalty.json` e `content/home.json`.

I volantini conclusi, incluso Halloween, restano nell’archivio con le proprie date. La vetrina di novembre usa il tema Natale secondo il calendario già confermato.

## Materiali ancora da fornire o confermare

| Materiale / dato | Dove | Azione |
|---|---|---|
| Foto di Natale del tabellone (`home-co-reparto-natale.webp`) | `campaigns.json` → `natale-2026` | La foto è del negozio, dal caricamento ufficiale (vedi `content/photo-sources.json`). Se si vuole una foto più recente, sostituirla qui. I testi di Natale non usano la parola «alberi». |
| Volantino di novembre / Natale | `flyers.json`, `public/uploads/flyers/` | Da fornire: copertina, pagine, PDF, date di validità, negozi. Nessuna data inventata. |
| Foto esterne identificate di Prato e Sesto (Lucca inserita) | `stores.json` → `immagine` | Inserire foto della sede corretta. In assenza la scheda mostra la mappa, senza foto fittizie o segnaposto pubblici. |
| Numeri telefonici di ogni negozio | `stores.json` | Gli orari sono confermati e gli stati aperto/chiuso sono attivi. I numeri restano da fornire. |
| Coordinate, CAP e servizi / particolarità delle sedi | `stores.json` | Verificare i dati ancora marcati `provvisorio`. Parcheggio, ascensore, carte e bancomat, palestra accanto, carta fedeltà per sede: ora in `daConfermare`, non mostrati. Spostarli in `particolarita`/`servizi` dopo la conferma. |
| Catalogo / disponibilità dei singoli prodotti | `aisles.json` → `inEvidenza` | Le foto illustrano l’assortimento. Nessuna giacenza o disponibilità attuale è confermata. |
| Loghi e marchi realmente distribuiti | `brands.json`, `public/uploads/brands/` | SVG o PNG trasparente (altezza 96 px); poi `provvisorio: false`. I provvisori sono nascosti. |
| Loghi e marchi realmente distribuiti | `brands.json` | I nomi provvisori sono nascosti. |
| Carta fedeltà: cos'è, vantaggi, come si ottiene, costo, regolamento | `loyalty.json` | Da fornire. Con i dati compilati la pagina si completa da sola e il riquadro in home compare (finché mancano vantaggi, passi, costo o regolamento non c'è e video e reel hanno tutta la riga). Per rimettere «Carta» in navigazione, quando i fatti sono confermati: 1) in `content/navigation.json` togliere `"soloPiede": true` dalla voce Carta fedeltà (torna nel menu della testata); 2) in `content/settings.json`, `testata.tab`, sostituire la voce Contatti con `{ "label": "Carta", "icona": "carta", "href": "/carta-fedelta/" }` (le tab sono sempre 5; Contatti resta raggiungibile da menu e footer); 3) riscrivere `intro` in `loyalty.json`. Nessun punto, buono o tempo di attivazione è mostrato finché non è confermato. |
| 13 foto di singoli prodotti su fondo chiaro, una per reparto | `aisles.json` (futuro) | Servono per una riga di foto tonde dei reparti in stile Kasanova: le foto di scaffale non sono leggibili a quella dimensione. Finché mancano, il menu è solo testo. |
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
