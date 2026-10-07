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
import { Section } from "@/components/ui/Section";
import { content } from "@/lib/content";
import { toIsoDate } from "@/lib/campaigns";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Offerte e volantino",
  description:
    "Sfoglia il volantino di Home & Co., scarica il PDF e scopri le promozioni valide nei negozi di Prato, Lucca e Sesto Fiorentino.",
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
  const activePromos = promotions.filter(
    (p) => (!p.validoAl || p.validoAl >= today) && (!p.validoDal || p.validoDal <= today),
  );
  const whatsappHref = settings.whatsapp.numero
    ? `https://wa.me/${settings.whatsapp.numero}?text=${encodeURIComponent(settings.whatsapp.messaggioPredefinito)}`
    : null;

  return (
    <main id="contenuto">
      <section className="pb-6 pt-10 sm:pt-16">
        <Container>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-brand-magenta-700">Offerte</p>
          <h1 className="max-w-4xl text-brand-blue-900">
            Il volantino, <span className="underline-hand">sempre in tasca</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">
            Prezzi giusti, idee nuove e promozioni da non perdere: sfoglia qui le offerte del momento e passa a trovarci.
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

      {activePromos.length > 0 && (
        <Section tone="blue" rounded className="mx-3 sm:mx-6">
          <PromotionsGrid
            eyebrow="Promozioni"
            title="Le promozioni del momento"
            subtitle="Occasioni a tempo e proposte speciali: guarda cosa abbiamo preparato per te."
            inverted
            promotions={activePromos}
          />
        </Section>
      )}
    </main>
  );
}
