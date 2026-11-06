import type { MetadataRoute } from "next";
import { content, getAisleSlugs } from "../lib/content";
import { SITE_URL } from "../lib/site";
import { sitemapRoutes } from "../lib/sitemap-routes";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, stores] = await Promise.all([getAisleSlugs(), content.getStores()]);
  const routes = sitemapRoutes(slugs, stores.map((s) => s.id));
  const lastModified = new Date();
  return routes.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified,
    changeFrequency: path === "/" || path === "/offerte/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : /policy/.test(path) ? 0.2 : 0.7,
  }));
}
