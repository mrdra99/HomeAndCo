"use client";

import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Campaign } from "@/lib/content/schemas";
import { formatDateRangeIt } from "@/lib/flyers";
import { campaignPeriod, toIsoDate } from "@/lib/campaigns";
import { useToday } from "@/lib/date-store";
import { HeroArt } from "./HeroArt";
import { useActiveCampaign } from "./useActiveCampaign";

type CampaignHeroProps = { campaigns: Campaign[]; buildCampaignId: string; buildDate: string; className?: string };

/** Apertura fotografica: una sola frase e le azioni, senza introduzione discorsiva. */
export function CampaignHero({ campaigns, buildCampaignId, buildDate, className }: CampaignHeroProps) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const period = campaignPeriod(campaign, toIsoDate(useToday(buildDate)));
  const dateLabel = period.inizio && period.fine ? formatDateRangeIt(period.inizio, period.fine) : null;

  return (
    <div data-campaign-hero={campaign.id} className={`campaign-photo on-dark relative isolate overflow-hidden rounded-[var(--radius-xl)] bg-brand-blue-900 text-white ${className ?? ""}`}>
      <div className="absolute inset-0 -z-20">
        {campaign.immagineHero.src ? (
          <SmartImage src={campaign.immagineHero.src} alt={campaign.immagineHero.alt} label="Home & Co."
            priority position={campaign.immagineHero.position}
            sizes="(min-width: 1280px) 1216px, 100vw" rounded="rounded-none" imgClassName="group-hover:scale-100" />
        ) : <HeroArt tema={campaign.tema} className="h-full w-full" />}
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_25%,rgb(3_15_27/0.35)_50%,rgb(3_15_27/0.94)_100%)] sm:bg-[linear-gradient(90deg,rgb(3_15_27/0.88),rgb(3_15_27/0.20)_70%)]" />
      {campaign.immagineHero.credito && <span className="absolute bottom-2 right-3 rounded bg-brand-blue-900/90 px-2 py-0.5 text-[10px] text-white/90">{campaign.immagineHero.credito}</span>}
      {dateLabel && <span className="absolute left-4 top-4 rounded-md bg-brand-blue-900 px-3 py-1.5 text-xs font-bold sm:left-8 sm:top-6 sm:text-sm">{dateLabel}</span>}
      <div className="flex min-h-[23rem] flex-col justify-end p-5 sm:min-h-[28rem] sm:justify-center sm:p-9 lg:p-12">
        <h1 className="max-w-[12ch] text-[clamp(2.4rem,9vw,3.5rem)] leading-[0.98] text-white sm:max-w-[11ch] sm:text-6xl lg:text-7xl">{campaign.titolo}</h1>
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
          <Button href={campaign.cta.href} variant="primary" size="md" className="px-3 text-sm sm:px-5 sm:text-base">{campaign.cta.label}</Button>
          {campaign.ctaSecondaria && <Button href={campaign.ctaSecondaria.href} variant="light" size="md" className="px-3 text-sm sm:px-5 sm:text-base">{campaign.ctaSecondaria.label}</Button>}
        </div>
      </div>
    </div>
  );
}
