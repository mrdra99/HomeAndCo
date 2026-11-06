"use client";

import { CampaignHero } from "@/components/campaign/CampaignHero";
import { Container } from "@/components/ui/Container";
import type { Campaign, Flyer, HeaderCopy, HomeCopy, Store } from "@/lib/content/schemas";
import { useToday } from "@/lib/date-store";
import { homeFlyer } from "@/lib/flyers";
import { CampaignTile } from "./CampaignTile";
import { FlyerHero } from "./FlyerHero";
import { FlyerTile } from "./FlyerTile";
import { StoresTile } from "./StoresTile";

type Props = {
  campaigns: Campaign[];
  buildCampaignId: string;
  buildDate: string;
  flyers: Flyer[];
  stores: Store[];
  copy: HomeCopy;
  statusCopy: HeaderCopy["negozio"];
};

/**
 * Tabellone: un blocco grande e due riquadri. Nessun carosello. Impilato su mobile, 2/3 + 1/3 da 1024 px.
 * - Con un volantino in corso o in arrivo (homeFlyer): blocco grande = volantino, riquadro in alto = campagna compatta.
 * - Senza: blocco grande = campagna, riquadro in alto = «Volantino» neutro (comportamento invariato).
 * Server e primo render del client usano la data di build (stesso HTML, nessun mismatch); dopo l'idratazione
 * useToday ricontrolla la data reale, come per la campagna.
 */
export function PromoBoard({ campaigns, buildCampaignId, buildDate, flyers, stores, copy, statusCopy }: Props) {
  const today = useToday(buildDate);
  const found = homeFlyer(flyers, today);
  const big = "lg:row-span-2";
  return (
    <section aria-label={copy.tabellone.aria} className="bg-white pb-5 pt-3 sm:pt-5 lg:pb-7">
      <Container size="wide">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:gap-4">
          {found ? (
            <>
              <FlyerHero flyer={found.flyer} status={found.status} stores={stores} copy={copy.volantino} className={big} />
              <CampaignTile campaigns={campaigns} buildCampaignId={buildCampaignId} />
            </>
          ) : (
            <>
              <CampaignHero campaigns={campaigns} buildCampaignId={buildCampaignId} buildDate={buildDate} className={big} />
              <FlyerTile copy={copy.volantino} />
            </>
          )}
          <StoresTile stores={stores} copy={copy.tabellone.negozi} statusCopy={statusCopy} />
        </div>
      </Container>
    </section>
  );
}
