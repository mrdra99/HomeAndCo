import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { getContactAdapter } from "@/lib/contact/adapter";
import { content } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { directionsUrl, formatAddress, hoursSummary } from "@/lib/stores";

/** Il modulo esiste solo con un adattatore realmente configurato (variabile pubblica incorporata in build). */
const formAvailable = () => getContactAdapter().available;

export async function generateMetadata(): Promise<Metadata> {
  const pages = await content.getPagesCopy();
  return buildMetadata({
    title: pages.contatti.titolo,
    description: formAvailable() ? pages.contatti.descrizioneModulo : pages.contatti.descrizione,
    path: "/contatti/",
  });
}

const linkCls =
  "inline-flex min-h-11 items-center gap-3 font-bold text-brand-blue-700 underline-offset-4 hover:underline";

export default async function ContattiPage() {
  const [settings, stores, pages] = await Promise.all([content.getSettings(), content.getStores(), content.getPagesCopy()]);
  const copy = pages.contatti;
  const withForm = formAvailable();
  const email = settings.societa.email;
  const wa = settings.whatsapp.numero
    ? `https://wa.me/${settings.whatsapp.numero}?text=${encodeURIComponent(settings.whatsapp.messaggioPredefinito)}`
    : null;
  const social = [
    { name: "Instagram", href: settings.social.instagram, icon: "instagram" as const },
    { name: "Facebook", href: settings.social.facebook, icon: "facebook" as const },
  ];

  return (
    <>
      <PageHeader
        breadcrumbLabel={pages.breadcrumb.aria}
        breadcrumb={[
          { label: pages.breadcrumb.home, href: "/" },
          { label: copy.titolo, href: "/contatti/" },
        ]}
        title={copy.titolo}
        lead={withForm ? copy.introModulo : copy.intro.replace("{email}", email)}
      />

      <section className="bg-white py-6 sm:py-9">
        <Container size="wide" className="space-y-6 sm:space-y-8">
          <div className={withForm ? "grid items-start gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-8" : undefined}>
            {withForm && (
              <div className="rounded-[var(--radius-lg)] border-2 border-brand-blue-100 p-4 sm:p-6">
                <ContactForm email={email} copy={copy.modulo} />
              </div>
            )}
            <section aria-labelledby="contatti-diretti" className="rounded-[var(--radius-lg)] bg-sand p-4 sm:p-6">
              <div className={withForm ? undefined : "flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8"}>
                <div>
                  <h2 id="contatti-diretti" className="!text-xl text-brand-blue-900">{copy.diretti}</h2>
                  {!withForm && <p className="mt-1 max-w-xl text-ink">{copy.emailTesto}</p>}
                </div>
                {!withForm && (
                  <Button href={`mailto:${email}`} size="lg" iconLeft={<Icon name="mail" size={22} />} className="max-w-full self-start md:self-auto">
                    {email}
                  </Button>
                )}
              </div>
              <ul className={withForm ? "mt-2" : "mt-3 flex flex-wrap gap-x-6 border-t border-brand-blue-100 pt-2"}>
                {withForm && (
                  <li>
                    <a href={`mailto:${email}`} className={linkCls}>
                      <Icon name="mail" /> {email}
                    </a>
                  </li>
                )}
                {wa && (
                  <li>
                    <a href={wa} target="_blank" rel="noopener noreferrer" className={linkCls}>
                      <Icon name="whatsapp" /> WhatsApp
                    </a>
                  </li>
                )}
                {social.map((s) => (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                      <Icon name={s.icon} /> {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section aria-labelledby="contatti-negozi">
            <h2 id="contatti-negozi" className="mb-3 border-l-[6px] border-brand-magenta-600 pl-3 !font-black text-brand-blue-900">{copy.negozi}</h2>
            <ul className="grid gap-3 md:grid-cols-3 md:gap-4">
              {stores.map((s) => {
                const { uniform } = hoursSummary(s);
                return (
                  <li key={s.id} className="flex flex-col rounded-[var(--radius-lg)] border-2 border-brand-blue-100 p-4 sm:p-5">
                    <h3 className="!text-xl text-brand-blue-900">{s.citta}</h3>
                    <p className="mt-2 flex gap-2 text-sm text-ink">
                      <Icon name="map-pin" size={18} className="mt-0.5 shrink-0 text-brand-magenta-700" />
                      <span>{formatAddress(s)}</span>
                    </p>
                    {uniform && (
                      <p className="mt-1 flex gap-2 text-sm text-ink">
                        <Icon name="clock" size={18} className="mt-0.5 shrink-0 text-brand-magenta-700" />
                        <span>{settings.piede.tuttiIGiorni} {uniform.replace("-", "–")}</span>
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      <Button href={directionsUrl(s)} variant="secondary" size="sm" iconRight={<Icon name="external" size={16} />}>
                        {copy.indicazioni}
                      </Button>
                      <Button href={`/dove-siamo/#${s.id}`} variant="outline" size="sm">
                        {copy.orariEIndicazioni}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <p className="text-sm text-muted">
            {copy.privacyPrima}
            <Link href="/privacy-policy/" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{copy.privacyLink}</Link>.
          </p>
        </Container>
      </section>
    </>
  );
}
