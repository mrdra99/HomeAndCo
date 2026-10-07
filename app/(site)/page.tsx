import type { Metadata } from "next";
import { CampaignHero } from "@/components/campaign/CampaignHero";
import { AisleGrid } from "@/components/sections/AisleGrid";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { FlyerTeaser } from "@/components/sections/FlyerTeaser";
import { LoyaltyBlock } from "@/components/sections/LoyaltyBlock";
import { StoresSection } from "@/components/sections/StoresSection";
import { content, getActiveCampaign, getCurrentFlyers } from "@/lib/content";
import { isDefaultCampaign } from "@/lib/campaigns";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, campaigns] = await Promise.all([content.getSettings(), content.getCampaigns()]);
  const base = campaigns.find(isDefaultCampaign);
  const title = `${settings.nomeSito} | ${settings.claim}`;
  const description = [settings.claim, base?.sottotitolo].filter(Boolean).join(" ");
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
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function HomePage() {
  const [campaigns, active, aisles, loyalty, flyers, brands, stores, settings] = await Promise.all([
    content.getCampaigns(),
    getActiveCampaign(),
    content.getAisles(),
    content.getLoyalty(),
    getCurrentFlyers(),
    content.getBrands(),
    content.getStores(),
    content.getSettings(),
  ]);
  const visibleAisles = aisles.filter((a) => a.visibile).sort((a, b) => a.ordine - b.ordine);

  return (
    <>
      <CampaignHero campaigns={campaigns} buildCampaignId={active.id} />
      <AisleGrid aisles={visibleAisles} campaigns={campaigns} buildCampaignId={active.id} />
      <LoyaltyBlock loyalty={loyalty} />
      <FlyerTeaser flyer={flyers[0]} social={settings.social} />
      <BrandMarquee brands={brands} />
      <StoresSection stores={stores} />
    </>
  );
}
