/** Rotte pubbliche statiche (con slash finale). /design-system/ e' escluso di proposito. */
const STATIC_ROUTES = ["/", "/offerte/", "/dove-siamo/", "/carta-fedelta/", "/contatti/", "/privacy-policy/", "/cookie-policy/"];

/** Tutte le rotte della sitemap: statiche, una pagina per negozio e una per reparto. */
export function sitemapRoutes(aisleSlugs: string[], storeIds: string[]): string[] {
  return [...STATIC_ROUTES, ...storeIds.map((id) => `/dove-siamo/${id}/`), ...aisleSlugs.map((s) => `/corridoi/${s}/`)];
}
