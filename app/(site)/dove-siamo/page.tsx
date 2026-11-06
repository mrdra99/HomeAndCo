import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { StoresBoard } from "@/components/stores/StoresBoard";
import { content } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Negozi e orari: Prato, Lucca, Sesto Fiorentino",
  description:
    "Home & Co. a Prato (Viale G. Marconi 38), Lucca (Via Romana 3137) e Sesto Fiorentino (Via Giacomo Leopardi 66, ex Coop Il Neto). Aperti tutti i giorni, anche domenica e festivi.",
  path: "/dove-siamo/",
});

export default async function DoveSiamoPage() {
  const [stores, settings, home, pages] = await Promise.all([
    content.getStores(),
    content.getSettings(),
    content.getHomeCopy(),
    content.getPagesCopy(),
  ]);
  const copy = pages.doveSiamo;
  return (
    <>
      <PageHeader
        breadcrumbLabel={pages.breadcrumb.aria}
        breadcrumb={[
          { label: pages.breadcrumb.home, href: "/" },
          { label: copy.titolo, href: "/dove-siamo/" },
        ]}
        title={copy.titolo}
        lead={copy.intro}
      />
      <StoresBoard
        stores={stores}
        copy={copy}
        cardCopy={{ orari: home.negozi.orari, indicazioni: home.negozi.indicazioni, mappa: home.negozi.mappa }}
        statusCopy={settings.testata.negozio}
        neutralPrefix={home.tabellone.negozi.apertoNeutro}
        whatsapp={{ numero: settings.whatsapp.numero, messaggio: settings.whatsapp.messaggioPredefinito }}
      />
    </>
  );
}
