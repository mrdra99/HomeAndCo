/**
 * Pagina Offerte (/offerte/): volantino in corso, archivio e promozioni.
 *
 * Per aggiungere un volantino basta aggiungere un elemento a content/flyers.json
 * e caricare i file in public/uploads/flyers/ (copertina, pagine, PDF).
 *
 * La pagina e' statica: il volantino "valido ora" e' scelto in build, ma FlyersBoard (client)
 * lo ricontrolla con la data reale e sposta in archivio quelli nel frattempo scaduti.
 */
import type { Metadata } from "next";
import { FlyersBoard } from "@/components/flyers/FlyersBoard";
import { PromotionsGrid } from "@/components/flyers/PromotionsGrid";
import { Container } from "@/components/ui/Container";
import { content } from "@/lib/content";
import { toIsoDate } from "@/lib/campaigns";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Offerte e volantino",
  description:
    "Consulta i volantini Home & Co. con le date e i negozi aderenti. Scarica i PDF originali e ritrova le edizioni precedenti.",
  path: "/offerte/",
});

export default async function OffertePage() {
  const [flyers, promotions, stores, settings] = await Promise.all([
    content.getFlyers(),
    content.getPromotions(),
    content.getStores(),
    content.getSettings(),
  ]);
  const today = toIsoDate();
  const whatsappHref = settings.whatsapp.numero
    ? `https://wa.me/${settings.whatsapp.numero}?text=${encodeURIComponent(settings.whatsapp.messaggioPredefinito)}`
    : null;

  return (
    <>
      <section className="pb-6 pt-10 sm:pt-16">
        <Container>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-brand-magenta-700">Offerte</p>
          <h1 className="max-w-4xl text-brand-blue-900">
            Le offerte, nero su bianco.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">
            Prima di passare in negozio, dai un’occhiata ai volantini. Controlla le date e i punti vendita indicati in ogni edizione.
          </p>
        </Container>
      </section>

      <FlyersBoard
        flyers={flyers}
        buildDate={today}
        storeNames={Object.fromEntries(stores.map((s) => [s.id, s.citta]))}
        social={settings.social}
        whatsappHref={whatsappHref}
      />

      <PromotionsGrid
        tone="blue"
        buildDate={today}
        eyebrow="Promozioni"
        title="Le promozioni del momento"
        subtitle="Controlla le date e i negozi aderenti a ogni iniziativa."
        inverted
        promotions={promotions}
      />
    </>
  );
}
