"use client";

import { AnimatePresence, m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Campaign } from "@/lib/content/schemas";
import { formatDateRangeIt } from "@/lib/flyers";
import { HeroArt } from "./HeroArt";
import { useActiveCampaign } from "./useActiveCampaign";

type CampaignHeroProps = {
  /** Tutte le campagne (serializzate): servono per il ricontrollo della data nel client. */
  campaigns: Campaign[];
  /** Campagna scelta in build: e' quella dell'HTML statico. */
  buildCampaignId: string;
};

function stickerText(c: Campaign): string {
  if (c.inizio && c.fine) {
    const t = formatDateRangeIt(c.inizio, c.fine);
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  return "Solo in negozio";
}

/**
 * Hero della campagna attiva. Render iniziale = campagna di build; dopo l'idratazione, se la
 * data reale indica un'altra campagna, il contenuto passa all'altra con un crossfade.
 */
export function CampaignHero({ campaigns, buildCampaignId }: CampaignHeroProps) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const reduce = useReducedMotion();
  const artRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: artRef, offset: ["start end", "end start"] });
  // parallax leggero: max 6% dell'altezza, spento con reduced motion
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section className="relative overflow-hidden bg-cream pb-14 pt-8 sm:pb-20 sm:pt-14" aria-labelledby="hero-title">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-accent opacity-[0.08]"
      />
      <Container size="wide">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={campaign.id}
            data-campaign-hero={campaign.id}
            className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div>
              <h1 id="hero-title" className="text-brand-blue-900">
                {campaign.titolo}
              </h1>
              {campaign.sottotitolo && (
                <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">{campaign.sottotitolo}</p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  href={campaign.cta.href}
                  size="lg"
                  className="!bg-accent hover:brightness-90"
                  iconRight={<Icon name="arrow-right" size={20} />}
                >
                  {campaign.cta.label}
                </Button>
                {campaign.ctaSecondaria && (
                  <Button href={campaign.ctaSecondaria.href} size="lg" variant="outline">
                    {campaign.ctaSecondaria.label}
                  </Button>
                )}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div
                ref={artRef}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[999px] rounded-b-[var(--radius-xl)] bg-brand-blue-50 shadow-lift"
              >
                <m.div className="absolute inset-[-4%]" style={reduce ? undefined : { y }}>
                  {campaign.immagineHero.src ? (
                    <SmartImage
                      src={campaign.immagineHero.src}
                      alt={campaign.immagineHero.alt}
                      label={campaign.immagineHero.label ?? "Immagine hero"}
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      priority
                      rounded="rounded-none"
                    />
                  ) : (
                    <HeroArt tema={campaign.tema} className="h-full w-full" />
                  )}
                </m.div>
              </div>
              <Badge tone="accent" rotate={5} className="absolute -right-1 top-10 px-4 py-2 text-lg sm:-right-4">
                {stickerText(campaign)}
              </Badge>
            </div>
          </m.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
