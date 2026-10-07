import type { MetadataRoute } from "next";
import { getAisleSlugs } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** Rotte pubbliche statiche (con slash finale). /design-system/ e' escluso di proposito. */
const STATIC_ROUTES = ["/", "/offerte/", "/dove-siamo/", "/carta-fedelta/", "/contatti/", "/privacy-policy/", "/cookie-policy/"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAisleSlugs();
  const routes = [...STATIC_ROUTES, ...slugs.map((s) => `/corridoi/${s}/`)];
  const lastModified = new Date();
  return routes.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified,
    changeFrequency: path === "/" || path === "/offerte/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : /policy/.test(path) ? 0.2 : 0.7,
  }));
}
