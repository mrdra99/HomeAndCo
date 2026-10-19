import type { NextConfig } from "next";
import imageSizes from "./lib/image-sizes.json";

/**
 * Export statico per Cloudflare Pages: `next build` produce la cartella out/.
 * In locale si serve con `npx serve out` (npm start).
 *
 * PER PASSARE A MODALITA' SERVER (futuro shop su API .NET):
 *  1. rimuovere `output: "export"` (e `trailingSlash` se non serve piu);
 *  2. valutare il loader immagini del CMS/API al posto delle varianti statiche;
 *  3. spostare gli eventuali redirect da public/_redirects a `redirects()` qui;
 *  4. ora sono ammessi route handler, middleware, server actions, ISR.
 * Finche' resta "export" tali funzionalita' rompono la build.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    ...imageSizes,
  },
  // Radice esplicita: evita che Next risalga a lockfile fuori dal repo.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
