import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { Fredoka, Figtree } from "next/font/google";
import { CampaignThemeScript } from "@/components/campaign/CampaignThemeScript";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { campaignCssVars } from "@/lib/campaigns";
import { getActiveCampaign, content } from "@/lib/content";
import { SITE_CLAIM, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

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
};

export const viewport: Viewport = {
  themeColor: "#FBF6EE",
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
      className={`${fredoka.variable} ${figtree.variable}`}
      data-campaign={active.id}
      data-scroll-behavior="smooth"
      style={campaignCssVars(active) as CSSProperties}
      suppressHydrationWarning
    >
      <head>
        <CampaignThemeScript campaigns={campaigns} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
