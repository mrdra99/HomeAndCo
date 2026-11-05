import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Analytics } from "@/components/consent/Analytics";
import { ConsentProvider } from "@/components/consent/ConsentProvider";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { content } from "@/lib/content";
import { jsonLdLocalBusiness } from "@/lib/seo";

/** Layout del sito vetrina: skip link, header, contenuto, footer, WhatsApp flottante (mobile). */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, navigation, stores] = await Promise.all([
    content.getSettings(),
    content.getNavigation(),
    content.getStores(),
  ]);

  return (
    <ConsentProvider>
      <JsonLd data={jsonLdLocalBusiness(stores, settings)} />
      <a
        href="#contenuto"
        className="sr-only z-[60] rounded-full bg-brand-blue-900 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Salta al contenuto
      </a>
      <Header items={navigation} />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer settings={settings} />
      {settings.whatsapp.numero && (
        <WhatsAppButton
          floating
          numero={settings.whatsapp.numero}
          messaggio={settings.whatsapp.messaggioPredefinito}
        />
      )}
      <CookieBanner />
      <Analytics gaId={settings.analytics.gaId} metaPixelId={settings.analytics.metaPixelId} />
    </ConsentProvider>
  );
}
