import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { StoreDetail } from "@/components/stores/StoreDetail";
import { StoreSelector } from "@/components/stores/StoreSelector";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Dove siamo: i negozi Home & Co. di Prato, Lucca e Sesto Fiorentino",
  description:
    "Indirizzi, orari e indicazioni dei tre negozi Home & Co. in Toscana: Prato, Lucca e Sesto Fiorentino.",
  path: "/dove-siamo/",
});

export default async function DoveSiamoPage() {
  const [stores, settings] = await Promise.all([content.getStores(), content.getSettings()]);
  return (
    <>
      <section className="relative overflow-hidden bg-cream pb-6 pt-10 sm:pt-16">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-accent opacity-[0.08]" />
        <Container size="wide">
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Dove siamo"
              title={
                <>
                  I negozi Home &amp; Co.
                </>
              }
              subtitle="Prato, Lucca e Sesto Fiorentino. Scegli il punto vendita e trovi l’indirizzo e le indicazioni per raggiungerlo."
            />
          </Reveal>
          <div className="mt-8">
            <StoreSelector stores={stores.map((s) => ({ id: s.id, citta: s.citta }))} />
          </div>
        </Container>
      </section>

      <section className="bg-cream pb-20 pt-6 sm:pb-28">
        <Container size="wide">
          <Stagger className="space-y-8">
            {stores.map((s) => (
              <StaggerItem key={s.id}>
                <StoreDetail
                  store={s}
                  whatsapp={{ numero: settings.whatsapp.numero, messaggio: settings.whatsapp.messaggioPredefinito }}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
