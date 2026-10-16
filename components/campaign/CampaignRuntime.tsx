"use client";

import { useEffect } from "react";
import { campaignCssVars } from "@/lib/campaigns";
import type { Campaign } from "@/lib/content/schemas";
import { useActiveCampaign } from "./useActiveCampaign";

/** Mantiene tema e contenuti sincronizzati anche oltre la mezzanotte. */
export function CampaignRuntime({ campaigns, buildCampaignId }: { campaigns: Campaign[]; buildCampaignId: string }) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.campaign = campaign.id;
    root.dataset.theme = campaign.tema;
    for (const [name, value] of Object.entries(campaignCssVars(campaign))) {
      root.style.setProperty(name, value);
    }
  }, [campaign]);
  return null;
}
