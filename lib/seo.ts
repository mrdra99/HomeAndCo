import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./site";
import type { Settings, Store } from "./content/schemas";

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
  const url = absoluteUrl(path);
  const images = image ? [{ url: absoluteUrl(image) }] : undefined;
  return {
    title,
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
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function openingHoursSpecification(store: Store) {
  if (!store.orari || store.orari.length === 0) return undefined;
  const specs = store.orari.flatMap((d) =>
    d.aperture.map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAYS[d.giorno],
      opens: s.da,
      closes: s.a,
    })),
  );
  return specs.length ? specs : undefined;
}

/** Array JSON-LD: Organization + un HomeGoodsStore per sede. */
export function jsonLdLocalBusiness(stores: Store[], settings: Settings) {
  const sameAs = [settings.social.instagram, settings.social.facebook].filter(Boolean);
  const orgId = `${SITE_URL}/#organization`;
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: settings.nomeSito,
    legalName: settings.societa.ragioneSociale,
    url: SITE_URL,
    email: settings.societa.email,
    vatID: `IT${settings.societa.piva}`,
    slogan: settings.claim,
    sameAs,
  };
  const shops = stores.map((s) => ({
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    "@id": `${SITE_URL}/dove-siamo/#${s.id}`,
    name: s.nome,
    url: absoluteUrl("/dove-siamo/"),
    parentOrganization: { "@id": orgId },
    address: {
      "@type": "PostalAddress",
      streetAddress: s.indirizzo.via,
      postalCode: s.indirizzo.cap,
      addressLocality: s.indirizzo.citta,
      addressRegion: s.indirizzo.provincia,
      addressCountry: "IT",
    },
    geo: { "@type": "GeoCoordinates", latitude: s.coordinate.lat, longitude: s.coordinate.lng },
    telephone: s.telefono ?? undefined,
    email: s.email ?? undefined,
    sameAs,
    openingHoursSpecification: openingHoursSpecification(s),
  }));
  return [organization, ...shops];
}
