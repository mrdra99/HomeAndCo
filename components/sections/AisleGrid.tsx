"use client";

import Link from "next/link";
import { AisleArt } from "@/components/aisles/AisleArt";
import { Badge } from "@/components/ui/Badge";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { useActiveCampaign } from "@/components/campaign/useActiveCampaign";
import type { Aisle, Campaign, HomeCopy } from "@/lib/content/schemas";

type AisleGridProps = { aisles: Aisle[]; campaigns: Campaign[]; buildCampaignId: string; copy: HomeCopy["reparti"] };

export function AisleGrid({ aisles, campaigns, buildCampaignId, copy }: AisleGridProps) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const slugs = campaign.corridoiInEvidenza;
  const featured = slugs.map((slug) => aisles.find((aisle) => aisle.slug === slug)).filter((aisle): aisle is Aisle => Boolean(aisle));
  const ordered = [...featured, ...aisles.filter((aisle) => !slugs.includes(aisle.slug))];

  return (
    <Section tone="cream" id="corridoi" containerSize="wide">
      <Reveal><SectionHeading title={copy.titolo} subtitle={copy.descrizione} /></Reveal>
      <Stagger as="ul" className="mt-7 grid gap-4 sm:mt-9 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {ordered.map((aisle) => (
          <StaggerItem as="li" key={aisle.slug}>
            <Link href={`/corridoi/${aisle.slug}/`} className="group grid h-full grid-cols-[88px_minmax(0,1fr)] overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-brand-blue-900/5 transition-shadow hover:shadow-lift min-[380px]:grid-cols-[112px_minmax(0,1fr)] sm:flex sm:flex-col">
              <div className="relative min-h-40 overflow-hidden sm:min-h-0">
                {aisle.immagine.src ? (
                  <SmartImage src={aisle.immagine.src} alt={aisle.immagine.alt} label={aisle.titoloBreve} ratio="20/13"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 112px" rounded="rounded-none" className="h-full sm:h-auto" />
                ) : <AisleArt icon={aisle.icona} className="aspect-[20/13] w-full" />}
                {campaign.tema !== "default" && slugs.includes(aisle.slug) && (
                  <Badge tone="accent" className="absolute left-4 top-4 hidden !px-2.5 sm:inline-flex sm:!text-xs">
                    {campaign.etichetta ?? "Di stagione"}
                  </Badge>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
                {campaign.tema !== "default" && slugs.includes(aisle.slug) && (
                  <Badge tone="accent" className="mb-2 self-start !px-2 !py-1 !text-[0.65rem] sm:hidden">
                    {campaign.etichetta ?? "Di stagione"}
                  </Badge>
                )}
                <h3 className="!text-lg text-brand-blue-900 sm:!text-2xl">{aisle.titoloBreve}</h3>
                <p className="mt-2 text-sm text-muted">{aisle.descrizione}</p>
                <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-sm font-bold text-brand-blue-700 sm:pt-5">
                  <DepartmentIcon name={aisle.slug} size={36} className="size-7 sm:size-9" />
                  <span className="decoration-brand-magenta-600 decoration-2 underline-offset-4 group-hover:underline">{copy.cta}</span>
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
