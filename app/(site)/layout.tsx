import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Analytics } from "@/components/consent/Analytics";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { content } from "@/lib/content";
import { jsonLdOrganization } from "@/lib/seo";

/** Layout del sito vetrina: skip link, header, contenuto, footer, WhatsApp flottante (sotto 1024 px, sopra la tab bar). */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, navigation, stores] = await Promise.all([
    content.getSettings(),
    content.getNavigation(),
    content.getStores(),
  ]);

  return (
    <ConsentProvider>
      <JsonLd data={jsonLdOrganization(settings)} />
      <a
        href="#contenuto"
        className="sr-only z-[60] rounded-md bg-brand-blue-900 px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {settings.testata.a11y.saltaAlContenuto}
      </a>
      <Header items={navigation.voci} groups={navigation.gruppi} stores={stores} copy={settings.testata} instagramUrl={settings.social.instagram} />
      {/* pb-tabbar: lo spazio della tab bar fissa (solo sotto 1024 px) e dell'area sicura, cosi' il footer non finisce sotto. */}
      <div className="pb-tabbar">
        <main id="contenuto" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer settings={settings} stores={stores} items={navigation.voci} />
      </div>
      {settings.whatsapp.numero && (
        <WhatsAppButton
          floating
          numero={settings.whatsapp.numero}
          messaggio={settings.whatsapp.messaggioPredefinito}
        />
      )}
      <CookieBanner copy={settings.consenso} />
      <Analytics gaId={settings.analytics.gaId} metaPixelId={settings.analytics.metaPixelId} />
    </ConsentProvider>
  );
}
