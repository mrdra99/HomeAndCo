import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoyaltyCard } from "@/components/loyalty/LoyaltyCard";
import { isLoyaltyFilled } from "@/lib/loyalty";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon, isIconName } from "@/components/ui/Icon";
import { content } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [loyalty, pages] = await Promise.all([content.getLoyalty(), content.getPagesCopy()]);
  return buildMetadata({
    title: loyalty.nome,
    description: isLoyaltyFilled(loyalty) ? pages.cartaFedelta.meta.completa : pages.cartaFedelta.meta.vuota,
    path: "/carta-fedelta/",
  });
}

/**
 * Carta fedelta': mostra solo cio' che il contenuto conferma. Vantaggi, passaggi e domande compaiono quando
 * sono compilati in content/loyalty.json; finche' non ci sono la pagina dice solo che il regolamento sara' pubblicato qui.
 */
export default async function CartaFedeltaPage() {
  const [loyalty, pages] = await Promise.all([content.getLoyalty(), content.getPagesCopy()]);
  const copy = pages.cartaFedelta;
  const filled = isLoyaltyFilled(loyalty);

  return (
    <>
      <PageHeader
        breadcrumbLabel={pages.breadcrumb.aria}
        breadcrumb={[
          { label: pages.breadcrumb.home, href: "/" },
          { label: loyalty.nome, href: "/carta-fedelta/" },
        ]}
        title={loyalty.nome}
        lead={loyalty.intro}
      />

      {!filled ? (
        <section className="bg-white py-6 sm:py-9">
          <Container size="wide" className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button href="/offerte/" variant="secondary" iconRight={<Icon name="arrow-right" size={20} />}>
                {copy.vuota.volantino}
              </Button>
              <Button href="/dove-siamo/" variant="outline">{copy.vuota.negozi}</Button>
            </div>
          </Container>
        </section>
      ) : (
      <section className="bg-white py-6 sm:py-9">
        <Container size="wide">
          <div className="grid gap-5 md:grid-cols-[18rem_minmax(0,1fr)] md:items-start md:gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-12">
            <LoyaltyCard nome={loyalty.nome} className="max-w-72" />
            <div className="space-y-5">
              {(loyalty.costo || loyalty.regolamento) && (
                <dl className="grid max-w-2xl gap-3 sm:grid-cols-2">
                  {loyalty.costo && (
                    <div className="rounded-[var(--radius-md)] bg-sand p-3">
                      <dt className="font-extrabold text-brand-blue-900">{copy.costo}</dt>
                      <dd className="mt-1">{loyalty.costo}</dd>
                    </div>
                  )}
                  {loyalty.regolamento && (
                    <div className="rounded-[var(--radius-md)] bg-sand p-3">
                      <dt className="font-extrabold text-brand-blue-900">{copy.regolamento}</dt>
                      <dd className="mt-1">{loyalty.regolamento}</dd>
                    </div>
                  )}
                </dl>
              )}

              {loyalty.vantaggi.length > 0 && (
                <div>
                  <SectionTitle>{copy.vantaggi}</SectionTitle>
                  <ul className="grid gap-3 sm:grid-cols-3">
                    {loyalty.vantaggi.map((v) => (
                      <li key={v.titolo} className="rounded-[var(--radius-lg)] border-2 border-brand-blue-100 p-4">
                        <span className="flex size-11 items-center justify-center rounded-md bg-brand-magenta-50 text-brand-magenta-700">
                          <Icon name={isIconName(v.icona) ? v.icona : "check"} size={24} />
                        </span>
                        <h3 className="mt-3 !text-lg text-brand-blue-900">{v.titolo}</h3>
                        <p className="mt-1 text-sm text-ink">{v.testo}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {loyalty.passi.length > 0 && (
                <div>
                  <SectionTitle>{copy.passi}</SectionTitle>
                  <ol className="space-y-2">
                    {loyalty.passi.map((s, i) => (
                      <li key={s} className="flex items-start gap-3 rounded-[var(--radius-md)] bg-sand p-3">
                        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-blue-600 font-black text-white">
                          {i + 1}
                        </span>
                        <p className="pt-0.5">{s}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {loyalty.faq.length > 0 && (
                <div>
                  <SectionTitle>{copy.faq}</SectionTitle>
                  <Accordion className="!shadow-none ring-1 ring-brand-blue-100" items={loyalty.faq.map((f) => ({ domanda: f.d, risposta: f.r }))} />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
      )}

      {filled && (
      <section aria-labelledby="carta-domande" className="bg-sand py-6 sm:py-9">
        <Container size="wide">
          <div className="on-dark flex flex-col gap-4 rounded-[var(--radius-xl)] bg-brand-blue-600 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <h2 id="carta-domande" className="!text-2xl !font-black text-white">{copy.domande.titolo}</h2>
              <p className="mt-1 max-w-xl text-white/95">{copy.domande.testo}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contatti/" variant="light" iconRight={<Icon name="arrow-right" size={20} />}>
                {copy.domande.scrivici}
              </Button>
              <Button href="/dove-siamo/" variant="outline" className="border-white text-white hover:bg-white/10">
                {copy.domande.negozi}
              </Button>
            </div>
          </div>
        </Container>
      </section>
      )}
    </>
  );
}
