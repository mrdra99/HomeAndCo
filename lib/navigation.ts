import type { Campaign, ImageRef, NavGroup, NavItem } from "./content/schemas";

export const DEPARTMENT_PREFIX = "/corridoi/";

export type DepartmentGroup = { titolo: string; breve?: string; immagine: ImageRef; items: NavItem[] };

/** Reparti (voci /corridoi/...) raggruppati come in content/navigation.json → `gruppi`. */
export function groupDepartments(voci: NavItem[], gruppi: NavGroup[]): DepartmentGroup[] {
  const byHref = new Map(voci.map((v) => [v.href, v]));
  return gruppi.map((g) => ({
    titolo: g.titolo,
    breve: g.breve,
    immagine: g.immagine,
    items: g.reparti.map((href) => byHref.get(href)).filter((v): v is NavItem => Boolean(v)),
  }));
}

/**
 * Gruppo di stagione, dalla `collezione` della campagna attiva: titolo grande (es. «Natale»), le idee come voci
 * (ognuna porta al suo reparto, piu' idee possono condividerne uno) e la foto del collage. Senza collezione non c'e'.
 * Lo usano la voce di stagione della barra desktop e il pannello Reparti della tab bar.
 */
export function seasonalMenu(campaign: Campaign): DepartmentGroup | null {
  const c = campaign.collezione;
  if (!c) return null;
  const image = c.galleria[0] ?? c.idee.find((i) => i.immagine?.src)?.immagine;
  return {
    titolo: c.titoloGrande ?? campaign.etichetta ?? c.titolo,
    immagine: image ?? { src: null, alt: "" },
    items: c.idee.map((idea) => ({ label: idea.titolo, href: `${DEPARTMENT_PREFIX}${idea.corridoio}/`, evidenza: false, soloPiede: false })),
  };
}
