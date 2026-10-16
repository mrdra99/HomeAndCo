import type { Metadata } from "next";
import { LoyaltyCardMockup } from "@/components/loyalty/LoyaltyCardMockup";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Icon, isIconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { content } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";


export async function generateMetadata(): Promise<Metadata> {
  const loyalty = await content.getLoyalty();
  return buildMetadata({
    title: `${loyalty.nome}: sconti e vantaggi`,
    description: loyalty.intro,
    path: "/carta-fedelta/",
  });
}

export default async function CartaFedeltaPage() {
  const [loyalty, settings] = await Promise.all([content.getLoyalty(), content.getSettings()]);
  const steps = loyalty.comeRichiederla
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  const showDraft = loyalty.provvisorio && process.env.NODE_ENV === "development";

  return (
    <>
      {showDraft && (
        <div className="bg-amber-100 px-5 py-2 text-center text-sm font-semibold text-amber-900">
          Contenuti provvisori: testi della carta fedeltà da confermare con il cliente (visibile solo in sviluppo).
        </div>
      )}

      <section className="relative overflow-hidden bg-cream pb-14 pt-10 sm:pb-20 sm:pt-16">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-accent opacity-[0.08]" />
        <Container size="wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading as="h1" eyebrow="Carta fedeltà" title={loyalty.nome} subtitle={loyalty.intro} />
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#come-richiederla" size="lg" iconRight={<Icon name="arrow-right" size={20} />}>
                  Come richiederla
                </Button>
                <Button href="/dove-siamo/" size="lg" variant="outline">
                  Trova il negozio
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <LoyaltyCardMockup nome={loyalty.nome} className="max-w-md lg:max-w-lg" />
            </Reveal>
          </div>
        </Container>
      </section>

      <Section tone="sand" containerSize="wide">
        <Reveal>
          <SectionHeading eyebrow="Perché averla" title="I vantaggi per te" />
        </Reveal>
        <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
          {loyalty.vantaggi.map((v) => (
            <StaggerItem key={v.titolo} className="h-full">
              <Card className="h-full">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-magenta-50 text-brand-magenta-700">
                  <Icon name={isIconName(v.icona) ? v.icona : "check"} size={28} />
                </span>
                <h3 className="mt-5 text-brand-blue-900">{v.titolo}</h3>
                <p className="mt-2 text-muted">{v.testo}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="cream" id="come-richiederla" containerSize="narrow">
        <SectionHeading eyebrow="Facile e gratuita" title="Come richiederla" />
        <ol className="mt-8 space-y-4">
          {steps.map((s, i) => (
            <li key={s} className="flex items-start gap-4 rounded-lg bg-white p-5 shadow-soft">
              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-blue-700 font-display text-lg text-white"
              >
                {i + 1}
              </span>
              <p className="pt-1.5 text-lg">{s}</p>
            </li>
          ))}
        </ol>
      </Section>

      {loyalty.faq.length > 0 && (
        <Section tone="white" containerSize="narrow">
          <SectionHeading eyebrow="Domande frequenti" title="Hai un dubbio?" />
          <Accordion
            className="mt-8 !shadow-none ring-1 ring-brand-blue-100"
            items={loyalty.faq.map((f) => ({ domanda: f.d, risposta: f.r }))}
          />
        </Section>
      )}

      <Section tone="blue" rounded className="mx-3 mb-8 sm:mx-6" containerSize="narrow">
        <div className="text-center">
          <SectionHeading
            inverted
            align="center"
            title="Chiedila oggi nel tuo negozio"
            subtitle="Il personale ti spiega come richiederla e quali iniziative sono attive."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/dove-siamo/" size="lg" iconRight={<Icon name="arrow-right" size={20} />}>
              Trova il negozio
            </Button>
            <WhatsAppButton
              numero={settings.whatsapp.numero}
              messaggio="Ciao Home & Co.! Vorrei informazioni sulla carta fedeltà."
              label="Scrivici su WhatsApp"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
