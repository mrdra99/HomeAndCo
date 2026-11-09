# Proposta Mike — 9 novembre 2026

Branch: codex/feedback-mike, base 45c3eac.

- Palette esistente: bianco #ffffff, blu #0f6bb4, blu scuro #0b2a47, magenta #d11559, fondo #eef3f8.
- Figtree: titolo breve sullo scatto, nessun paragrafo introduttivo. Allineamento a sinistra.
- Apertura: foto stagionale dominante → due accessi compatti (volantino, negozi) → aree merceologiche con fotografie di dettaglio.
- Un solo movimento: il volantino arriva a ogni apertura della home, dopo la scelta cookie; niente blocco della pagina. Rispetta reduced-motion.
- Reparto: foto generale in testata, sotto foto ravvicinate dei prodotti. La finestra di ingrandimento conserva lo scatto intero.

Riferimenti consultati: https://www.risparmiocasa.com/ (banner visivo e accesso volantino), https://www.eurospin.com/it-it/volantino/ (copertina, date e negozio), https://www.lidl.it/ (offerte attuali e future). Il volantino con aeroplanino è una proposta nostra, non un comportamento attribuito a questi siti.

Aggiornamento richiesto dal titolare: l'ultimo volantino ufficiale è Sesto Fiorentino, 23 ottobre–1 novembre. Il campo `inPrimoPiano` lo mantiene consultabile fino alla nuova edizione prevista a fine novembre. Compare nella home normale e nella pagina offerte, anche in produzione; nessun parametro demo. Le date stampate e l'ambito Sesto restano invariati. L'home conserva l'apertura fotografica e il volantino arriva come scheda, a ogni apertura della pagina. Un nuovo volantino in corso o in anteprima ha precedenza automaticamente.

La nuova scena natalizia è generata con lo strumento image_gen, usando la corsia cucina come riferimento per scaffalature, soffitto e pavimento. È un'immagine illustrativa, non una fotografia documentaria del negozio.

Prompt: fotografia orizzontale di una corsia natalizia di un negozio italiano di casalinghi, scaffali antracite, soffitto scuro con LED, pavimento beige; scatole di palline rosse/oro/argento, nastri, stelle, buste e carta regalo, festoni; luce realistica, prodotti nitidi, nessuna persona, logo, prezzo o testo leggibile.

## Verifica

- `npm run typecheck`, `npm run lint`, `npm test` (94 test), `npm run build`: completati senza errori.
- Browser: apertura a 320, 390, 768 px e desktop; nessun overflow orizzontale della pagina.
- Volantino ufficiale: arrivo dopo la scelta cookie, chiusura col pulsante; pagina e tab bar restano utilizzabili.
- Foto reparto: dettaglio quadrato più stretto; clic apre lo scatto intero e chiusura verificata.
- File finale generato: `public/uploads/photos/natale-corsia-concept.webp` (image_gen integrato, conversione WebP con sharp).

Correzione volantino: verificata anche la build di produzione servita in locale (porta 3002), senza parametri nella URL. Prima della scelta cookie non compare; dopo la scelta compare; il pulsante chiude; ricaricando la home compare di nuovo. Il collegamento apre subito l'ultima edizione ufficiale nella pagina offerte. Nessun vincolo NODE_ENV o sessionStorage.
