"use client";

import Link from "next/link";
import { CampaignHero } from "@/components/campaign/CampaignHero";
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
          : <CampaignHero campaigns={campaigns} buildCampaignId={buildCampaignId} buildDate={buildDate} className="lg:hidden" />}
        <div className={`mt-3 grid grid-cols-2 gap-3 lg:gap-5 ${leadFlyer ? "lg:mt-5" : "lg:mt-0"}`}>
          {leadFlyer ? <CampaignTile campaigns={campaigns} buildCampaignId={buildCampaignId} /> : (
            <Link href="/offerte/" className="group/tile flex min-h-20 items-center gap-3 rounded-lg border border-brand-magenta-100 bg-brand-magenta-50 p-3 text-brand-magenta-700 sm:px-5 lg:min-h-36 lg:gap-6 lg:rounded-[var(--radius-xl)] lg:px-8 lg:transition-colors lg:hover:border-brand-magenta-600">
              {found ? <span className="block w-10 shrink-0 rotate-[-5deg] lg:w-20 lg:transition-transform lg:duration-300 lg:group-hover/tile:rotate-[-9deg]"><SmartImage src={found.flyer.copertina.src} alt={found.flyer.copertina.alt} label={found.flyer.titolo} ratio="210/297" sizes="(min-width: 1024px) 80px, 40px" /></span> : <Icon name="flyer" size={30} className="shrink-0 lg:size-14" />}
              <span><strong className="block text-base sm:text-lg lg:text-[1.75rem] lg:font-black lg:leading-tight">{copy.volantino.titolo}</strong><span className="block text-xs sm:text-sm lg:mt-1 lg:text-base">{found ? copy.volantino.statoUltimo : copy.volantino.vuoto.ctaFascia}</span></span>
              <Icon name="arrow-right" size={20} className="ml-auto hidden sm:block lg:size-7 lg:transition-transform lg:group-hover/tile:translate-x-1" />
            </Link>
          )}
          <Link href="/dove-siamo/" className="group/tile flex min-h-20 items-center gap-3 rounded-lg border border-brand-blue-100 bg-brand-blue-50 p-3 text-brand-blue-900 sm:px-5 lg:min-h-36 lg:gap-6 lg:rounded-[var(--radius-xl)] lg:px-8 lg:transition-colors lg:hover:border-brand-blue-600">
            <Icon name="map-pin" size={30} className="shrink-0 lg:size-14" />
            <span><strong className="block text-base sm:text-lg lg:text-[1.75rem] lg:font-black lg:leading-tight">{copy.tabellone.negozi.titolo}</strong><span className="block text-xs sm:text-sm lg:mt-1 lg:text-base">{copy.tabellone.negozi.cta}</span></span>
            <Icon name="arrow-right" size={20} className="ml-auto hidden sm:block lg:size-7 lg:transition-transform lg:group-hover/tile:translate-x-1" />
          </Link>
        </div>
      </Container>
      <FlyerArrival flyers={flyers} buildDate={buildDate} stores={stores} copy={copy.volantino} />
    </section>
  );
}
