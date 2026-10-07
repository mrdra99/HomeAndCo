"use client";

import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { useActiveCampaign } from "@/components/campaign/useActiveCampaign";
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
 * Banner "Speciale <campagna>" mostrato solo se la campagna attiva mette in evidenza questo corridoio.
 * Il colore e' l'accento della campagna; la scelta e' ricontrollata nel client con la data reale.
 */
export function AisleCampaignBanner({ campaigns, buildCampaignId, slug }: Props) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  if (isDefaultCampaign(campaign) || !campaign.corridoiInEvidenza.includes(slug)) return null;
  return (
    <Reveal>
      <div
        style={{ ["--accent" as string]: campaign.accento }}
        className="on-dark relative flex flex-col gap-5 overflow-hidden rounded-xl bg-accent p-6 text-white shadow-lift sm:flex-row sm:items-center sm:justify-between sm:p-10"
      >
        <div className="max-w-2xl">
          <Sticker tone="white" rotate={-3}>Speciale</Sticker>
          <h2 className="mt-4 text-white">{campaign.titolo}</h2>
          <p className="mt-3 text-lg text-white/90">{campaign.sottotitolo}</p>
        </div>
        <Button
          href={campaign.cta.href}
          size="lg"
          className="shrink-0 bg-white text-brand-blue-900 hover:bg-white/90"
        >
          {campaign.cta.label}
        </Button>
      </div>
    </Reveal>
  );
}
