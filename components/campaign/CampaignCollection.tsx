"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { Campaign } from "@/lib/content/schemas";
import { useActiveCampaign } from "./useActiveCampaign";

export function CampaignCollection({ campaigns, buildCampaignId }: { campaigns: Campaign[]; buildCampaignId: string }) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const collection = campaign.collezione;
  if (!collection) return null;
  return (
    <section id="idee-di-stagione" aria-labelledby="collection-title" className="campaign-collection bg-white py-12 sm:py-16">
      <Container size="wide">
        <Reveal className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <h2 id="collection-title" className="max-w-xl !text-3xl text-brand-blue-900 sm:!text-4xl">{collection.titolo}</h2>
          <p className="max-w-sm text-muted">{collection.descrizione}</p>
        </Reveal>
        <Stagger as="ul" className="mt-8 grid gap-5 md:grid-cols-3">
          {collection.idee.map((idea) => (
            <StaggerItem as="li" key={idea.corridoio}>
              <Link href={`/corridoi/${idea.corridoio}/`} className={`group h-full overflow-hidden rounded-2xl bg-cream transition-colors hover:bg-brand-blue-50 ${idea.immagine?.src ? "grid grid-cols-[80px_minmax(0,1fr)] min-[380px]:grid-cols-[104px_minmax(0,1fr)] sm:flex sm:flex-col" : "flex flex-col"}`}>
                {idea.immagine?.src && (
                  <SmartImage src={idea.immagine.src} alt={idea.immagine.alt} label={idea.titolo} ratio="16/10"
                    position={idea.immagine.position} sizes="(min-width: 768px) 33vw, (min-width: 640px) 100vw, 104px" rounded="rounded-none" className="h-full sm:h-auto" />
                )}
                <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
                  <h3 className="!text-xl text-brand-blue-900">{idea.titolo}</h3>
                  <p className="mt-2 text-sm text-muted">{idea.testo}</p>
                  <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-sm font-bold text-[var(--accent-ink)] sm:pt-5">
                    <DepartmentIcon name={idea.corridoio} size={36} className="size-7 sm:size-9" />
                    <span className="decoration-2 underline-offset-4 group-hover:underline">Guarda il reparto</span>
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
