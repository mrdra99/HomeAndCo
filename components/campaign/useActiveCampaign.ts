"use client";

import { useSyncExternalStore } from "react";
import { pickCampaign } from "@/lib/campaigns";
import type { Campaign } from "@/lib/content/schemas";
import { subscribeToDateChange } from "@/lib/date-store";

/**
 * Campagna attiva. Server e primo render client = campagna di build (HTML statico corretto,
 * nessun mismatch); dopo l'idratazione, se la data reale indica un'altra campagna, ritorna quella.
 */
export function useActiveCampaign(campaigns: Campaign[], buildId: string): Campaign {
  const id = useSyncExternalStore(
    subscribeToDateChange,
    () => pickCampaign(campaigns, new Date()).id,
    () => buildId,
  );
  return campaigns.find((c) => c.id === id) ?? campaigns.find((c) => c.id === buildId) ?? campaigns[0];
}
