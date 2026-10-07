/**
 * Punti di inserimento per analytics di terze parti.
 * Chiamare queste funzioni SOLO dopo il consenso (lo fa components/consent/Analytics.tsx).
 * Sono idempotenti: un secondo richiamo non ricarica lo script.
 *
 * TODO (cliente): fornire l'ID GA4 (G-XXXXXXXXXX) e/o l'ID Meta Pixel e inserirli in
 * content/settings.json -> analytics.gaId / analytics.metaPixelId. Finche' sono null non succede nulla.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    _fbq?: unknown;
  }
}

const GA_RE = /^G-[A-Z0-9]{4,20}$/;
const PIXEL_RE = /^\d{5,20}$/;

function addScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** Google Analytics 4. */
export function loadGoogleAnalytics(gaId: string | null) {
  if (!gaId || !GA_RE.test(gaId) || typeof window === "undefined") return;
  if (document.getElementById("ga4-script")) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", gaId, { anonymize_ip: true });
  addScript("ga4-script", `https://www.googletagmanager.com/gtag/js?id=${gaId}`);
}

/** Meta Pixel (solo categoria marketing). */
export function loadMetaPixel(pixelId: string | null) {
  if (!pixelId || !PIXEL_RE.test(pixelId) || typeof window === "undefined") return;
  if (document.getElementById("meta-pixel-script")) return;
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      (fbq.queue = fbq.queue || []).push(args);
    } as NonNullable<Window["fbq"]>;
    fbq.queue = [];
    fbq.loaded = true;
    window.fbq = fbq;
    window._fbq = fbq;
  }
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
  addScript("meta-pixel-script", "https://connect.facebook.net/en_US/fbevents.js");
}
