"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { HoverLift } from "@/components/motion/HoverLift";
import { Badge } from "@/components/ui/Badge";
import { Icon, isIconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { useActiveCampaign } from "@/components/campaign/useActiveCampaign";
import type { Aisle, Campaign } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

type AisleGridProps = {
  /** Corridoi visibili in ordine naturale. */
  aisles: Aisle[];
  campaigns: Campaign[];
  buildCampaignId: string;
};

/** Span desktop (4 colonne): il primo e' grande 2x2, gli ultimi riempiono la riga. */
function desktopSpan(index: number, total: number): string {
  if (index === 0) return "lg:col-span-2 lg:row-span-2";
  const rest = total - 5; // elementi oltre i primi 5
  if (rest > 0 && index >= 5) {
    const pos = index - 5;
    if (rest === 1) return "lg:col-span-4";
    if (rest === 2) return "lg:col-span-2";
    if (rest === 3) return pos === 2 ? "lg:col-span-2" : "";
  }
  return "";
}

export function AisleGrid({ aisles, campaigns, buildCampaignId }: AisleGridProps) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const slugs = campaign.corridoiInEvidenza;
  const featured = slugs.map((s) => aisles.find((a) => a.slug === s)).filter((a): a is Aisle => Boolean(a));
  const ordered = [...featured, ...aisles.filter((a) => !slugs.includes(a.slug))];
  const badgeLabel =
    campaign.tema !== "default" ? `In evidenza per ${campaign.tema.charAt(0).toUpperCase()}${campaign.tema.slice(1)}` : null;
  const total = ordered.length;

  return (
    <Section tone="cream" id="corridoi" containerSize="wide">
      <Reveal>
        <SectionHeading
          eyebrow="Il nostro assortimento"
          title={
            <>
              I nostri <span className="underline-hand">corridoi</span>
            </>
          }
          subtitle="Tutto per la casa, in un solo posto: scegli il reparto e scopri cosa trovi."
        />
      </Reveal>

      <ul className="mt-10 grid auto-rows-fr grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {ordered.map((aisle, i) => {
          const big = i === 0;
          // Ultima card a tutta riga su desktop: immagine bassa e larga invece di 4/3 gigante.
          const wide = desktopSpan(i, total).includes("lg:col-span-4");
          const isFeatured = i < featured.length && badgeLabel;
          const oddLastMobile = i === total - 1 && total % 2 === 0; // dopo il primo (span 2) restano dispari
          return (
            <li
              key={aisle.slug}
              className={cn(
                big && "col-span-2",
                oddLastMobile && "col-span-2 lg:col-span-1",
                desktopSpan(i, total),
              )}
            >
              <HoverLift className="h-full">
                <Link
                  href={`/corridoi/${aisle.slug}/`}
                  className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-soft transition-shadow hover:shadow-lift"
                >
                  <div className={cn("relative", big ? "min-h-52 flex-1" : "", wide && "aspect-[4/3] lg:aspect-auto lg:h-72")}>
                    <SmartImage
                      src={aisle.immagine.src}
                      alt={aisle.immagine.alt}
                      label={aisle.immagine.label ?? `Foto corridoio ${aisle.titoloBreve}`}
                      ratio={big || wide ? undefined : "4/3"}
                      sizes={big ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                      rounded="rounded-none"
                      className={big || wide ? "absolute inset-0" : undefined}
                    />
                    {isFeatured && (
                      <Badge tone="accent" className="absolute left-3 top-3 text-xs">
                        {badgeLabel}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="flex items-center gap-2 text-lg text-brand-blue-900 sm:text-xl">
                      {isIconName(aisle.icona) && (
                        <Icon name={aisle.icona} size={22} className="shrink-0 text-brand-magenta-700" />
                      )}
                      {aisle.titoloBreve}
                    </h3>
                    <p className={cn("mt-1.5 text-sm text-muted", !big && "line-clamp-2 sm:line-clamp-3")}>
                      {aisle.descrizione}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-magenta-700">
                      Scopri <Icon name="arrow-right" size={16} />
                    </span>
                  </div>
                </Link>
              </HoverLift>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
