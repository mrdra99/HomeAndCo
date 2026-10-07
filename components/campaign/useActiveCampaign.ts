"use client";

import { useSyncExternalStore } from "react";
import { pickCampaign } from "@/lib/campaigns";
import type { Campaign } from "@/lib/content/schemas";

const noopSubscribe = (cb: () => void) => {
  // ricontrolla ogni minuto (cambio di giorno a pagina aperta)
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};

/**
 * Campagna attiva. Server e primo render client = campagna di build (HTML statico corretto,
 * nessun mismatch); dopo l'idratazione, se la data reale indica un'altra campagna, ritorna quella.
 */
export function useActiveCampaign(campaigns: Campaign[], buildId: string): Campaign {
  const id = useSyncExternalStore(
    noopSubscribe,
    () => pickCampaign(campaigns, new Date()).id,
    () => buildId,
  );
  return campaigns.find((c) => c.id === id) ?? campaigns.find((c) => c.id === buildId) ?? campaigns[0];
}
