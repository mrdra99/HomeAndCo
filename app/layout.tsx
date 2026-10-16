import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { CampaignThemeScript } from "@/components/campaign/CampaignThemeScript";
import { CampaignRuntime } from "@/components/campaign/CampaignRuntime";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { campaignCssVars } from "@/lib/campaigns";
import { getActiveCampaign, content } from "@/lib/content";
import { SITE_CLAIM, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_CLAIM}`, template: `%s | ${SITE_NAME}` },
  description: SITE_CLAIM,
  openGraph: {
    type: "website", locale: "it_IT", siteName: SITE_NAME,
    images: [{ url: "/brand/social.png", width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_CLAIM}` }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/social.png"] },
};

export const viewport: Viewport = {
  themeColor: "#0f6bb4",
};

/**
 * Radice. Anti-flash delle campagne:
 *  1. in build calcoliamo la campagna attiva e scriviamo data-campaign + CSS vars su <html>
 *     (HTML statico gia' col tema giusto);
 *  2. lo script inline nel <head> ricalcola la campagna con la data reale del visitatore
 *     prima del paint e, se diversa, aggiorna attributo e variabili.
 * suppressHydrationWarning: lo script puo' legittimamente modificare gli attributi di <html>.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [active, campaigns] = await Promise.all([getActiveCampaign(), content.getCampaigns()]);
  return (
    <html
      lang="it"
      className={figtree.variable}
      data-campaign={active.id}
      data-theme={active.tema}
      data-scroll-behavior="smooth"
      style={campaignCssVars(active) as CSSProperties}
      suppressHydrationWarning
    >
      <head>
        <CampaignThemeScript campaigns={campaigns} />
      </head>
      <body>
        <SmoothScroll />
        <CampaignRuntime campaigns={campaigns} buildCampaignId={active.id} />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
