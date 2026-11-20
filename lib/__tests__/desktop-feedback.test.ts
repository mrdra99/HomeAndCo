import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import aislesJson from "../../content/aisles.json";
import campaignsJson from "../../content/campaigns.json";
import homeJson from "../../content/home.json";
import navigationJson from "../../content/navigation.json";
import { pickCampaign } from "../campaigns";
import { AisleSchema, CampaignSchema, HomeCopySchema, NavigationSchema } from "../content/schemas";
import { DESKTOP_FULL_BLEED_MIN_WIDTH } from "../image-rules";

/** Feedback del 19/11/2026 sul desktop: le regole che i contenuti devono rispettare. */
const file = (src: string) => join(process.cwd(), "public", src);
const width = async (src: string) => (await sharp(file(src)).metadata()).width ?? 0;
const campaigns = CampaignSchema.array().parse(campaignsJson);
const home = HomeCopySchema.parse(homeJson);
const d = (iso: string) => new Date(`${iso}T12:00:00Z`);

describe("effetti di stagione: decisi dalle date della campagna", () => {
  it("la neve c'e' solo nel periodo di Natale, ogni anno", () => {
    expect(pickCampaign(campaigns, d("2026-12-10")).effetti).toContain("neve");
    expect(pickCampaign(campaigns, d("2027-11-15")).effetti).toContain("neve");
    expect(pickCampaign(campaigns, d("2026-12-26")).effetti).not.toContain("neve");
    expect(pickCampaign(campaigns, d("2026-10-15")).effetti).not.toContain("neve");
  });
  it("un effetto sconosciuto non passa la validazione", () => {
    const natale = (campaignsJson as unknown[]).find((c) => (c as { id: string }).id === "natale-2026")!;
    expect(CampaignSchema.safeParse({ ...(natale as object), effetti: ["fuochi"] }).success).toBe(false);
  });
});

describe("testata desktop dei reparti", () => {
  const aisles = AisleSchema.array().parse(aislesJson).filter((a) => a.visibile);
  it("ogni reparto visibile ha la sua foto larga", () => {
    for (const a of aisles) expect(a.immagineWide?.src, a.slug).toBeTruthy();
  });
  it("le foto larghe restano nitide a tutta larghezza (>= 2880 px)", async () => {
    for (const a of aisles) {
      expect(await width(a.immagineWide!.src), a.slug).toBeGreaterThanOrEqual(DESKTOP_FULL_BLEED_MIN_WIDTH);
    }
  });
});

describe("banner desktop della home", () => {
  it("le slide fotografiche sono larghe abbastanza; quelle senza foto sono segnaposto con etichetta", async () => {
    for (const slide of home.banner.slide) {
      if (slide.immagine.src) expect(await width(slide.immagine.src), slide.immagine.src).toBeGreaterThanOrEqual(DESKTOP_FULL_BLEED_MIN_WIDTH);
      else expect(slide.immagine.label, "segnaposto senza etichetta").toBeTruthy();
    }
  });
  it("le grafiche di campagna, quando ci sono, sono 3:1 e nitide", async () => {
    for (const c of campaigns.filter((c) => c.bannerDesktop)) {
      const meta = await sharp(file(c.bannerDesktop!.src)).metadata();
      expect(meta.width! / meta.height!, c.id).toBeCloseTo(3, 1);
      expect(meta.width, c.id).toBeGreaterThanOrEqual(DESKTOP_FULL_BLEED_MIN_WIDTH);
    }
  });
});

describe("sezione di Natale su desktop", () => {
  const natale = campaigns.find((c) => c.id === "natale-2026")!.collezione!;
  it("ha la parola grande, lo sfondo e le foto del collage, tutti presenti su disco", () => {
    expect(natale.titoloGrande).toBe("Natale");
    for (const src of [natale.sfondo!.src, ...natale.galleria.map((g) => g.src)]) expect(existsSync(file(src)), src).toBe(true);
    expect(natale.galleria.length).toBeGreaterThanOrEqual(2);
  });
});

describe("fascia fatti e barra dei reparti", () => {
  it("su desktop restano 3 fatti, su mobile tutti", () => {
    expect(home.fatti.filter((f) => f.desktop)).toHaveLength(3);
    expect(home.fatti.length).toBeGreaterThanOrEqual(3);
  });
  it("ogni gruppo ha l'etichetta corta per la barra tra 1024 e 1279 px", () => {
    const nav = NavigationSchema.parse(navigationJson);
    for (const g of nav.gruppi) expect(g.breve, g.titolo).toBeTruthy();
  });
});
