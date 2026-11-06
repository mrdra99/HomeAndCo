import { describe, expect, it } from "vitest";
import { CampaignSchema, type AisleHighlight } from "../content/schemas";
import { featuredIdeasForCampaign } from "../featured-ideas";

const halloween = CampaignSchema.parse({
  id: "halloween", titolo: "Halloween", etichetta: "Speciale Halloween",
  cta: { label: "Scopri", href: "/" },
});
const idea = (titolo: string, campagne?: string[]): AisleHighlight => ({ titolo, descrizione: "", immagine: { src: null, alt: "" }, campagne });

describe("idee e prodotti in evidenza per campagna", () => {
  const items = [idea("Sempre"), idea("Solo Halloween", ["halloween"]), idea("Solo Natale", ["natale"])];
  it("mostra prima la selezione dell'evento con il suo badge, poi le idee generiche", () => {
    const result = featuredIdeasForCampaign(items, halloween);
    expect(result.map((item) => item.titolo)).toEqual(["Solo Halloween", "Sempre"]);
    expect(result[0].badge).toBe("Speciale Halloween");
    expect(result[1].badge).toBeUndefined();
  });
  it("rimuove la selezione stagionale fuori dall'evento e non modifica i contenuti", () => {
    expect(featuredIdeasForCampaign(items, { ...halloween, id: "default" }).map((item) => item.titolo)).toEqual(["Sempre"]);
    expect(items[1].badge).toBeUndefined();
  });
});
