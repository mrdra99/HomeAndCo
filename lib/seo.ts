import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./site";
import type { Settings, Store } from "./content/schemas";
import { hasConfirmedCoordinates, mapUrl, streetOnly } from "./stores";

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Percorso con slash finale, es. "/offerte/" ("/" per la home). */
  path: string;
  /** Immagine OG (percorso o URL assoluto). Se assente: nessuna immagine esplicita. */
  image?: string;
  /** Per pagine da non indicizzare. */
  noindex?: boolean;
};

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/** Metadata completi: canonical, Open Graph, Twitter, locale it_IT. */
export function buildMetadata({ title, description, path, image, noindex }: BuildMetadataInput): Metadata {
  // Alcuni contenuti includono già il brand: il template del layout lo aggiunge una volta sola.
  const pageTitle = title.endsWith(` | ${SITE_NAME}`) ? title.slice(0, -(` | ${SITE_NAME}`.length)) : title;
  const url = absoluteUrl(path);
  const socialImage = image ?? "/brand/social.png";
  const images = [{ url: absoluteUrl(socialImage) }];
  return {
    title: pageTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(socialImage)],
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Un'unica specifica per ogni fascia oraria, con l'elenco dei giorni in cui vale (ordine lun-dom). */
export function openingHoursSpecification(store: Pick<Store, "orari">) {
  if (!store.orari || store.orari.length === 0) return undefined;
  const bySlot = new Map<string, { opens: string; closes: string; days: string[] }>();
  for (const g of [1, 2, 3, 4, 5, 6, 0]) {
    const day = store.orari.find((d) => d.giorno === g);
    for (const slot of day?.aperture ?? []) {
      const key = `${slot.da}-${slot.a}`;
      const entry = bySlot.get(key) ?? { opens: slot.da, closes: slot.a, days: [] };
      entry.days.push(DAYS[g]);
      bySlot.set(key, entry);
    }
  }
  const specs = [...bySlot.values()].map((e) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: e.days,
    opens: e.opens,
    closes: e.closes,
  }));
  return specs.length ? specs : undefined;
}

const organizationId = () => `${SITE_URL}/#organization`;

/** Organization: unica e globale (layout del sito). I negozi stanno ciascuno nella propria pagina. */
export function jsonLdOrganization(settings: Settings) {
  const sameAs = [settings.social.instagram, settings.social.facebook].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(),
    name: settings.nomeSito,
    legalName: settings.societa.ragioneSociale,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo.png"), width: 1200, height: 334 },
    email: settings.societa.email,
    vatID: `IT${settings.societa.piva}`,
    slogan: settings.claim,
    sameAs,
  };
}

/**
 * HomeGoodsStore di UN negozio, da inserire solo nella sua pagina /dove-siamo/<id>/.
 * L'immagine compare solo se esiste la foto del negozio (mai una foto di ripiego); telefono ed email solo se noti.
 */
export function jsonLdStore(store: Store, settings: Settings) {
  const url = absoluteUrl(`/dove-siamo/${store.id}/`);
  const sameAs = [settings.social.instagram, settings.social.facebook].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    "@id": `${url}#store`,
    name: store.nome,
    url,
    image: store.immagine.src ? absoluteUrl(store.immagine.src) : undefined,
    parentOrganization: { "@id": organizationId() },
    address: {
      "@type": "PostalAddress",
      streetAddress: streetOnly(store),
      postalCode: store.indirizzo.cap,
      addressLocality: store.indirizzo.citta,
      addressRegion: store.indirizzo.provincia,
      addressCountry: "IT",
    },
    // geo solo con le coordinate confermate dal cliente (stores.json -> coordinateConfermate).
    geo: hasConfirmedCoordinates(store) ? { "@type": "GeoCoordinates", latitude: store.coordinate.lat, longitude: store.coordinate.lng } : undefined,
    hasMap: mapUrl(store),
    telephone: store.telefono ?? undefined,
    email: store.email ?? undefined,
    sameAs,
    openingHoursSpecification: openingHoursSpecification(store),
  };
}
