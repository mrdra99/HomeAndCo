import type { Metadata } from "next";
import { CampaignCalendar } from "@/components/campaign/CampaignCalendar";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoyaltyCard } from "@/components/loyalty/LoyaltyCard";
import { HoverLift } from "@/components/motion/HoverLift";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { StoreMapFallback } from "@/components/stores/StoreMap";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Notice } from "@/components/ui/Notice";
import { Placeholder } from "@/components/ui/Placeholder";
import { Section } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import { content } from "@/lib/content";
import { toIsoDate } from "@/lib/campaigns";

const ICONS: IconName[] = ["whatsapp", "instagram", "facebook", "map-pin", "clock", "phone", "mail", "arrow-right", "menu", "close", "calendar", "download", "external", "info", "check"];

/** Anteprima del design system (noindex): palette del logo, primitive dell'insegna, pagine interne. */
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const SWATCHES = [
  { name: "Blu 600 · orientamento", cls: "bg-brand-blue-600 text-white" },
  { name: "Blu 900 · testo forte", cls: "bg-brand-blue-900 text-white" },
  { name: "Magenta 600 · commerciale", cls: "bg-brand-magenta-600 text-white" },
  { name: "Magenta 700 · testo piccolo", cls: "bg-brand-magenta-700 text-white" },
  { name: "Sand · fasce", cls: "bg-sand text-brand-blue-900" },
  { name: "Blu 50 · avvisi", cls: "bg-brand-blue-50 text-brand-blue-900" },
];

export default async function DesignSystemPreview() {
  const campaigns = await content.getCampaigns();
  return (
    <>
      <PageHeader
        breadcrumbLabel="Percorso di navigazione"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Design system", href: "/design-system/" },
        ]}
        title="Design system"
        lead="Palette del logo, primitive dell'insegna e componenti delle pagine interne."
      />

      <Section tone="white" containerSize="wide">
        <SectionTitle note="Solo i colori del logo. Le campagne stagionali non li cambiano.">Palette</SectionTitle>
        <ul className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {SWATCHES.map((s) => (
            <li key={s.name} className={`rounded-[var(--radius-md)] border border-brand-blue-100 p-3 text-sm font-bold ${s.cls}`}>
              {s.name}
            </li>
          ))}
        </ul>
        <Logo className="mt-6 w-56" />
      </Section>

      <Section tone="sand" containerSize="wide">
        <SectionTitle>Pulsanti, etichette, avvisi</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <Button href="/offerte/" iconRight={<Icon name="arrow-right" size={20} />}>Primario · commerciale</Button>
          <Button variant="secondary" href="/dove-siamo/">Secondario · orientamento</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost" size="sm">Ghost</Button>
        </div>
        <div className="on-dark mt-4 flex flex-wrap gap-3 rounded-[var(--radius-xl)] bg-brand-blue-600 p-4">
          <Button variant="light">Su fondo pieno</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10">Outline su fondo pieno</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge>Badge magenta</Badge>
          <Badge tone="blue">Badge blu</Badge>
          <Badge tone="sand">Badge sand</Badge>
        </div>
        <Notice title="Avviso informativo" className="mt-4 max-w-2xl">
          Per condizioni in aggiornamento e note di pagina. Non è un’etichetta di sviluppo.
        </Notice>
        <div className="mt-4 flex flex-wrap gap-4 text-brand-blue-700">
          {ICONS.map((n) => (
            <Icon key={n} name={n} title={n} />
          ))}
        </div>
      </Section>

      <Section tone="white" containerSize="wide">
        <SectionTitle note="Riquadro di ripiego della mappa e tessera piatta della carta.">Schede</SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] border-2 border-brand-blue-100">
            <StoreMapFallback store={{ citta: "Prato", indirizzo: { via: "Viale G. Marconi 38", cap: "59100", citta: "Prato", provincia: "PO" } }} href="/dove-siamo/#prato" cta="Mappa e indicazioni" />
          </div>
          <LoyaltyCard nome="Carta Fedeltà Home & Co." />
          <HoverLift>
            <Card flush className="border-2 border-brand-blue-100 ring-0">
              <SmartImage src={null} alt="" ratio="4/3" label="Foto reparto" rounded="rounded-none" />
              <div className="p-3 font-display text-lg font-extrabold">Scheda con foto</div>
            </Card>
          </HoverLift>
        </div>
        <div className="mt-4 max-w-xs">
          <Placeholder ratio="1/1" label="Foto sede" rounded="rounded-lg" />
        </div>
      </Section>

      <Section tone="sand" id="calendario-campagne" containerSize="wide">
        <SectionTitle note="Scegli una data per controllare Halloween, Natale e il ritorno alla vetrina abituale. Le date di fine sono incluse.">Anteprima delle campagne</SectionTitle>
        <CampaignCalendar campaigns={campaigns} buildDate={toIsoDate()} />
      </Section>
    </>
  );
}
