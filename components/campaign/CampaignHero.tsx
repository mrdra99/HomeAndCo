"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Campaign, ImageRef } from "@/lib/content/schemas";
import { formatDateRangeIt } from "@/lib/flyers";
import { campaignPeriod, toIsoDate } from "@/lib/campaigns";
import { useToday } from "@/lib/date-store";
import { HeroArt } from "./HeroArt";
import { useActiveCampaign } from "./useActiveCampaign";

type CampaignHeroProps = { campaigns: Campaign[]; buildCampaignId: string; buildDate: string; className?: string };
type Cta = { label: string; href: string };

type HeroCardProps = {
  immagine: ImageRef;
  /** Illustrazione di ripiego della campagna quando manca la foto. */
  tema?: string;
  titolo: string;
  /** h1 per la prima scheda della pagina, h2 per le altre. */
  as?: "h1" | "h2";
  etichetta?: string | null;
  credito?: string;
  cta?: Cta;
  ctaSecondaria?: Cta;
  /** Solo la prima scheda visibile: le altre restano lazy (in un carosello non si scaricano finche' non arrivano). */
  priority?: boolean;
  sizes?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Scheda fotografica dell'apertura (sotto 1024 px): foto con velatura, etichetta in alto, titolo sfumato nei colori
 * del logo come sulla testata desktop (.hero-title-gradient) e le azioni. Usata dalla campagna e dalle altre slide.
 */
export function HeroCard({ immagine, tema, titolo, as: Heading = "h2", etichetta, credito, cta, ctaSecondaria, priority, sizes = "(min-width: 1280px) 1216px, 100vw", className, children }: HeroCardProps) {
  return (
    <div className={`campaign-photo on-dark relative isolate overflow-hidden rounded-[var(--radius-xl)] bg-brand-blue-900 text-white ${className ?? ""}`}>
      <div className="absolute inset-0 -z-20">
        {immagine.src ? (
          <SmartImage src={immagine.src} alt={immagine.alt} label="Home & Co."
            priority={priority} position={immagine.position}
            sizes={sizes} rounded="rounded-none" imgClassName="group-hover:scale-100" />
        ) : <HeroArt tema={tema ?? "default"} className="h-full w-full" />}
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_25%,rgb(3_15_27/0.35)_50%,rgb(3_15_27/0.94)_100%)] sm:bg-[linear-gradient(90deg,rgb(3_15_27/0.88),rgb(3_15_27/0.20)_70%)]" />
      {credito && <span className="absolute bottom-2 right-3 rounded bg-brand-blue-900/90 px-2 py-0.5 text-[10px] text-white/90">{credito}</span>}
      {etichetta && <span className="absolute left-4 top-4 rounded-md bg-brand-blue-900 px-3 py-1.5 text-xs font-bold sm:left-8 sm:top-6 sm:text-sm">{etichetta}</span>}
      {/* Con il credito della foto, piu' spazio sotto: nella scheda stretta del carosello coprirebbe i pulsanti. */}
      <div className={`flex h-full min-h-[23rem] flex-col justify-end p-5 sm:min-h-[28rem] sm:justify-center sm:p-9 lg:p-12 ${credito ? "pb-9" : ""}`}>
        <Heading className="hero-title-gradient max-w-[12ch] !text-[clamp(2.4rem,9vw,3.5rem)] !font-black !leading-[0.98] !tracking-[-0.03em] sm:max-w-[11ch] sm:!text-6xl lg:!text-7xl">{titolo}</Heading>
        {children}
        {(cta || ctaSecondaria) && (
          <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
            {cta && <Button href={cta.href} variant="primary" size="md" className="px-3 text-sm sm:px-5 sm:text-base">{cta.label}</Button>}
            {ctaSecondaria && <Button href={ctaSecondaria.href} variant="light" size="md" className="px-3 text-sm sm:px-5 sm:text-base">{ctaSecondaria.label}</Button>}
          </div>
        )}
      </div>
    </div>
  );
}

/** Apertura fotografica: una sola frase e le azioni, senza introduzione discorsiva. */
export function CampaignHero({ campaigns, buildCampaignId, buildDate, className }: CampaignHeroProps) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const period = campaignPeriod(campaign, toIsoDate(useToday(buildDate)));
  const dateLabel = period.inizio && period.fine ? formatDateRangeIt(period.inizio, period.fine) : null;

  return (
    <div data-campaign-hero={campaign.id} className={className}>
      <HeroCard
        immagine={campaign.immagineHero}
        tema={campaign.tema}
        titolo={campaign.titolo}
        as="h1"
        etichetta={dateLabel}
        credito={campaign.immagineHero.credito}
        cta={campaign.cta}
        ctaSecondaria={campaign.ctaSecondaria}
        priority
        className="h-full"
      />
    </div>
  );
}
