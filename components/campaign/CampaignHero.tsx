"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Campaign, Store } from "@/lib/content/schemas";
import { formatDateRangeIt } from "@/lib/flyers";
import { campaignPeriod, toIsoDate } from "@/lib/campaigns";
import { useToday } from "@/lib/date-store";
import { HeroArt } from "./HeroArt";
import { useActiveCampaign } from "./useActiveCampaign";

type CampaignHeroProps = {
  campaigns: Campaign[];
  buildCampaignId: string;
  buildDate: string;
  stores: Pick<Store, "id" | "citta">[];
};

/** Il contenuto iniziale è già nell'HTML; la data viene poi verificata nel browser. */
export function CampaignHero({ campaigns, buildCampaignId, buildDate, stores }: CampaignHeroProps) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const period = campaignPeriod(campaign, toIsoDate(useToday(buildDate)));
  const dateLabel = period.inizio && period.fine
    ? formatDateRangeIt(period.inizio, period.fine)
    : null;

  return (
    <section className="campaign-hero overflow-hidden pb-8 pt-7 sm:pb-10 sm:pt-10" aria-labelledby="hero-title">
      <Container size="wide">
        <div data-campaign-hero={campaign.id} className="grid items-center gap-6 sm:gap-9 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="py-2 lg:py-8">
            <p className="hero-eyebrow mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-accent ring-1 ring-black/5">
              <span aria-hidden className="size-2 rounded-full bg-accent" />
              {campaign.etichetta ?? "Ti aspettiamo da Home & Co."}
            </p>
            <h1 id="hero-title" className="max-w-[15ch] text-brand-blue-900 !text-[clamp(2.25rem,9.5vw,3.4rem)] !leading-[1.04] lg:max-w-[12ch] lg:!text-[clamp(2.6rem,5.1vw,4.7rem)]">
              {campaign.titolo}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">{campaign.sottotitolo}</p>
            <div className="mt-6 grid gap-3 min-[400px]:grid-cols-2 sm:mt-8 sm:flex sm:flex-wrap">
              <Button href={campaign.cta.href} size="lg" className="bg-accent px-5 text-base text-[var(--accent-contrast)] hover:bg-accent hover:brightness-90 sm:px-8 sm:text-lg">
                {campaign.cta.label}
              </Button>
              {campaign.ctaSecondaria && (
                <Button href={campaign.ctaSecondaria.href} size="lg" variant="outline" className="hero-secondary border-brand-blue-100 bg-white/60 px-5 text-base sm:px-8 sm:text-lg">
                  {campaign.ctaSecondaria.label}
                </Button>
              )}
            </div>
            {dateLabel && (
              <p className="mt-5 flex items-center gap-2 text-sm text-muted">
                <Icon name="calendar" size={17} />
                {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)}
              </p>
            )}
          </div>

          <div className="relative mx-auto w-full max-w-xl pb-5">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-brand-blue-50 sm:aspect-[8/7] sm:rounded-[2rem]">
              {campaign.immagineHero.src ? (
                <SmartImage src={campaign.immagineHero.src} alt={campaign.immagineHero.alt}
                  label={campaign.immagineHero.label ?? "Home & Co."} priority position={campaign.immagineHero.position}
                  sizes="(min-width: 1280px) 580px, (min-width: 1024px) 48vw, 100vw" rounded="rounded-none" />
              ) : (
                <HeroArt tema={campaign.tema} className="h-full w-full" />
              )}
            </div>
            {campaign.sticker && (
              <p className="absolute bottom-0 right-4 rotate-[-4deg] rounded-2xl bg-white px-5 py-4 font-display text-lg text-brand-blue-900 shadow-soft sm:right-7 sm:text-xl">
                {campaign.sticker}
              </p>
            )}
          </div>
        </div>
        <div className="hero-locations mt-7 flex flex-col gap-3 border-t border-brand-blue-900/10 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between lg:mt-8">
          <p className="font-semibold text-brand-blue-900">La tua casa, i nostri negozi in Toscana.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {stores.map((store) => (
              <li key={store.id}>
                <Link href={`/dove-siamo/#${store.id}`} className="inline-flex min-h-11 items-center gap-1.5 rounded text-brand-blue-800 underline-offset-4 hover:underline">
                  <Icon name="map-pin" size={16} />{store.citta}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
