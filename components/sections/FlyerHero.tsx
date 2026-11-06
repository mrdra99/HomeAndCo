import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Flyer, HomeCopy } from "@/lib/content/schemas";
import { flyerStoreNames, formatDateRangeIt, type HomeFlyerStatus } from "@/lib/flyers";

type Props = {
  flyer: Flyer;
  status: HomeFlyerStatus;
  stores: { id: string; citta: string }[];
  copy: HomeCopy["volantino"];
  className?: string;
};

/**
 * Blocco grande del tabellone quando c'e' un volantino in corso o in arrivo: insegna «Volantino» con le date,
 * titolo, negozi, chiamata e copertina vera a lato. La copertina (almeno 1280 px) e' mostrata a 302 px al massimo
 * (limite nitido 640 px), con una piccola inclinazione fissa: nessuna animazione.
 */
export function FlyerHero({ flyer, status, stores, copy, className }: Props) {
  const upcoming = status === "upcoming";
  const state = upcoming ? copy.statoAnteprima : copy.statoAttivo;
  const names = flyerStoreNames(flyer, stores);
  const dates = formatDateRangeIt(flyer.validoDal, flyer.validoAl);
  return (
    <div data-flyer-hero={flyer.id} className={`on-dark flex flex-col overflow-hidden rounded-[var(--radius-xl)] bg-brand-magenta-600 text-white ${className ?? ""}`}>
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-brand-blue-900 px-4 py-2 text-sm sm:px-6">
        <span className="font-extrabold uppercase tracking-wide">{copy.titolo}</span>
        <span className="inline-flex items-center gap-2 font-bold">
          <Icon name="calendar" size={16} />
          {dates.charAt(0).toUpperCase() + dates.slice(1)}
        </span>
      </div>
      <div className="grid flex-1 grid-cols-[minmax(0,1fr)_8.5rem] content-center items-center gap-x-4 gap-y-4 p-4 min-[480px]:grid-cols-[minmax(0,1fr)_11rem] sm:gap-x-8 sm:gap-y-0 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:p-9 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="col-start-1 row-start-1 sm:self-end">
          <span className="inline-block rounded-md bg-white px-2 py-0.5 text-sm font-extrabold text-brand-magenta-700">{state}</span>
          <h1 className="mt-3 text-[clamp(1.5rem,6.4vw,2.1rem)] leading-[1.05] text-white sm:text-[clamp(2.1rem,3.3vw,3.25rem)]">{flyer.titolo}</h1>
          <p className="mt-3 text-base font-semibold sm:text-lg">{names ? copy.soloNegozi.replace("{negozi}", names) : copy.tuttiINegozi}</p>
          {upcoming && <p className="mt-1 hidden max-w-md text-base text-white/95 sm:block">{copy.avvisoAnteprima}</p>}
        </div>
        <Link
          href="/offerte/"
          aria-label={`${flyer.titolo}: ${state}`}
          className="col-start-2 row-start-1 block w-full rotate-[2deg] justify-self-center rounded-md shadow-[0_10px_28px_rgb(0_0_0/0.35)] sm:row-span-2"
        >
          <SmartImage
            src={flyer.copertina.src}
            alt={flyer.copertina.alt}
            label={flyer.titolo}
            ratio="210/297"
            sizes="(min-width: 1280px) 302px, (min-width: 1024px) 252px, (min-width: 480px) 176px, 136px"
            rounded="rounded-md"
            imgClassName="group-hover:scale-100"
          />
        </Link>
        <div className="col-span-2 sm:col-span-1 sm:col-start-1 sm:mt-6 sm:self-start">
          <Button href="/offerte/" variant="light" size="lg" iconRight={<Icon name="arrow-right" size={20} />} className="w-full sm:w-auto">
            {upcoming ? copy.ctaAnteprima : copy.ctaAttivo}
          </Button>
        </div>
      </div>
    </div>
  );
}
