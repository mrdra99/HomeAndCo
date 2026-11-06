/**
 * Pagina Volantino e offerte (/offerte/): volantino in corso (o avviso se non ce n'e'), archivio e promozioni.
 *
 * Per aggiungere un volantino basta aggiungere un elemento a content/flyers.json
 * e caricare i file in public/uploads/flyers/ (copertina, pagine, PDF).
 *
 * La pagina e' statica: il volantino "valido ora" e' scelto in build, ma FlyersBoard (client)
 * lo ricontrolla con la data reale e sposta in archivio quelli nel frattempo scaduti.
 */
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { FlyersBoard } from "@/components/flyers/FlyersBoard";
import { PromotionsGrid } from "@/components/flyers/PromotionsGrid";
import { content } from "@/lib/content";
import { toIsoDate } from "@/lib/campaigns";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Volantino e offerte",
  description:
    "Il volantino Home & Co. con le date e i negozi in cui vale, i volantini scaduti e i PDF da scaricare.",
  path: "/offerte/",
});

export default async function OffertePage() {
  const [flyers, promotions, stores, settings, pages] = await Promise.all([
    content.getFlyers(),
    content.getPromotions(),
    content.getStores(),
    content.getSettings(),
    content.getPagesCopy(),
  ]);
  const copy = pages.offerte;
  const today = toIsoDate();
  const whatsappHref = settings.whatsapp.numero
    ? `https://wa.me/${settings.whatsapp.numero}?text=${encodeURIComponent(settings.whatsapp.messaggioPredefinito)}`
    : null;

  return (
    <>
      <PageHeader
        breadcrumbLabel={pages.breadcrumb.aria}
        breadcrumb={[
          { label: pages.breadcrumb.home, href: "/" },
          { label: copy.titolo, href: "/offerte/" },
        ]}
        title={copy.titolo}
        lead={copy.intro}
      />

      <FlyersBoard
        flyers={flyers}
        buildDate={today}
        storeNames={Object.fromEntries(stores.map((s) => [s.id, s.citta]))}
        social={settings.social}
        whatsappHref={whatsappHref}
        copy={copy}
      />

      <PromotionsGrid buildDate={today} title={copy.promozioni.titolo} subtitle={copy.promozioni.sottotitolo} promotions={promotions} />
    </>
  );
}
