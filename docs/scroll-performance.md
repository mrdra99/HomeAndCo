# Analisi dello scorrimento — 5 novembre 2026

## Causa confermata e correzione

Il layout principale caricava Lenis su tutti i computer con mouse o trackpad.
Lenis annullava lo scroll della rotellina (`preventDefault`) e ricostruiva lo
spostamento tramite JavaScript, con interpolazione `lerp: 0.16` e `autoRaf: true`.
Sul trackpad del Mac questo aggiungeva una seconda inerzia alla gestione del
browser e rendeva l'avanzamento dipendente dal lavoro sul thread JavaScript.
Il ciclo `requestAnimationFrame` continuava anche a pagina ferma.

È stato rimosso il componente `SmoothScroll`, insieme alla dipendenza Lenis,
ai suoi stili e agli attributi usati per escludere menu e finestre modali.
Rotellina, trackpad e tocco sono ora gestiti dal browser. Le ancore mantengono
`scroll-behavior: smooth` e lo spazio sotto l'header; con movimento ridotto
lo spostamento resta immediato. I blocchi `overflow` dei modali restano attivi.

## Confronto locale

Build statica di produzione, Chrome 157 headless su macOS, vista 1440 × 900.
Il confronto iniziale usa la stessa build, disabilitando solo l'attivazione
di Lenis nel secondo passaggio. La versione corretta è stata poi ricompilata
e misurata senza questa modifica di prova.

| Misura | Versione iniziale | Stessa build senza Lenis | Build corretta |
| --- | ---: | ---: | ---: |
| Tempo per raggiungere il 90% di un impulso da 400 px | 400 ms | 24 ms | 19 ms |
| Richieste JavaScript di animazione in 1 secondo a pagina ferma | 60 | 0 | 0 |
| Eventi wheel annullati dal sito su 50 impulsi | 50 | 0 | 0 |

Il tempo al 90% descrive la coda dello spostamento, non il tempo del primo
movimento visibile. Sono singole prove con input sintetici: non rappresentano
un valore FPS universale o una misura del trackpad fisico in Safari.
Il confronto conferma l'intercettazione e il lavoro continuo eliminati.

## Altri punti controllati

- **Header:** l'altezza del documento è riservata e lo stato React cambia solo
  attraversando la soglia di 12 px. Le transizioni di altezza e larghezza
  richiedono layout durante la compattazione di 300 ms: possibile costo locale
  vicino all'inizio della pagina, senza un ciclo continuo lungo tutto lo scroll.
- **Reveal e Stagger:** rimossi nel redesign "sito da negozio": nessuna comparsa allo scroll, nessun `IntersectionObserver` per le animazioni. Restano solo hover e transizioni brevi (`HoverLift`), con `prefers-reduced-motion` rispettato.
- **Immagini:** varianti WebP responsive, dimensioni riservate e caricamento
  differito per le immagini secondarie. Non è stato necessario modificarle.
- **Video e volantini:** nessun autoplay del video del negozio, `preload="none"`;
  pagine adiacenti del lettore anticipate solo vicino alla vista e PDF scaricati
  su richiesta.
- **Mappe:** tre iframe OpenStreetMap caricati subito su `/dove-siamo/`.
  Possono pesare sul caricamento di quella pagina, ma non spiegano il difetto
  globale. Il comportamento richiesto delle mappe è stato mantenuto.
- **Effetti decorativi:** splash di introduzione e marquee dei marchi sono stati rimossi; nessuna animazione JavaScript continua a riposo. Il tema stagionale non cambia piu' i colori e non c'e' piu' lo script inline nel `<head>`.

## Verifica

- Build di produzione, controllo TypeScript, ESLint e 71 test esistenti superati.
- Tutte le 21 pagine, inclusi i 13 reparti e il design system, controllate a
  1440 × 900 e 390 × 844: 42 combinazioni pagina/schermo.
- Scorrimento completo, comparsa dei contenuti, immagini, assenza di errori
  JavaScript e di overflow orizzontale controllati in entrambe le viste.
- Controlli mirati su ancore, gallerie, zoom dei volantini, menu mobile,
  preferenze cookie, movimento ridotto e contenuti senza JavaScript.

La verifica mobile usa l'emulazione del browser; non sostituisce una prova su
un iPhone fisico.
