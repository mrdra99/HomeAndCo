"use client";

import { Button } from "@/components/ui/Button";
import { useActiveCampaign } from "@/components/campaign/useActiveCampaign";
import type { Campaign } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

type Props = { campaigns: Campaign[]; buildCampaignId: string; className?: string };

/** Campagna stagionale in forma compatta (etichetta, titolo, link): sta nel riquadro in alto a destra quando il blocco grande e' il volantino. */
export function CampaignTile({ campaigns, buildCampaignId, className }: Props) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  return (
    <div data-campaign-tile={campaign.id} className={cn("flex flex-col rounded-[var(--radius-xl)] border-2 border-brand-blue-600 bg-white p-4 text-brand-blue-900 sm:p-5", className)}>
      <p className="text-base font-black uppercase tracking-wide text-brand-magenta-700">{campaign.etichetta ?? "Home & Co."}</p>
      <h2 className="mt-1 !text-2xl !leading-tight">{campaign.titolo}</h2>
      <Button href={campaign.cta.href} variant="secondary" size="sm" className="mt-3 self-start lg:mt-auto">
        {campaign.cta.label}
      </Button>
    </div>
  );
}
