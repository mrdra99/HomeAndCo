/**
 * Regola di risoluzione: la larghezza CSS con cui un'immagine viene mostrata non deve mai superare
 * la sua larghezza intrinseca / 2 (cosi' resta nitida sugli schermi 2x; sui 3x non e' mai ingrandita
 * piu' di 1,5 volte). Se una foto e' piu' piccola, si mostra piu' piccola: mai ingrandita.
 */
export const MIN_PIXEL_DENSITY = 2;

/** Larghezza CSS massima (px) per un'immagine di larghezza intrinseca data. */
export function maxDisplayWidth(intrinsicWidth: number): number {
  return Math.floor(intrinsicWidth / MIN_PIXEL_DENSITY);
}

/** Vero se mostrare l'immagine a `cssWidth` rispetta la regola. */
export function isSharpAt(intrinsicWidth: number, cssWidth: number): boolean {
  return cssWidth <= maxDisplayWidth(intrinsicWidth);
}

/** Come maxDisplayWidth, per una densita' di pixel arbitraria (es. 3 per un telefono 3x). */
export function maxDisplayWidthAtDpr(intrinsicWidth: number, dpr: number): number {
  return Math.floor(intrinsicWidth / dpr);
}

/**
 * Limiti di visualizzazione delle copertine video, verificati dal test image-resolution.
 * Reel: 360 x 640 px. Sotto `sm` (telefoni, fino a 3x) al massimo 120 px CSS (360 / 3: mai ingrandito);
 * da `sm` in su al massimo 180 px CSS (360 / 2). Poster del video: 720 x 1280 px (= risoluzione del
 * file MP4) -> al massimo 320 px CSS.
 */
export const REEL_COVER_MAX_CSS_WIDTH_MOBILE = 120;
export const REEL_COVER_MAX_CSS_WIDTH = 180;
export const VIDEO_POSTER_MAX_CSS_WIDTH = 320;

/**
 * Larghezza CSS massima delle 5 schede dei gruppi di reparti in home (ordine di content/navigation.json → gruppi),
 * misurata da 1536 px in su, dove la sezione arriva al suo massimo (96rem, griglia 7+5 / 4+4+4, spazio 20 px).
 * Sotto quella larghezza le schede sono piu' strette, mai piu' larghe. Il test verifica che ogni foto sia larga
 * almeno il doppio.
 */
export const DEPARTMENT_CARD_MAX_CSS_WIDTH = [850, 610, 480, 480, 480] as const;

/**
 * Foto a tutta larghezza su desktop (testata del reparto, slide fotografiche del banner in home): nitide fino a
 * 1440 px CSS sui 2x, quindi larghe almeno 2880 px. Verificato dal test desktop-feedback.
 * Eccezione temporanea accettata dal cliente il 20/11/2026: la foto della campagna di Natale (1536 px) nella prima
 * slide, finche' non arriva la grafica `bannerDesktop` da 3840 x 1280 px.
 */
export const DESKTOP_FULL_BLEED_MIN_WIDTH = 2880;

/**
 * Testata sotto 1024 px di reparti e volantino (components/layout/MobileHero.tsx): sotto 544 px la foto copre tutta la
 * larghezza (al massimo 543 px CSS), da 544 px e' un riquadro di 320 px. Le foto usate li' devono essere nitide a 543 px.
 * Verificato dal test mobile-feedback.
 */
export const MOBILE_HERO_MAX_CSS_WIDTH = 543;
