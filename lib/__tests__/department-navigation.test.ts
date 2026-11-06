import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import aisles from "../../content/aisles.json";
import navigation from "../../content/navigation.json";
import sources from "../../content/photo-sources.json";
import { groupDepartments } from "../navigation";
import { AisleSchema, NavigationSchema } from "../content/schemas";

describe("reparti dalle fotografie del cliente", () => {
  it("rende raggiungibili tutti i reparti fotografati dal menu", () => {
    const departments = AisleSchema.array().parse(aisles).filter((a) => a.visibile);
    const links = NavigationSchema.parse(navigation).voci.filter((a) => a.href.startsWith("/corridoi/"));
    expect(new Set(links.map((a) => a.href))).toEqual(new Set(departments.map((a) => `/corridoi/${a.slug}/`)));
    for (const department of departments) {
      expect(department.scaffali.length).toBeGreaterThanOrEqual(2);
      for (const image of [department.immagine, ...department.scaffali.map((s) => s.immagine)]) {
        expect(existsSync(join(process.cwd(), "public", image.src!))).toBe(true);
        expect(sources.images.some((source) => source.file === image.src)).toBe(true);
      }
    }
  });
  it("limita le voci principali senza limitare i reparti nel menu a tendina", () => {
    expect(NavigationSchema.safeParse(navigation).success).toBe(true);
    const voci = Array.from({ length: 11 }, (_, i) => ({ label: `Voce ${i}`, href: `/pagina-${i}/` }));
    expect(NavigationSchema.safeParse({ voci, gruppi: [{ titolo: "G", reparti: ["/corridoi/x/"] }] }).success).toBe(false);
  });
  it("ognuno dei 13 reparti compare una sola volta nei gruppi del menu", () => {
    const nav = NavigationSchema.parse(navigation);
    const departments = nav.voci.filter((v) => v.href.startsWith("/corridoi/")).map((v) => v.href);
    const grouped = nav.gruppi.flatMap((g) => g.reparti);
    expect(departments).toHaveLength(13);
    expect(grouped).toHaveLength(13);
    expect(new Set(grouped)).toEqual(new Set(departments));
    expect(nav.gruppi.map((g) => g.titolo)).toEqual(["Casa", "Pulizia e cura", "Regali e tempo libero", "Animali e giardino", "Fai da te e auto"]);
  });
  it("rifiuta un reparto duplicato o mancante nei gruppi", () => {
    const nav = NavigationSchema.parse(navigation);
    const [first, ...rest] = nav.gruppi;
    expect(NavigationSchema.safeParse({ ...nav, gruppi: [{ ...first, reparti: [...first.reparti, first.reparti[0]] }, ...rest] }).success).toBe(false);
    expect(NavigationSchema.safeParse({ ...nav, gruppi: [{ ...first, reparti: first.reparti.slice(1) }, ...rest] }).success).toBe(false);
  });
  it("raggruppa i reparti nell'ordine dei dati", () => {
    const nav = NavigationSchema.parse(navigation);
    const groups = groupDepartments(nav.voci, nav.gruppi);
    expect(groups[0].items.map((i) => i.label)).toEqual(["Casa e cucina", "Biancheria e arredo", "Ordine e accessori bagno", "Illuminazione e accessori tech"]);
  });

});
