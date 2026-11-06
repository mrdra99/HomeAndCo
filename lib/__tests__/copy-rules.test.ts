import { describe, expect, it } from "vitest";
import aislesJson from "../../content/aisles.json";
import campaignsJson from "../../content/campaigns.json";
import navigationJson from "../../content/navigation.json";
import pagesJson from "../../content/pages.json";
import homeJson from "../../content/home.json";
import settingsJson from "../../content/settings.json";
import { AisleSchema, CampaignSchema, NavigationSchema } from "../content/schemas";

const all = JSON.stringify({ aislesJson, navigationJson, pagesJson, homeJson, settingsJson });

describe("regole di copy", () => {
  it("nessun testo promette un modulo senza adattatore, ne' parla di condizioni non confermate", () => {
    expect(all).not.toMatch(/non confermat|non sono ancora pubblicat|Tre scaffali del reparto|Vieni a trovarci, ti aspettiamo/i);
    expect(pagesJson.contatti.intro).not.toMatch(/modulo/i);
    expect(pagesJson.cartaFedelta.domande.testo).not.toMatch(/modulo/i);
  });
  it("Natale: nessun «alberi» nei testi e la prima idea porta a Feste e idee regalo", () => {
    const natale = CampaignSchema.array().parse(campaignsJson).find((c) => c.id === "natale-2026")!;
    expect(JSON.stringify(natale)).not.toMatch(/alberi/i);
    expect(natale.titolo).toBe("Natale da Home & Co.");
    expect(natale.collezione!.titolo).toBe("Natale: da dove partire");
    expect(natale.collezione!.idee.map((i) => i.titolo)).toEqual([
      "Addobbi e decorazioni", "Regali e confezioni", "La tavola delle feste", "Tessili per la casa", "Luce in casa",
    ]);
    expect(natale.collezione!.idee[0].corridoio).toBe("feste-e-regalo");
    const slugs = AisleSchema.array().parse(aislesJson).map((a) => a.slug);
    for (const idea of natale.collezione!.idee) expect(slugs).toContain(idea.corridoio);
  });
  it("le introduzioni degli scaffali sono tutte diverse tra loro", () => {
    const intros = AisleSchema.array().parse(aislesJson).map((a) => a.scaffaliIntro).filter(Boolean);
    expect(new Set(intros).size).toBe(intros.length);
  });
  it("«Carta fedeltà» non e' nel menu principale ne' nella tab bar; resta nel footer", () => {
    const nav = NavigationSchema.parse(navigationJson);
    const carta = nav.find((i) => i.href === "/carta-fedelta/")!;
    expect(carta.soloPiede).toBe(true);
    expect(settingsJson.testata.tab.map((t) => t.href)).not.toContain("/carta-fedelta/");
    expect(settingsJson.testata.tab.map((t) => t.href)).toContain("/contatti/");
  });
});
