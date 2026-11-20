"use client";

import type { ComponentType } from "react";
import type { Campaign, CampaignEffect } from "@/lib/content/schemas";
import { useDesktopMotion } from "@/lib/use-media-query";
import { Snowfall } from "./effects/Snowfall";
import { useActiveCampaign } from "./useActiveCampaign";

/**
 * Registro degli effetti di stagione: nome usato in content/campaigns.json → componente.
 * Per un nuovo evento (es. coriandoli a Carnevale) si aggiunge il nome in CAMPAIGN_EFFECTS
 * (lib/content/schemas.ts), il componente qui, e lo si accende sulla campagna con le sue date.
 */
const EFFECTS: Record<CampaignEffect, ComponentType> = {
  neve: Snowfall,
};

/**
 * Accende gli effetti della campagna attiva. La campagna e' scelta per data dalla stessa logica di tutto il sito
 * (lib/campaigns.ts → pickCampaign), ricontrollata nel client: allo scadere delle date l'effetto si spegne da solo.
 * Solo desktop e senza movimento ridotto: sotto 1024 px non viene montato nulla.
 */
export function SeasonalEffects({ campaigns, buildCampaignId }: { campaigns: Campaign[]; buildCampaignId: string }) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const enabled = useDesktopMotion();
  if (!enabled || campaign.effetti.length === 0) return null;
  return (
    <>
      {campaign.effetti.map((name) => {
        const Effect = EFFECTS[name];
        return <Effect key={name} />;
      })}
    </>
  );
}
