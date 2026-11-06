import type { NavGroup, NavItem } from "./content/schemas";

export const DEPARTMENT_PREFIX = "/corridoi/";

export type DepartmentGroup = { titolo: string; items: NavItem[] };

/** Reparti (voci /corridoi/...) raggruppati come in content/navigation.json → `gruppi`. */
export function groupDepartments(voci: NavItem[], gruppi: NavGroup[]): DepartmentGroup[] {
  const byHref = new Map(voci.map((v) => [v.href, v]));
  return gruppi.map((g) => ({
    titolo: g.titolo,
    items: g.reparti.map((href) => byHref.get(href)).filter((v): v is NavItem => Boolean(v)),
  }));
}
