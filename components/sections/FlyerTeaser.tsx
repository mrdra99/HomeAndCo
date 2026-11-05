"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/motion/Reveal";
import type { Flyer, HomeCopy } from "@/lib/content/schemas";
import { archivedFlyers, currentFlyers, upcomingFlyers, formatDateRangeIt } from "@/lib/flyers";
import { useToday } from "@/lib/date-store";

type FlyerTeaserProps = { flyers: Flyer[]; buildDate: string; copy: HomeCopy["volantini"] };

export function FlyerTeaser({ flyers, buildDate, copy }: FlyerTeaserProps) {
  const today = useToday(buildDate);
  const current = currentFlyers(flyers, today)[0];
  const upcoming = upcomingFlyers(flyers, today)[0];
  const flyer = current ?? upcoming ?? archivedFlyers(flyers, today)[0];
  const preview = !current && Boolean(upcoming);
  if (!flyer) return null;
  if (!current && !upcoming) return (
    <Section tone="cream" className="py-12 sm:py-16">
      <div className="flex flex-col items-start justify-between gap-6 rounded-lg bg-white p-6 ring-1 ring-brand-blue-100 sm:flex-row sm:items-center sm:p-10">
        <div className="max-w-2xl">
          <h2 className="text-brand-blue-900">{copy.titolo}</h2>
          <p className="mt-3 text-muted">{copy.introArchivio}</p>
        </div>
        <Button href="/offerte/#archivio" className="shrink-0">{copy.ctaArchivio}</Button>
      </div>
    </Section>
  );
  return (
    <Section tone="cream" className="py-12 sm:py-16">
      <Reveal className="grid items-center gap-8 overflow-hidden rounded-lg bg-white p-6 ring-1 ring-brand-blue-100 sm:grid-cols-[13rem_1fr] sm:gap-12 sm:p-10">
        <Link href={current || preview ? "/offerte/" : "/offerte/#archivio"} aria-label={`Guarda ${flyer.titolo}`} className="group mx-auto block w-full max-w-52">
          <SmartImage src={flyer.copertina.src} alt={flyer.copertina.alt} label={flyer.titolo}
            ratio="210/297" sizes="208px" fit="contain" rounded="rounded-none" className="shadow-soft" />
        </Link>
        <div>
          <Badge tone={current ? "accent" : "sand"} className="mb-4">
            {current ? formatDateRangeIt(flyer.validoDal, flyer.validoAl) : preview ? copy.statoAnteprima : copy.statoArchivio}
          </Badge>
          <h2 className="text-brand-blue-900">{copy.titolo}</h2>
          <p className="mt-4 max-w-lg text-lg text-muted">{current ? copy.introAttivo : preview ? copy.introAnteprima : copy.introArchivio}</p>
          <p className="mt-4 text-sm text-muted">{flyer.titolo}: {formatDateRangeIt(flyer.validoDal, flyer.validoAl)}.</p>
          <Button href={current || preview ? "/offerte/" : "/offerte/#archivio"} size="lg" className="mt-6" iconRight={<Icon name="arrow-right" size={20} />}>
            {current ? copy.ctaAttivo : preview ? copy.ctaAnteprima : copy.ctaArchivio}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
