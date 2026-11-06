import { CampaignHero } from "@/components/campaign/CampaignHero";
import { Container } from "@/components/ui/Container";
import type { Campaign, Flyer, HeaderCopy, HomeCopy, Store } from "@/lib/content/schemas";
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
 * Tabellone: un blocco grande (campagna attiva) e due riquadri (volantino, negozi).
 * Nessun carosello. Impilato su mobile, 2/3 + 1/3 da 1024 px.
 */
export function PromoBoard({ campaigns, buildCampaignId, buildDate, flyers, stores, copy, statusCopy }: Props) {
  return (
    <section aria-label={copy.tabellone.aria} className="bg-white pb-5 pt-3 sm:pt-5 lg:pb-7">
      <Container size="wide">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:gap-4">
          <CampaignHero
            campaigns={campaigns}
            buildCampaignId={buildCampaignId}
            buildDate={buildDate}
            className="lg:row-span-2"
          />
          <FlyerTile flyers={flyers} stores={stores} buildDate={buildDate} copy={copy.volantino} />
          <StoresTile stores={stores} copy={copy.tabellone.negozi} statusCopy={statusCopy} />
        </div>
      </Container>
    </section>
  );
}
