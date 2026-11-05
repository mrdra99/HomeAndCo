import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import aisles from "../../content/aisles.json";
import navigation from "../../content/navigation.json";
import sources from "../../content/photo-sources.json";
import { AisleSchema, NavigationSchema } from "../content/schemas";

describe("reparti dalle fotografie del cliente", () => {
  it("rende raggiungibili tutti i reparti fotografati dal menu", () => {
    const departments = AisleSchema.array().parse(aisles).filter((a) => a.visibile);
    const links = NavigationSchema.parse(navigation).filter((a) => a.href.startsWith("/corridoi/"));
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
    expect(NavigationSchema.safeParse(Array.from({ length: 11 }, (_, i) => ({ label: `Voce ${i}`, href: `/pagina-${i}/` }))).success).toBe(false);
  });
});
