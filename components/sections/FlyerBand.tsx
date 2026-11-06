"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Flyer, HomeCopy } from "@/lib/content/schemas";
import { flyerStoreNames, formatDateRangeIt, homeFlyer } from "@/lib/flyers";
import { useToday } from "@/lib/date-store";

type Props = {
  flyers: Flyer[];
  stores: { id: string; citta: string }[];
  buildDate: string;
  copy: HomeCopy["volantino"];
};

/**
 * Con un volantino in corso o in arrivo: fascia magenta a tutta larghezza con copertina (1433 px mostrata
 * a 288 px al massimo). Altrimenti una sola striscia sottile, non magenta, con una frase breve e il link
 * ai volantini precedenti: nessuna copertina conclusa in home.
 */
export function FlyerBand({ flyers, stores, buildDate, copy }: Props) {
  const today = useToday(buildDate);
  const found = homeFlyer(flyers, today);
  if (!found) {
    return (
      <section id="volantino" aria-label={copy.titolo} className="border-y border-brand-blue-100 bg-brand-blue-50">
        <Container size="wide">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5">
            <p className="text-base text-brand-blue-900">
              <span className="font-extrabold">{copy.titolo}</span> · {copy.vuoto.fascia}
            </p>
            <Link href="/offerte/#archivio" className="inline-flex min-h-11 items-center gap-1.5 font-extrabold text-brand-blue-700 underline-offset-4 hover:underline">
              {copy.vuoto.ctaFascia}
              <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </Container>
      </section>
    );
  }
  const { flyer, status } = found;
  const upcoming = status === "upcoming";
  const state = upcoming ? copy.statoAnteprima : copy.statoAttivo;
  const names = flyerStoreNames(flyer, stores);
  const href = "/offerte/";
  const dates = formatDateRangeIt(flyer.validoDal, flyer.validoAl);

  return (
    <section id="volantino" aria-labelledby="volantino-title" className="on-dark bg-brand-magenta-600 py-7 text-white sm:py-10">
      <Container size="wide">
        <div className="grid items-center gap-5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
          <Link href={href} aria-label={`${flyer.titolo}: ${state}`} className="group relative mx-auto block w-48 sm:w-full">
            <SmartImage
              src={flyer.copertina.src}
              alt={flyer.copertina.alt}
              label={flyer.titolo}
              ratio="210/297"
              sizes="(min-width: 1024px) 288px, (min-width: 640px) 224px, 192px"
              rounded="rounded-md"
              className="ring-4 ring-white"
              imgClassName="group-hover:scale-100"
            />
            <span className="absolute inset-x-0 bottom-0 bg-white py-1.5 text-center text-sm font-black uppercase tracking-wide text-brand-magenta-700">
              {state}
            </span>
          </Link>
          <div>
            <h2 id="volantino-title" className="border-l-[6px] border-white pl-3 !font-black text-white">{copy.titolo}</h2>
            <p className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">{flyer.titolo}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-lg font-extrabold text-brand-magenta-700">
              <Icon name="calendar" size={22} />
              <span>{dates.charAt(0).toUpperCase() + dates.slice(1)}</span>
            </p>
            <p className="mt-3 text-base font-semibold">{names ? copy.soloNegozi.replace("{negozi}", names) : copy.tuttiINegozi}</p>
            {upcoming && <p className="mt-1 max-w-xl text-base text-white/95">{copy.avvisoAnteprima}</p>}
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href={href} variant="light" size="lg" iconRight={<Icon name="arrow-right" size={20} />}>
                {upcoming ? copy.ctaAnteprima : copy.ctaAttivo}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
