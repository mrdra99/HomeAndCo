import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { AisleSchema } from "../content/schemas";
import aislesJson from "../../content/aisles.json";

describe("scaffali dei corridoi", () => {
  it("e' facoltativo, con default vuoto e titolo di sezione", () => {
    const base = { ...(aislesJson as Record<string, unknown>[])[0] };
    delete base.scaffali;
    const parsed = AisleSchema.parse(base);
    expect(parsed.scaffali).toEqual([]);
    expect(parsed.scaffaliTitolo).toBeTruthy();
  });
  it("accetta scaffali con alt e rifiuta quelli senza alt o src", () => {
    const base = (aislesJson as Record<string, unknown>[])[0];
    const ok = AisleSchema.safeParse({ ...base, scaffali: [{ immagine: { src: "/a.webp", alt: "Scaffale" }, titolo: "T" }] });
    expect(ok.success).toBe(true);
    expect(AisleSchema.safeParse({ ...base, scaffali: [{ immagine: { src: "/a.webp", alt: "" } }] }).success).toBe(false);
    expect(AisleSchema.safeParse({ ...base, scaffali: [{ immagine: { alt: "x" } }] }).success).toBe(false);
  });
  it("le foto scaffali presenti puntano a file WebP esistenti", () => {
    const aisles = AisleSchema.array().parse(aislesJson);
    for (const image of aisles.flatMap((a) => a.scaffali.map((s) => s.immagine))) {
      expect(image.src).toMatch(/\.webp$/);
      const bytes = readFileSync(join(process.cwd(), "public", image.src));
      expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
      expect(bytes.toString("ascii", 8, 12)).toBe("WEBP");
    }
  });
});
