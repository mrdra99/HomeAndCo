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
import { AisleNav } from "@/components/aisles/AisleNav";
import { PromotionsGrid } from "@/components/flyers/PromotionsGrid";
import { Button } from "@/components/ui/Button";
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

  const [campaigns, activeCampaign, allAisles, promotions, stores, navigation, pages] = await Promise.all([
    content.getCampaigns(),
    getActiveCampaign(),
    content.getAisles(),
    content.getPromotions(),
    content.getStores(),
    content.getNavigation(),
    content.getPagesCopy(),
  ]);

  const copy = pages.corridoi;
  const today = toIsoDate();
  const linkedPromos = promotions.filter((p) => p.corridoio === aisle.slug);
  const breve = new Map(navigation.voci.map((n) => [n.href.split("/")[2], n.breve ?? n.label]));
  const switcher = allAisles
    .filter((a) => a.visibile)
    .sort((a, b) => a.ordine - b.ordine)
    .map((a) => ({ slug: a.slug, label: breve.get(a.slug) ?? a.titoloBreve }));

  return (
    <>
      <AisleHero
        titolo={aisle.titolo}
        descrizione={aisle.descrizione}
        immagine={aisle.immagine}
        breadcrumbLabel={pages.breadcrumb.aria}
        breadcrumb={[
          { label: pages.breadcrumb.home, href: "/" },
          { label: pages.breadcrumb.reparti, href: "/#corridoi" },
          { label: aisle.titolo, href: `/corridoi/${aisle.slug}/` },
        ]}
        actions={
          <>
            {aisle.scaffali.length > 0 && <Button href="#scaffali" variant="secondary">{copy.scaffali}</Button>}
            <Button href="/dove-siamo/" variant="outline">{copy.negozi}</Button>
          </>
        }
      />
      <AisleNav items={switcher} current={aisle.slug} label={copy.tuttiIReparti} />

      <section className="bg-white py-6 sm:py-8">
        <Container size="wide" className="space-y-5">
          <AisleCampaignBanner campaigns={campaigns} buildCampaignId={activeCampaign.id} slug={aisle.slug} />
          <p className="max-w-3xl text-base text-ink sm:text-lg">{aisle.descrizioneLunga}</p>
        </Container>
      </section>

      <AisleShelves scaffali={aisle.scaffali} titolo={aisle.scaffaliTitolo} intro={aisle.scaffaliIntro} />

      <CampaignFeaturedIdeas items={aisle.inEvidenza} campaigns={campaigns} buildCampaignId={activeCampaign.id} copy={copy.idee} />

      {linkedPromos.length > 0 && (
        <PromotionsGrid
          buildDate={today}
          title={copy.promozioni.replace("{reparto}", aisle.titoloBreve.toLowerCase())}
          promotions={linkedPromos}
        />
      )}

      <AisleStoresCta citta={stores.map((s) => s.citta)} reparto={aisle.titoloBreve} copy={copy.chiusura} />
    </>
  );
}
