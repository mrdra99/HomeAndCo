/**
 * Pagina di un negozio: /dove-siamo/<id>/ (export statico: generateStaticParams + dynamicParams = false).
 * Solo dati del negozio: nessun servizio, telefono o assortimento che non sia nel file dei contenuti.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { whatsappHref } from "@/components/layout/WhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { StoreStatus } from "@/components/sections/StoreStatus";
import { StoreFlyer } from "@/components/stores/StoreFlyer";
import { StoreMap } from "@/components/stores/StoreMap";
import { StoreSelectButton } from "@/components/stores/StoreSelectButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { content, getStore } from "@/lib/content";
import { toIsoDate } from "@/lib/campaigns";
import { groupDepartments } from "@/lib/navigation";
import { buildMetadata, jsonLdStore } from "@/lib/seo";
import { directionsUrl, formatAddress, formatOpeningHours, hasConfirmedCoordinates, hasOpeningHours, hoursSummary, storePath, telHref } from "@/lib/stores";

export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await content.getStores()).map((s) => ({ slug: s.id }));
}

const fill = (template: string, values: Record<string, string>) =>
  Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, value), template);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const [store, pages] = await Promise.all([getStore(slug), content.getPagesCopy()]);
  if (!store) return {};
  const copy = pages.negozio;
  const { uniform } = hoursSummary(store);
  const values = { citta: store.citta, indirizzo: formatAddress(store), orario: uniform?.replace("-", "–") ?? "" };
  return buildMetadata({
    title: fill(copy.metaTitolo, values),
    description: fill(uniform ? copy.metaDescrizioneConOrario : copy.metaDescrizione, values),
    path: storePath(store),
    image: store.immagine.src ?? undefined,
  });
}

export default async function StorePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const store = await getStore(slug);
  if (!store) notFound();

  const [stores, settings, home, pages, flyers, navigation] = await Promise.all([
    content.getStores(),
    content.getSettings(),
    content.getHomeCopy(),
    content.getPagesCopy(),
    content.getFlyers(),
    content.getNavigation(),
  ]);
  const copy = pages.negozio;
  const { uniform } = hoursSummary(store);
  const hours = formatOpeningHours(store);
  const tel = telHref(store.telefono);
  const wa = store.whatsapp ?? settings.whatsapp.numero;
  const photo = Boolean(store.immagine.src);
  const confirmed = hasConfirmedCoordinates(store);
  const others = stores.filter((s) => s.id !== store.id);
  const groups = groupDepartments(navigation.voci, navigation.gruppi);
  const labelCls = "text-sm font-extrabold uppercase tracking-wide text-brand-blue-700";
  const sectionTitle = "mb-3 border-l-[6px] border-brand-magenta-600 pl-3 !text-xl !font-black text-brand-blue-900";

  return (
    <>
      <JsonLd data={jsonLdStore(store, settings)} />
      <PageHeader
        breadcrumbLabel={pages.breadcrumb.aria}
        breadcrumb={[
          { label: pages.breadcrumb.home, href: "/" },
          { label: pages.doveSiamo.titolo, href: "/dove-siamo/" },
          { label: store.citta, href: storePath(store) },
        ]}
        title={store.nome}
      />

      <Container size="wide" className="py-5 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-10">
          <div>
            <StoreStatus
              store={store}
              copy={settings.testata.negozio}
              neutralPrefix={home.tabellone.negozi.apertoNeutro}
              tone="dark"
              className="!text-lg"
            />

            <dl className="mt-5 space-y-5">
              <div>
                <dt className={labelCls}>{copy.indirizzo}</dt>
                <dd className="mt-1 text-lg font-semibold text-brand-blue-900">
                  <address className="not-italic">{formatAddress(store)}</address>
                </dd>
              </div>
              <div>
                <dt className={labelCls}>{copy.orari}</dt>
                <dd className="mt-1 text-base text-ink">
                  {!hasOpeningHours(store) ? (
                    <span className="text-muted">{copy.orariInAggiornamento}</span>
                  ) : uniform ? (
                    <span className="text-lg font-semibold text-brand-blue-900">
                      {settings.piede.tuttiIGiorni} {uniform.replace("-", "–")}
                    </span>
                  ) : (
                    <table className="w-full max-w-xs text-left">
                      <caption className="sr-only">{copy.orari}: {store.nome}</caption>
                      <tbody>
                        {hours.map((r) => (
                          <tr key={r.giorno} className="border-b border-brand-blue-100 last:border-0">
                            <th scope="row" className="py-1 pr-4 font-semibold capitalize">{r.etichetta}</th>
                            <td className="py-1">{r.testo.replace("-", "–")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {store.noteOrari && <span className="mt-1 block text-muted">{store.noteOrari}</span>}
                </dd>
              </div>
              {store.particolarita.length > 0 && (
                <div>
                  <dt className={labelCls}>{copy.daSapere}</dt>
                  <dd className="mt-1">
                    <ul className="space-y-1 text-base text-ink">
                      {store.particolarita.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </dd>
                </div>
              )}
              {store.servizi.length > 0 && (
                <div>
                  <dt className={labelCls}>{copy.servizi}</dt>
                  <dd className="mt-1">
                    <ul className="flex flex-wrap gap-2">
                      {store.servizi.map((s) => (
                        <li key={s} className="rounded-md bg-sand px-2.5 py-1 text-sm font-semibold text-brand-blue-900">{s}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button href={directionsUrl(store)} variant="secondary" iconRight={<Icon name="external" size={16} />}>
                {copy.indicazioni}
              </Button>
              <StoreSelectButton storeId={store.id} labelOn={copy.tuoNegozio} labelOff={copy.impostaNegozio} />
              {tel && <Button href={tel} variant="outline" size="sm" iconLeft={<Icon name="phone" size={16} />}>{copy.chiama}</Button>}
              {wa && (
                <Button href={whatsappHref(wa, settings.whatsapp.messaggioPredefinito)} variant="outline" size="sm" iconLeft={<Icon name="whatsapp" size={16} />}>
                  {copy.whatsapp}
                </Button>
              )}
            </div>
            {photo && confirmed && (
              <SmartImage
                src={store.immagine.src}
                alt={store.immagine.alt}
                label={store.nome}
                ratio="16/9"
                sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
                rounded="rounded-[var(--radius-lg)]"
                className="mt-6"
              />
            )}
            {photo && !confirmed && (
              <StoreMap store={store} buttonLabel={copy.apriMappa} className="mt-6 min-h-56 rounded-[var(--radius-lg)]" />
            )}
          </div>

          {photo && !confirmed ? (
            <div className="relative min-h-72 overflow-hidden rounded-[var(--radius-lg)] lg:min-h-96">
              <SmartImage
                src={store.immagine.src}
                alt={store.immagine.alt}
                label={store.nome}
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 55vw, 100vw"
                rounded="rounded-none"
                className="absolute inset-0"
              />
            </div>
          ) : (
            <StoreMap store={store} buttonLabel={copy.apriMappa} lazy className="min-h-72 rounded-[var(--radius-lg)] lg:h-full lg:min-h-80" />
          )}
        </div>

        <StoreFlyer
          flyers={flyers}
          storeId={store.id}
          stores={stores}
          buildDate={toIsoDate()}
          copy={copy.volantino}
          flyerCopy={home.volantino}
          className="mt-8"
        />

        <section aria-labelledby="altri-negozi" className="mt-8">
          <h2 id="altri-negozi" className={sectionTitle}>{copy.altriNegozi}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {others.map((s) => (
              <li key={s.id}>
                <Link
                  href={storePath(s)}
                  className="flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-md)] border-2 border-brand-blue-100 bg-white px-4 py-2 hover:border-brand-blue-600"
                >
                  <span>
                    <span className="block text-lg font-extrabold leading-tight text-brand-blue-900">{s.citta}</span>
                    <span className="block text-sm text-muted">{s.indirizzo.via}</span>
                  </span>
                  <Icon name="arrow-right" size={20} className="shrink-0 text-brand-blue-700" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="negozio-reparti" className="mt-8">
          <h2 id="negozio-reparti" className={sectionTitle}>{copy.reparti}</h2>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
            {groups.map((group) => (
              <div key={group.titolo}>
                <h3 className="border-b-2 border-brand-blue-100 pb-1 !text-[0.8125rem] font-extrabold uppercase tracking-wider text-brand-blue-700">{group.titolo}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="-mx-2 flex min-h-11 items-center rounded-md px-2 text-[0.95rem] font-semibold leading-snug text-brand-blue-900 hover:bg-brand-blue-50 hover:text-brand-blue-700">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
