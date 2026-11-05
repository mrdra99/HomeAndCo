import type { Metadata } from "next";
import { StoreVideos } from "@/components/sections/StoreVideos";
import { CampaignHero } from "@/components/campaign/CampaignHero";
import { CampaignCollection } from "@/components/campaign/CampaignCollection";
import { AisleGrid } from "@/components/sections/AisleGrid";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { FlyerTeaser } from "@/components/sections/FlyerTeaser";
import { LoyaltyBlock } from "@/components/sections/LoyaltyBlock";
import { StoresSection } from "@/components/sections/StoresSection";
import { content, getActiveCampaign } from "@/lib/content";
import { isDefaultCampaign, toIsoDate } from "@/lib/campaigns";

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
      images: [{ url: "/brand/social.png", width: 1200, height: 630, alt: settings.nomeSito }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/brand/social.png"] },
  };
}

export default async function HomePage() {
  const [campaigns, active, aisles, loyalty, flyers, brands, stores, copy] = await Promise.all([
    content.getCampaigns(),
    getActiveCampaign(),
    content.getAisles(),
    content.getLoyalty(),
    content.getFlyers(),
    content.getBrands(),
    content.getStores(),
    content.getHomeCopy(),
  ]);
  const visibleAisles = aisles.filter((a) => a.visibile).sort((a, b) => a.ordine - b.ordine);

  return (
    <>
      <CampaignHero campaigns={campaigns} buildCampaignId={active.id} buildDate={toIsoDate()} stores={stores} />
      <CampaignCollection campaigns={campaigns} buildCampaignId={active.id} />
      <AisleGrid aisles={visibleAisles} campaigns={campaigns} buildCampaignId={active.id} copy={copy.reparti} />
      <StoreVideos copy={copy.social} />
      <LoyaltyBlock loyalty={loyalty} />
      <FlyerTeaser flyers={flyers} buildDate={toIsoDate()} copy={copy.volantini} />
      <BrandMarquee brands={brands} />
      <StoresSection stores={stores} copy={copy.negozi} />
    </>
  );
}
