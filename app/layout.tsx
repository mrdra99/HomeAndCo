import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SITE_CLAIM, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
  /** Attiva env(safe-area-inset-*) su iPhone con notch: senza, i margini di sicurezza valgono sempre 0. */
  viewportFit: "cover",
};

/**
 * Radice. La palette e' fissa (l'accento e' il magenta del logo, definito in globals.css): le campagne
 * stagionali cambiano immagini e testi scelti in build e ricontrollati nel client, non i colori.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={figtree.variable} data-scroll-behavior="smooth">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
