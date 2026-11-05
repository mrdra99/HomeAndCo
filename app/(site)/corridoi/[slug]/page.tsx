/**
 * Template del corridoio: /corridoi/<slug>/ (export statico: generateStaticParams + dynamicParams = false).
 *
 * Futuro shop: questa pagina diventera' /shop/<categoria>/ SENZA spostare nulla. Il legame e'
 *   Category.slug (lib/api/types.ts)  <->  Aisle.categoryId (content/aisles.json).
 * Basta creare app/(shop)/shop/[categoria]/page.tsx che riusa AisleHero, FeaturedIdeas (mappando i
 * Product su IdeaItem) e gli altri blocchi di components/aisles/, e far puntare i link dei corridoi
 * a /shop/<categoria>/ quando categoryId e' valorizzato. I contenuti editoriali restano qui.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AisleHero } from "@/components/aisles/AisleHero";
import { AisleCampaignBanner } from "@/components/aisles/AisleCampaignBanner";
import { AisleShelves } from "@/components/aisles/AisleShelves";
import { AisleStoresCta } from "@/components/aisles/AisleStoresCta";
import { CampaignFeaturedIdeas } from "@/components/aisles/CampaignFeaturedIdeas";
import { OtherAisles } from "@/components/aisles/OtherAisles";
import { PromotionsGrid } from "@/components/flyers/PromotionsGrid";
import { Container } from "@/components/ui/Container";
import { content, getActiveCampaign, getAisle, getAisleSlugs } from "@/lib/content";
import { toIsoDate } from "@/lib/campaigns";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getAisleSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const aisle = await getAisle(slug);
  if (!aisle) return {};
  return buildMetadata({
    title: aisle.seo.title,
    description: aisle.seo.description,
    path: `/corridoi/${aisle.slug}/`,
    image: aisle.immagine.src ?? undefined,
  });
}

export default async function AislePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const aisle = await getAisle(slug);
  if (!aisle) notFound();

  const [campaigns, activeCampaign, allAisles, promotions, stores] = await Promise.all([
    content.getCampaigns(),
    getActiveCampaign(),
    content.getAisles(),
    content.getPromotions(),
    content.getStores(),
  ]);

  const today = toIsoDate();
  const linkedPromos = promotions.filter(
    (p) => p.corridoio === aisle.slug,
  );
  const others = allAisles
    .filter((a) => a.visibile && a.slug !== aisle.slug)
    .sort((a, b) => a.ordine - b.ordine)
    .map((a) => ({ slug: a.slug, titolo: a.titoloBreve, icona: a.icona }));

  return (
    <>
      <AisleHero
        titolo={aisle.titolo}
        descrizione={aisle.descrizione}
        immagine={aisle.immagine}
        dettaglio={aisle.scaffali[0]?.immagine}
        icona={aisle.icona}
        colore={aisle.colore}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Reparti", href: "/#corridoi" },
          { label: aisle.titolo, href: `/corridoi/${aisle.slug}/` },
        ]}
      />

      <Container className="space-y-16 pb-16 sm:space-y-24 sm:pb-24">
        <AisleCampaignBanner campaigns={campaigns} buildCampaignId={activeCampaign.id} slug={aisle.slug} />

        <p className="max-w-3xl text-lg text-ink sm:text-xl">{aisle.descrizioneLunga}</p>
      </Container>

      <AisleShelves scaffali={aisle.scaffali} titolo={aisle.scaffaliTitolo} intro={aisle.scaffaliIntro} />

      <CampaignFeaturedIdeas items={aisle.inEvidenza} campaigns={campaigns} buildCampaignId={activeCampaign.id} />

      {linkedPromos.length > 0 && (
        <PromotionsGrid
          buildDate={today}
          eyebrow="Promozioni"
          title={`Promozioni per ${aisle.titoloBreve.toLowerCase()}`}
          promotions={linkedPromos}
        />
      )}

      <AisleStoresCta corridoio={aisle.titoloBreve} citta={stores.map((s) => s.citta)} />
      <OtherAisles aisles={others} />
    </>
  );
}
