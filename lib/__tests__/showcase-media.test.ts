import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import home from "../../content/home.json";
import flyers from "../../content/flyers.json";
import { HomeCopySchema, FlyerSchema } from "../content/schemas";
import { archivedFlyers, currentFlyers, upcomingFlyers } from "../flyers";

const file = (path: string) => join(process.cwd(), "public", path);

describe("video e cataloghi forniti dal cliente", () => {
  it("collega le anteprime ai due reel richiesti, senza un player Instagram incorporato", () => {
    const copy = HomeCopySchema.parse(home).social;
    expect(copy.reels.map((r) => r.href)).toEqual([
      "https://www.instagram.com/homeandco.casa/reel/DfFjURSmFmC/",
      "https://www.instagram.com/homeandco.casa/reel/DfVDk6fARQB/",
    ]);
    for (const image of [copy.video.poster, ...copy.reels.map((r) => r.immagine)]) expect(existsSync(file(image.src!))).toBe(true);
    const bytes = readFileSync(file(copy.video.src));
    expect(bytes.toString("ascii", 4, 8)).toBe("ftyp");
    expect(bytes.length).toBeLessThan(25 * 1024 * 1024);
  });
  it("tiene ottobre in archivio con le sue date reali, mai come volantino attuale ne come esempio", () => {
    const all = FlyerSchema.array().parse(flyers);
    const october = all.find((f) => f.id === "sesto-ottobre-2026")!;
    expect(JSON.stringify(flyers)).not.toMatch(/esempio/i);
    expect(october.pagine.length).toBeGreaterThan(0);
    expect(october.validoDal).toBe("2026-10-23");
    expect(october.validoAl).toBe("2026-11-01");
    const now = new Date("2026-11-05T12:00:00Z");
    expect(currentFlyers(all, now)).toEqual([]);
    expect(upcomingFlyers(all, now)).toEqual([]);
    expect(archivedFlyers(all, now).map((f) => f.id)).toEqual(expect.arrayContaining(["sesto-ottobre-2026", "caramelle-halloween"]));
    const sweets = all.find((f) => f.id === "caramelle-halloween")!;
    expect(sweets.validoDal).toBeNull();
    expect(sweets.validoAl).toBeNull();
    expect(sweets.archiviato).toBe(true);
  });
});
