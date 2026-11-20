"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { Icon } from "@/components/ui/Icon";
import type { Campaign, Flyer, HeaderCopy, HomeCopy, Store } from "@/lib/content/schemas";
import { useToday } from "@/lib/date-store";
import { homeFlyer } from "@/lib/flyers";
import { CampaignTile } from "./CampaignTile";
import { FlyerHero } from "./FlyerHero";
import { FlyerArrival } from "./FlyerArrival";
import { HomeBanner } from "./HomeBanner";
import { HomeHeroMobile } from "./HomeHeroMobile";

/*
 * Riquadri Volantino e Negozi, solo desktop: testo grande e, al passaggio del mouse, il colore del riquadro lo
 * riempie da sinistra (pseudo-elemento ::before) mentre il titolo si ingrandisce verso i bordi con un piccolo
 * rimbalzo. Solo transform e colori, niente cambi di dimensione; con movimento ridotto restano i soli colori.
 * Sotto 1024 px nessuna di queste classi ha effetto: li' il colore pieno compare al tocco (TILE_TAP).
 */
const TILE_FX =
  "lg:relative lg:isolate lg:min-h-40 lg:gap-7 lg:overflow-hidden lg:rounded-[var(--radius-xl)] lg:px-9 lg:transition-colors lg:duration-500 " +
  "lg:before:absolute lg:before:inset-0 lg:before:-z-10 lg:before:origin-left lg:before:scale-x-0 lg:before:transition-transform lg:before:duration-500 lg:before:ease-[cubic-bezier(0.65,0,0.35,1)] " +
  "lg:hover:text-white lg:hover:before:scale-x-100 lg:focus-visible:text-white lg:focus-visible:before:scale-x-100";
/** Solo sotto 1024 px (niente passaggio del mouse): al tocco il riquadro si riempie del suo colore, come al hover desktop. */
const TILE_TAP = "max-lg:transition-colors max-lg:duration-150 max-lg:active:text-white";
const TILE_TITLE =
  "lg:inline-block lg:origin-[0%_85%] lg:text-[2.5rem] lg:font-black lg:leading-tight lg:tracking-[-0.02em] lg:transition-transform lg:duration-500 lg:ease-[cubic-bezier(0.34,1.56,0.64,1)] lg:motion-safe:group-hover/tile:scale-[1.45]";
const TILE_SUB = "lg:mt-1 lg:text-lg lg:font-semibold lg:transition-transform lg:duration-500 lg:motion-safe:group-hover/tile:translate-y-1.5";
const TILE_ICON = "lg:size-16 lg:transition-transform lg:duration-500 lg:motion-safe:group-hover/tile:-rotate-6 lg:motion-safe:group-hover/tile:scale-110";
const TILE_ARROW = "lg:size-8 lg:transition-transform lg:duration-500 lg:motion-safe:group-hover/tile:translate-x-2 lg:motion-safe:group-hover/tile:scale-125";

type Props = { campaigns: Campaign[]; buildCampaignId: string; buildDate: string; flyers: Flyer[]; stores: Store[]; copy: HomeCopy; statusCopy: HeaderCopy["negozio"] };

export function PromoBoard({ campaigns, buildCampaignId, buildDate, flyers, stores, copy }: Props) {
  const today = useToday(buildDate);
  const found = homeFlyer(flyers, today);
  const leadFlyer = found && found.status !== "latest";
  return (
    <section aria-label={copy.tabellone.aria} className="bg-white pb-2 pt-3 sm:pt-5 lg:pt-0">
      {/* Desktop: banner da bordo a bordo al posto della foto della campagna (che resta sotto 1024 px). */}
      <HomeBanner campaigns={campaigns} buildCampaignId={buildCampaignId} buildDate={buildDate} copy={copy.banner} headingLevel={leadFlyer ? "h2" : "h1"} />
      <Container size="wide" className="lg:pt-6">
        {leadFlyer ? <FlyerHero flyer={found.flyer} status={found.status} stores={stores} copy={copy.volantino} />
          : <HomeHeroMobile campaigns={campaigns} buildCampaignId={buildCampaignId} buildDate={buildDate} copy={copy.banner} className="lg:hidden" />}
        <div className={`mt-3 grid grid-cols-2 gap-3 lg:gap-5 ${leadFlyer ? "lg:mt-5" : "lg:mt-0"}`}>
          {leadFlyer ? <CampaignTile campaigns={campaigns} buildCampaignId={buildCampaignId} /> : (
            <Link href="/offerte/" className={`group/tile flex min-h-20 items-center gap-3 rounded-lg border border-brand-magenta-100 bg-brand-magenta-50 p-3 text-brand-magenta-700 sm:px-5 ${TILE_FX} ${TILE_TAP} max-lg:active:border-brand-magenta-600 max-lg:active:bg-brand-magenta-600 lg:before:bg-brand-magenta-600 lg:hover:border-brand-magenta-600`}>
              {found ? <span className="block w-10 shrink-0 rotate-[-5deg] lg:w-20 lg:transition-transform lg:duration-500 lg:group-hover/tile:rotate-[-12deg] lg:group-hover/tile:scale-110"><SmartImage src={found.flyer.copertina.src} alt={found.flyer.copertina.alt} label={found.flyer.titolo} ratio="210/297" sizes="(min-width: 1024px) 80px, 40px" /></span> : <Icon name="flyer" size={30} className={`shrink-0 ${TILE_ICON}`} />}
              <span><strong className={`block text-base sm:text-lg ${TILE_TITLE}`}>{copy.volantino.titolo}</strong><span className={`block text-xs sm:text-sm ${TILE_SUB}`}>{found ? copy.volantino.statoUltimo : copy.volantino.vuoto.ctaFascia}</span></span>
              <Icon name="arrow-right" size={20} className={`ml-auto hidden sm:block ${TILE_ARROW}`} />
            </Link>
          )}
          <Link href="/dove-siamo/" className={`group/tile flex min-h-20 items-center gap-3 rounded-lg border border-brand-blue-100 bg-brand-blue-50 p-3 text-brand-blue-900 sm:px-5 ${TILE_FX} ${TILE_TAP} max-lg:active:border-brand-blue-600 max-lg:active:bg-brand-blue-600 lg:before:bg-brand-blue-600 lg:hover:border-brand-blue-600`}>
            <Icon name="map-pin" size={30} className={`shrink-0 ${TILE_ICON}`} />
            <span><strong className={`block text-base sm:text-lg ${TILE_TITLE}`}>{copy.tabellone.negozi.titolo}</strong><span className={`block text-xs sm:text-sm ${TILE_SUB}`}>{copy.tabellone.negozi.cta}</span></span>
            <Icon name="arrow-right" size={20} className={`ml-auto hidden sm:block ${TILE_ARROW}`} />
          </Link>
        </div>
      </Container>
      <FlyerArrival flyers={flyers} buildDate={buildDate} stores={stores} copy={copy.volantino} />
    </section>
  );
}
