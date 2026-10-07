import type { Metadata } from "next";
import { HoverLift } from "@/components/motion/HoverLift";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Badge, Sticker } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";

const ICONS: IconName[] = ["whatsapp", "instagram", "facebook", "map-pin", "clock", "phone", "mail", "arrow-right", "menu", "close", "calendar", "download", "external"];

/** Anteprima del design system (noindex), utile da mostrare al cliente. */
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

export default function DesignSystemPreview() {
  return (
    <>
      <Section tone="cream">
        <Logo className="text-4xl" />
        <h1 className="mt-6">
          Il negozio su misura per la <span className="underline-hand">tua casa</span>!
        </h1>
        <p className="mt-4 max-w-xl text-muted">Anteprima del design system: bottoni, sezioni, card, segnaposto, icone, animazioni.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/offerte/" iconRight={<Icon name="arrow-right" size={20} />}>Primary</Button>
          <Button variant="secondary" href="https://example.com">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost" size="sm">Ghost</Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Badge>Badge</Badge>
          <Sticker>Solo in negozio</Sticker>
          <Sticker tone="blue" rotate={-5}>-20%</Sticker>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-brand-blue-700">
          {ICONS.map((n) => (
            <Icon key={n} name={n} title={n} />
          ))}
        </div>
      </Section>

      <Section tone="blue" rounded>
        <SectionHeading inverted eyebrow="Sezione blu" title="Titolo su fondo blu" subtitle="Sottotitolo leggibile in AA su fondo blu." />
        <Logo variant="white" className="mt-6" />
        <Button className="mt-6" variant="primary" iconLeft={<Icon name="whatsapp" size={20} />}>Scrivici</Button>
      </Section>

      <Section tone="sand">
        <Reveal><SectionHeading eyebrow="Card" title="Reveal, Stagger e HoverLift" /></Reveal>
        <Stagger className="mt-8 grid gap-6 sm:grid-cols-3">
          {["Casa e cucina", "Animali", "Giardinaggio"].map((l) => (
            <StaggerItem key={l}>
              <HoverLift>
                <Card flush>
                  <SmartImage src={null} alt="" ratio="4/3" label={`Foto corridoio ${l}`} rounded="rounded-none" />
                  <div className="p-5 font-display text-xl">{l}</div>
                </Card>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section tone="magenta-soft">
        <SectionHeading eyebrow="Segnaposto" title="Placeholder pillola" />
        <div className="mt-8 max-w-sm">
          <Placeholder ratio="1/1" label="Foto sede Prato" rounded="rounded-full" />
        </div>
      </Section>

      <Section tone="white">
        <div className="marquee marquee-mask overflow-hidden">
          <div className="marquee-track flex gap-12 font-display text-3xl text-brand-blue-700">
            {[0, 1].map((c) => (
              <div key={c} className="flex shrink-0 gap-12" aria-hidden={c === 1}>
                {["Brand uno", "Brand due", "Brand tre", "Brand quattro", "Brand cinque"].map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
