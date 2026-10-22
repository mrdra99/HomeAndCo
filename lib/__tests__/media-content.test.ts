import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { AisleSchema, CampaignSchema, FlyerSchema } from "../content/schemas";
import { currentFlyers } from "../flyers";
import aislesJson from "../../content/aisles.json";
import campaignsJson from "../../content/campaigns.json";
import flyersJson from "../../content/flyers.json";
import sources from "../../content/photo-sources.json";

const localFile = (path: string) => readFileSync(join(process.cwd(), "public", path));

describe("materiali fotografici e volantini autentici", () => {
  it("fornisce fotografie locali valide e una fonte per ogni immagine della vetrina", () => {
    const aisles = AisleSchema.array().parse(aislesJson);
    const campaigns = CampaignSchema.array().parse(campaignsJson);
    const images = [
      ...aisles.flatMap((aisle) => [aisle.immagine, ...aisle.inEvidenza.map((item) => item.immagine)]),
      // Un hero senza foto usa l'illustrazione disegnata del tema (HeroArt), non un segnaposto.
      ...campaigns.flatMap((campaign) => [
        ...(campaign.immagineHero.src === null && campaign.tema !== "default" ? [] : [campaign.immagineHero]),
        ...(campaign.collezione?.idee.map((idea) => idea.immagine) ?? []),
      ]),
    ];
    for (const image of images) {
      expect(image?.src).toBeTruthy();
      const src = image!.src!;
      expect(src).toMatch(/\.webp$/);
      const bytes = localFile(src);
      expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
      expect(bytes.toString("ascii", 8, 12)).toBe("WEBP");
      expect(sources.images.some((entry) => entry.file === src), src).toBe(true);
    }
  });
  it("verifica i PDF ufficiali e tutte le pagine, senza offerte fittizie in corso", () => {
    const flyers = FlyerSchema.array().parse(flyersJson);
    expect(currentFlyers(flyers, new Date("2026-09-20T12:00:00Z"))).toEqual([]);
    for (const flyer of flyers) {
      expect(flyer.provvisorio).toBe(false);
      const source = sources.flyers.find((entry) => entry.file === flyer.pdf)!;
      const bytes = localFile(flyer.pdf!);
      expect(bytes.toString("ascii", 0, 4)).toBe("%PDF");
      expect(bytes.length, "Limite per singolo file di Cloudflare Pages").toBeLessThanOrEqual(25 * 1024 * 1024);
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(source.sha256);
      expect(flyer.pagine).toHaveLength(source.pages);
      for (const page of flyer.pagine) expect(localFile(page.src!).length).toBeGreaterThan(1000);
    }
  });
});
