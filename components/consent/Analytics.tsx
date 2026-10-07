"use client";

import { useEffect } from "react";
import { loadGoogleAnalytics, loadMetaPixel } from "@/lib/analytics";
import { useConsent } from "./ConsentProvider";

type AnalyticsProps = {
  gaId: string | null;
  metaPixelId: string | null;
};

/**
 * Carica GA4 e Meta Pixel solo dopo il consenso (statistiche / marketing) e solo se gli ID
 * in settings.analytics non sono null. Non rende nulla.
 * Nota: la revoca del consenso agisce al prossimo caricamento di pagina (gli script gia' caricati restano in memoria).
 */
export function Analytics({ gaId, metaPixelId }: AnalyticsProps) {
  const { ready, choices } = useConsent();
  useEffect(() => {
    if (ready && choices.statistiche) loadGoogleAnalytics(gaId);
  }, [ready, choices.statistiche, gaId]);
  useEffect(() => {
    if (ready && choices.marketing) loadMetaPixel(metaPixelId);
  }, [ready, choices.marketing, metaPixelId]);
  return null;
}
