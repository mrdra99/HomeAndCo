"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Campaign } from "@/lib/content/schemas";
import { formatDateRangeIt } from "@/lib/flyers";
import { campaignPeriod, toIsoDate } from "@/lib/campaigns";
import { useToday } from "@/lib/date-store";
import { HeroArt } from "./HeroArt";
import { useActiveCampaign } from "./useActiveCampaign";

type CampaignHeroProps = {
  campaigns: Campaign[];
  buildCampaignId: string;
  buildDate: string;
  className?: string;
};

/**
 * Blocco grande del tabellone: insegna in alto (campagna + date), titolo, chiamata, foto.
 * Il contenuto iniziale e' gia' nell'HTML; la data viene poi verificata nel browser.
 * La foto non supera mai la propria risoluzione: i file della campagna sono 1290 px o piu' larghi
 * e qui vengono mostrati a 560 px al massimo (limite nitido: 645 px per 1290).
 */
export function CampaignHero({ campaigns, buildCampaignId, buildDate, className }: CampaignHeroProps) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const period = campaignPeriod(campaign, toIsoDate(useToday(buildDate)));
  const dateLabel = period.inizio && period.fine ? formatDateRangeIt(period.inizio, period.fine) : null;

  return (
    <div
      data-campaign-hero={campaign.id}
      className={`on-dark overflow-hidden rounded-[var(--radius-xl)] bg-brand-magenta-600 text-white ${className ?? ""}`}
    >
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 bg-brand-blue-900 px-4 py-2 text-sm font-extrabold uppercase tracking-wide sm:px-6">
        <span>{campaign.etichetta ?? "Home & Co."}</span>
        {dateLabel && (
          <span className="inline-flex items-center gap-2 font-bold normal-case tracking-normal">
            <Icon name="calendar" size={16} />
            {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}
          </span>
        )}
      </div>
      <div className="grid sm:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:h-[calc(100%-2.75rem)]">
        <div className="order-2 flex flex-col justify-center gap-4 p-4 sm:order-1 sm:gap-6 sm:p-7 lg:p-9">
          <div>
            <h1 className="text-[clamp(1.75rem,7vw,2.4rem)] leading-[1.02] text-white sm:text-[clamp(2.1rem,3.3vw,3.25rem)] lg:max-w-[14ch]">
              {campaign.titolo}
            </h1>
            <p className="mt-4 hidden max-w-md text-lg text-white/95 sm:block">{campaign.sottotitolo}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <Button href={campaign.cta.href} variant="light" size="lg" className="px-2 text-[0.9375rem] min-[390px]:px-3 min-[390px]:text-base sm:px-6 sm:text-lg">{campaign.cta.label}</Button>
            {campaign.ctaSecondaria && (
              <Button href={campaign.ctaSecondaria.href} variant="outline" size="lg" className="border-white px-2 text-[0.9375rem] text-white hover:bg-white/10 min-[390px]:px-3 min-[390px]:text-base sm:px-6 sm:text-lg">
                {campaign.ctaSecondaria.label}
              </Button>
            )}
          </div>
        </div>
        <div className="relative order-1 aspect-[2/1] sm:order-2 sm:aspect-auto sm:min-h-[22rem]">
          {campaign.immagineHero.src ? (
            <SmartImage
              src={campaign.immagineHero.src}
              alt={campaign.immagineHero.alt}
              label={campaign.immagineHero.label ?? "Home & Co."}
              priority
              position={campaign.immagineHero.position}
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 330px, 100vw"
              rounded="rounded-none"
              imgClassName="group-hover:scale-100"
            />
          ) : (
            <HeroArt tema={campaign.tema} className="absolute inset-0 h-full w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
