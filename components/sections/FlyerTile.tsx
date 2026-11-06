"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Flyer, HomeCopy } from "@/lib/content/schemas";
import { flyerStoreNames, formatDateRangeIt, homeFlyer } from "@/lib/flyers";
import { useToday } from "@/lib/date-store";
import { cn } from "@/lib/utils";

type Props = {
  flyers: Flyer[];
  stores: { id: string; citta: string }[];
  buildDate: string;
  copy: HomeCopy["volantino"];
  className?: string;
};

/**
 * Riquadro "Volantino" del tabellone. Con un volantino in corso o in arrivo: copertina vera, stato e date.
 * Altrimenti un riquadro neutro con bordo blu, senza copertina (mai quella di un volantino concluso).
 */
export function FlyerTile({ flyers, stores, buildDate, copy, className }: Props) {
  const today = useToday(buildDate);
  const found = homeFlyer(flyers, today);
  if (!found) {
    return (
      <div className={cn("flex flex-col rounded-[var(--radius-xl)] border-2 border-brand-blue-600 bg-white p-4 text-brand-blue-900 sm:p-5", className)}>
        <h2 className="!text-base !font-black uppercase tracking-wide text-brand-blue-900">{copy.titolo}</h2>
        <p className="mt-2 max-w-sm text-base text-ink">{copy.vuoto.testo}</p>
        <Button href="/offerte/#archivio" variant="outline" size="sm" className="mt-3 self-start lg:mt-auto">
          {copy.vuoto.cta}
        </Button>
      </div>
    );
  }
  const { flyer, status } = found;
  const upcoming = status === "upcoming";
  const state = upcoming ? copy.statoAnteprima : copy.statoAttivo;
  const names = flyerStoreNames(flyer, stores);
  const href = "/offerte/";

  return (
    <div className={cn("flex flex-col rounded-[var(--radius-xl)] border-2 border-brand-magenta-600 bg-white text-brand-blue-900", className)}>
      <div className="flex min-h-11 items-center justify-between rounded-t-[calc(var(--radius-xl)-2px)] bg-brand-magenta-600 px-4 py-2 text-white">
        <h2 className="!text-base !font-black uppercase tracking-wide text-white">{copy.titolo}</h2>
        <span className="rounded-md bg-white px-2 py-0.5 text-sm font-extrabold text-brand-magenta-700">{state}</span>
      </div>
      <div className="grid flex-1 grid-cols-[6.5rem_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
        <Link href={href} aria-label={`${flyer.titolo}: ${state}`} className="group block self-start">
          <SmartImage
            src={flyer.copertina.src}
            alt={flyer.copertina.alt}
            label={flyer.titolo}
            ratio="210/297"
            sizes="112px"
            rounded="rounded-md"
            className="ring-1 ring-brand-blue-100"
            imgClassName="group-hover:scale-100"
          />
        </Link>
        <div className="flex min-w-0 flex-col">
          <h3 className="!text-lg leading-tight">{flyer.titolo}</h3>
          <p className="mt-1 text-sm font-semibold">{formatDateRangeIt(flyer.validoDal, flyer.validoAl)}</p>
          <p className="text-sm text-muted">{names ? copy.soloNegozi.replace("{negozi}", names) : copy.tuttiINegozi}</p>
          {upcoming && <p className="mt-2 text-sm text-brand-blue-800">{copy.avvisoAnteprima}</p>}
          <Button href={href} size="sm" className="mt-3 self-start lg:mt-auto">
            {upcoming ? copy.ctaAnteprima : copy.ctaAttivo}
          </Button>
        </div>
      </div>
    </div>
  );
}
