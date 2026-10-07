import { FileContentSource } from "./file-source";
import type { ContentSource } from "./source";
import type { Aisle, Campaign, Flyer, Store } from "./schemas";
import { pickCampaign } from "../campaigns";
import { archivedFlyers, currentFlyers } from "../flyers";

export type { ContentSource } from "./source";
export * from "./schemas";

/*
 * ---------------------------------------------------------------------------
 * Dove si collegherà il futuro (NON ancora implementato):
 *
 * // class ApiContentSource implements ContentSource {
 * //   // API .NET (vertical slice, ApiResponse<T>): fetch(`${API_URL}/content/...`),
 * //   // risposta validata con gli stessi schemi Zod di ./schemas.
 * //   // Con output "export" i dati vengono letti in build; in modalità server si può usare ISR.
 * // }
 *
 * // class CmsContentSource implements ContentSource {
 * //   // CMS headless (Decap/Sanity/...): mappare le entry sugli schemi di ./schemas.
 * // }
 *
 * La sorgente si sceglie da UNA sola variabile: NEXT_PUBLIC_CONTENT_SOURCE = "file" | "api" | "cms"
 * (default "file").
 * ---------------------------------------------------------------------------
 */
function createSource(): ContentSource {
  const kind = process.env.NEXT_PUBLIC_CONTENT_SOURCE ?? "file";
  switch (kind) {
    case "file":
      return new FileContentSource();
    // case "api": return new ApiContentSource();
    // case "cms": return new CmsContentSource();
    default:
      throw new Error(
        `NEXT_PUBLIC_CONTENT_SOURCE="${kind}" non supportato (valori ammessi: "file"; "api" e "cms" non ancora implementati).`,
      );
  }
}

/** Istanza unica della sorgente contenuti. */
export const content: ContentSource = createSource();

/** Campagna attiva alla data indicata (fallback: default). */
export async function getActiveCampaign(date: Date = new Date()): Promise<Campaign> {
  return pickCampaign(await content.getCampaigns(), date);
}

/** Corridoio visibile per slug (undefined se inesistente o nascosto). */
export async function getAisle(slug: string): Promise<Aisle | undefined> {
  return (await content.getAisles()).find((a) => a.slug === slug && a.visibile);
}

/** Slug dei corridoi visibili: per generateStaticParams. */
export async function getAisleSlugs(): Promise<string[]> {
  return (await content.getAisles()).filter((a) => a.visibile).map((a) => a.slug);
}

/** Corridoi visibili; quelli della campagna vengono messi per primi (nell'ordine della campagna). */
export async function getFeaturedAisles(campaign?: Campaign): Promise<Aisle[]> {
  const aisles = (await content.getAisles()).filter((a) => a.visibile);
  const slugs = campaign?.corridoiInEvidenza ?? [];
  const featured = slugs
    .map((s) => aisles.find((a) => a.slug === s))
    .filter((a): a is Aisle => Boolean(a));
  const rest = aisles.filter((a) => !slugs.includes(a.slug));
  return [...featured, ...rest];
}

/** Volantini validi alla data, dal più recente (validoDal desc). */
export async function getCurrentFlyers(date: Date = new Date()): Promise<Flyer[]> {
  return currentFlyers(await content.getFlyers(), date);
}

/** Volantini scaduti (archivio), dal più recente. */
export async function getArchivedFlyers(date: Date = new Date()): Promise<Flyer[]> {
  return archivedFlyers(await content.getFlyers(), date);
}

export async function getStore(id: string): Promise<Store | undefined> {
  return (await content.getStores()).find((s) => s.id === id);
}
