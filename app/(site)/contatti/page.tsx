import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { content } from "@/lib/content";
import { formatAddress } from "@/lib/stores";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contatti",
  description:
    "Scrivi a Home & Co.: informazioni, volantino e offerte, carta fedeltà. Trovi anche indirizzi dei tre negozi di Prato, Lucca e Sesto Fiorentino.",
  path: "/contatti/",
});

export default async function ContattiPage() {
  const [settings, stores] = await Promise.all([content.getSettings(), content.getStores()]);
  const wa = settings.whatsapp.numero
    ? `https://wa.me/${settings.whatsapp.numero}?text=${encodeURIComponent(settings.whatsapp.messaggioPredefinito)}`
    : null;

  return (
    <main id="contenuto">
      <Section tone="cream">
        <SectionHeading
          as="h1"
          eyebrow="Contatti"
          title="Scrivici, ti rispondiamo volentieri"
          subtitle="Una domanda su un prodotto, sul volantino o sulla carta fedeltà? Compila il modulo o passa a trovarci in negozio."
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Card>
              <ContactForm />
            </Card>
          </Reveal>
          <div className="space-y-6">
            <Reveal delay={0.06}>
              <Card tone="sand">
                <h2 className="text-xl text-brand-blue-900">Contatti diretti</h2>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a href={`mailto:${settings.societa.email}`} className="inline-flex items-center gap-3 font-semibold text-brand-blue-700 underline-offset-4 hover:underline">
                      <Icon name="mail" /> {settings.societa.email}
                    </a>
                  </li>
                  {wa && (
                    <li>
                      <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-semibold text-brand-blue-700 underline-offset-4 hover:underline">
                        <Icon name="whatsapp" /> Scrivici su WhatsApp
                      </a>
                    </li>
                  )}
                  <li>
                    <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-semibold text-brand-blue-700 underline-offset-4 hover:underline">
                      <Icon name="instagram" /> Instagram
                    </a>
                  </li>
                  <li>
                    <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-semibold text-brand-blue-700 underline-offset-4 hover:underline">
                      <Icon name="facebook" /> Facebook
                    </a>
                  </li>
                </ul>
              </Card>
            </Reveal>
            <Reveal delay={0.12}>
              <Card>
                <h2 className="text-xl text-brand-blue-900">I nostri negozi</h2>
                <ul className="mt-4 space-y-4">
                  {stores.map((s) => (
                    <li key={s.id} className="flex items-start gap-3">
                      <Icon name="map-pin" className="mt-1 shrink-0 text-brand-magenta-700" />
                      <div>
                        <p className="font-semibold">{s.citta}</p>
                        <p className="text-sm text-muted">{formatAddress(s)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button href="/dove-siamo/" variant="secondary" size="sm" className="mt-5">
                  Orari e mappe
                </Button>
              </Card>
            </Reveal>
          </div>
        </div>
        <p className="mt-10 text-sm text-muted">
          Trattiamo i tuoi dati come descritto nell&apos;
          <Link href="/privacy-policy/" className="underline underline-offset-4">informativa privacy</Link>.
        </p>
      </Section>
    </main>
  );
}
