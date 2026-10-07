import type { NextConfig } from "next";

/**
 * Export statico per Cloudflare Pages: `next build` produce la cartella out/.
 * In locale si serve con `npx serve out` (npm start).
 *
 * PER PASSARE A MODALITA' SERVER (futuro shop su API .NET):
 *  1. rimuovere `output: "export"` (e `trailingSlash` se non serve piu);
 *  2. togliere `images.unoptimized` per usare l'ottimizzazione immagini di next/image
 *     (e configurare `images.remotePatterns` per le immagini del CMS/API);
 *  3. spostare gli eventuali redirect da public/_redirects a `redirects()` qui;
 *  4. ora sono ammessi route handler, middleware, server actions, ISR.
 * Finche' resta "export" tali funzionalita' rompono la build.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Radice esplicita: evita che Next risalga a lockfile fuori dal repo.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
