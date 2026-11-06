"use client";

import { useActiveCampaign } from "@/components/campaign/useActiveCampaign";
import { Button } from "@/components/ui/Button";
import { isDefaultCampaign } from "@/lib/campaigns";
import type { Campaign } from "@/lib/content/schemas";

type Props = {
  /** Tutte le campagne (serve al ricontrollo della data nel client). */
  campaigns: Campaign[];
  /** Id della campagna attiva al momento della build. */
  buildCampaignId: string;
  /** Slug del corridoio corrente. */
  slug: string;
};

/**
 * Fascia magenta "<campagna>" mostrata solo se la campagna attiva mette in evidenza questo reparto.
 * Il colore e' sempre il magenta del marchio; la scelta e' ricontrollata nel client con la data reale.
 */
export function AisleCampaignBanner({ campaigns, buildCampaignId, slug }: Props) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  if (isDefaultCampaign(campaign) || !campaign.corridoiInEvidenza.includes(slug)) return null;
  return (
    <div className="on-dark flex flex-col gap-3 rounded-[var(--radius-xl)] bg-brand-magenta-600 p-4 text-white sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="max-w-2xl">
        <p className="text-sm font-extrabold uppercase tracking-wide">{campaign.etichetta ?? "Home & Co."}</p>
        <h2 className="mt-1 !text-2xl !font-black text-white">{campaign.titolo}</h2>
        <p className="mt-1 text-white/95">{campaign.sottotitolo}</p>
      </div>
      <Button href={campaign.cta.href} variant="light" className="shrink-0">
        {campaign.cta.label}
      </Button>
    </div>
  );
}
