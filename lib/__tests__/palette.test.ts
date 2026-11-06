import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { pickCampaign } from "../campaigns";
import { CampaignSchema } from "../content/schemas";

const read = (...parts: string[]) => readFileSync(join(process.cwd(), ...parts), "utf8");
const campaigns = CampaignSchema.array().parse(JSON.parse(read("content", "campaigns.json")));

describe("palette fissa", () => {
  const css = read("app", "globals.css");
  it("l'accento e' il magenta del logo, scritto una sola volta nel CSS", () => {
    expect(css).toMatch(/--accent:\s*#d11559;/);
    expect(css).not.toMatch(/\[data-theme/);
  });
  it("i dati delle campagne non portano colori propri", () => {
    expect(read("content", "campaigns.json")).not.toMatch(/#[0-9a-fA-F]{6}/);
  });
  it("nessun componente usa colori fuori palette (ambra, arancio, verde WhatsApp)", () => {
    const files = ["components/layout/WhatsAppButton.tsx", "components/aisles/IdeaCard.tsx", "components/campaign/HeroArt.tsx", "app/(site)/carta-fedelta/page.tsx"];
    for (const file of files) expect(read(...file.split("/")), file).not.toMatch(/amber-|orange-|#0f7a43|#ffbd65/i);
  });
});

describe("cambio campagna alla mezzanotte italiana", () => {
  it.each([
    ["2026-09-30T21:59:59Z", "default"],
    ["2026-09-30T22:00:00Z", "halloween-2026"],
    ["2026-10-31T22:59:59Z", "halloween-2026"],
    ["2026-10-31T23:00:00Z", "natale-2026"],
    ["2027-01-06T23:00:00Z", "default"],
  ])("alla data %s vale %s", (timestamp, id) => {
    expect(pickCampaign(campaigns, new Date(timestamp)).id).toBe(id);
  });
});
