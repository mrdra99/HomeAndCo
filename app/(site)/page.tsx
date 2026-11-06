import type { Metadata } from "next";
import { CampaignCollection } from "@/components/campaign/CampaignCollection";
import { DepartmentCards } from "@/components/sections/DepartmentCards";
import { FactsStrip } from "@/components/sections/FactsStrip";
import { FlyerBand } from "@/components/sections/FlyerBand";
import { LoyaltyBlock } from "@/components/sections/LoyaltyBlock";
import { isLoyaltyFilled } from "@/lib/loyalty";
import { PromoBoard } from "@/components/sections/PromoBoard";
import { StoreVideos } from "@/components/sections/StoreVideos";
import { StoresSection } from "@/components/sections/StoresSection";
import { Container } from "@/components/ui/Container";
import { content, getActiveCampaign } from "@/lib/content";
import { toIsoDate } from "@/lib/campaigns";
import { groupDepartments } from "@/lib/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, home] = await Promise.all([content.getSettings(), content.getHomeCopy()]);
  const title = `${settings.nomeSito} | ${settings.claim}`;
  const description = home.seo.descrizione;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: settings.nomeSito,
      locale: "it_IT",
      type: "website",
      images: [{ url: "/brand/social.png", width: 1200, height: 630, alt: settings.nomeSito }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/brand/social.png"] },
  };
}

export default async function HomePage() {
  const [campaigns, active, aisles, flyers, stores, copy, settings, loyalty, navigation] = await Promise.all([
    content.getCampaigns(),
    getActiveCampaign(),
    content.getAisles(),
    content.getFlyers(),
    content.getStores(),
    content.getHomeCopy(),
    content.getSettings(),
    content.getLoyalty(),
    content.getNavigation(),
  ]);
  const visibleAisles = aisles.filter((a) => a.visibile).sort((a, b) => a.ordine - b.ordine);
  const buildDate = toIsoDate();
  const statusCopy = settings.testata.negozio;
  const loyaltyShown = isLoyaltyFilled(loyalty);

  return (
    <>
      <PromoBoard
        campaigns={campaigns}
        buildCampaignId={active.id}
        buildDate={buildDate}
        flyers={flyers}
        stores={stores}
        copy={copy}
        statusCopy={statusCopy}
      />
      <FactsStrip facts={copy.fatti} label={copy.fattiAria} />
      <DepartmentCards groups={groupDepartments(navigation.voci, navigation.gruppi)} copy={copy.reparti} />
      <CampaignCollection campaigns={campaigns} buildCampaignId={active.id} copy={copy.idee} aisles={visibleAisles} />
      <FlyerBand flyers={flyers} buildDate={buildDate} copy={copy.volantino} />
      <StoresSection stores={stores} copy={copy.negozi} statusCopy={statusCopy} neutralPrefix={copy.tabellone.negozi.apertoNeutro} />
      <div className="bg-sand py-7 sm:py-10">
        <Container size="wide">
          {loyaltyShown ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-8">
              <LoyaltyBlock copy={copy.carta} loyalty={loyalty} />
              <StoreVideos copy={copy.social} instagramUrl={settings.social.instagram} layout="column" />
            </div>
          ) : (
            <StoreVideos copy={copy.social} instagramUrl={settings.social.instagram} layout="full" />
          )}
        </Container>
      </div>
    </>
  );
}
