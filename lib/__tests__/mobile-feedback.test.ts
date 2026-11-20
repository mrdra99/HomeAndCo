import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import aislesJson from "../../content/aisles.json";
import campaignsJson from "../../content/campaigns.json";
import homeJson from "../../content/home.json";
import pagesJson from "../../content/pages.json";
import { pickCampaign } from "../campaigns";
import { AisleSchema, CampaignSchema, HomeCopySchema } from "../content/schemas";
import { isSharpAt, MOBILE_HERO_MAX_CSS_WIDTH } from "../image-rules";
import { seasonalMenu } from "../navigation";

/** Mobile che riprende il desktop (20/11/2026, blocchi A e B): le regole che i contenuti devono rispettare. */
const campaigns = CampaignSchema.array().parse(campaignsJson);
const home = HomeCopySchema.parse(homeJson);
const d = (iso: string) => new Date(`${iso}T12:00:00Z`);

describe("gruppo di stagione (barra desktop e pannello Reparti mobile)", () => {
  it("a Natale elenca tutte le idee della collezione, anche quelle sullo stesso reparto", () => {
    const natale = pickCampaign(campaigns, d("2026-12-10"));
    const group = seasonalMenu(natale)!;
    expect(group.titolo).toBe(natale.collezione!.titoloGrande);
    expect(group.items.map((i) => i.label)).toEqual(natale.collezione!.idee.map((i) => i.titolo));
    expect(group.items.every((i) => i.href.startsWith("/corridoi/") && i.href.endsWith("/"))).toBe(true);
    // Le chiavi delle voci sono href + label: devono restare uniche anche se due idee portano allo stesso reparto.
    const keys = group.items.map((i) => `${i.href}|${i.label}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
  it("una campagna senza collezione non ha gruppo di stagione", () => {
    const natale = pickCampaign(campaigns, d("2026-12-10"));
    expect(seasonalMenu({ ...natale, collezione: undefined })).toBeNull();
  });
});

describe("hero scorrevole mobile: le slide del banner", () => {
  it("i segnaposti restano solo al desktop", () => {
    const placeholders = home.banner.slide.filter((s) => s.titolo?.includes("(segnaposto)") || !s.immagine.src);
    expect(placeholders.every((s) => s.soloDesktop)).toBe(true);
  });
});

describe("testata mobile di reparti e volantino", () => {
  const width = async (src: string) => (await sharp(join(process.cwd(), "public", src)).metadata()).width ?? 0;
  it("le foto dei reparti con testata larga restano nitide quando coprono tutto il telefono", async () => {
    const aisles = AisleSchema.array().parse(aislesJson).filter((a) => a.immagineWide);
    expect(aisles.length).toBeGreaterThan(0);
    for (const a of aisles) {
      expect(isSharpAt(await width(a.immagine.src!), MOBILE_HERO_MAX_CSS_WIDTH), a.immagine.src!).toBe(true);
    }
  });
  it("la foto della pagina del volantino resta nitida sul telefono", async () => {
    const src = (pagesJson as { offerte: { immagineWide?: { src: string } } }).offerte.immagineWide?.src;
    if (src) expect(isSharpAt(await width(src), MOBILE_HERO_MAX_CSS_WIDTH), src).toBe(true);
  });
});
