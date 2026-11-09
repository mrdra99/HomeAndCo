"use client";

import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Flyer, HomeCopy, PagesCopy } from "@/lib/content/schemas";
import { flyerStoreNames, formatDateRangeIt, storeFlyer } from "@/lib/flyers";
import { useToday } from "@/lib/date-store";

type Props = {
  flyers: Flyer[];
  storeId: string;
  stores: { id: string; citta: string }[];
  buildDate: string;
  copy: PagesCopy["negozio"]["volantino"];
  flyerCopy: HomeCopy["volantino"];
  className?: string;
};

/** Volantino della sede: in corso, anteprima o ultima edizione ufficiale. Date e negozi non cambiano. */
export function StoreFlyer({ flyers, storeId, stores, buildDate, copy, flyerCopy, className }: Props) {
  const today = useToday(buildDate);
  const found = storeFlyer(flyers, storeId, today);
  if (!found) return null;
  const { flyer, status } = found;
  const upcoming = status === "upcoming";
  const names = flyerStoreNames(flyer, stores);
  const dates = formatDateRangeIt(flyer.validoDal, flyer.validoAl);
  return (
    <section aria-labelledby="negozio-volantino" className={className}>
      <div className="grid gap-4 rounded-[var(--radius-xl)] border-2 border-brand-magenta-600 bg-white p-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:p-5">
        <div className="w-28 sm:w-full">
          <SmartImage
            src={flyer.copertina.src}
            alt={flyer.copertina.alt}
            label={flyer.titolo}
            ratio="210/297"
            sizes="128px"
            rounded="rounded-md"
            className="ring-1 ring-brand-blue-100"
          />
        </div>
        <div className="flex min-w-0 flex-col items-start">
          <h2 id="negozio-volantino" className="!text-base !font-black uppercase tracking-wide text-brand-magenta-700">
            {status === "latest" ? flyerCopy.statoUltimo : upcoming ? copy.titoloAnteprima : copy.titoloAttivo}
          </h2>
          <p className="mt-1 text-xl font-extrabold leading-tight text-brand-blue-900">{flyer.titolo}</p>
          <p className="mt-1 text-sm font-semibold text-ink">{dates.charAt(0).toUpperCase() + dates.slice(1)}</p>
          <p className="text-sm text-muted">{names ? flyerCopy.soloNegozi.replace("{negozi}", names) : flyerCopy.tuttiINegozi}</p>
          {status === "latest" && <p className="mt-1 text-sm text-brand-blue-800">{flyerCopy.testoUltimo}</p>}
          {upcoming && <p className="mt-1 text-sm text-brand-blue-800">{flyerCopy.avvisoAnteprima}</p>}
          <Button href="/offerte/" size="sm" className="mt-3">
            {upcoming ? flyerCopy.ctaAnteprima : flyerCopy.ctaAttivo}
          </Button>
        </div>
      </div>
    </section>
  );
}
