import { describe, expect, it } from "vitest";
import campaignsJson from "../../content/campaigns.json";
import flyersJson from "../../content/flyers.json";
import storesJson from "../../content/stores.json";
import { CampaignSchema, FlyerSchema, StoreSchema } from "../content/schemas";
import { pickCampaign } from "../campaigns";
import { archivedFlyers, currentFlyers, flyerAppliesToStore, upcomingFlyers } from "../flyers";
import { isOpenNow } from "../stores";

const campaigns = CampaignSchema.array().parse(campaignsJson);
const flyers = FlyerSchema.array().parse(flyersJson);
const stores = StoreSchema.array().parse(storesJson);
const id = "sesto-ottobre-2026";

describe("catalogo ottobre fornito dal cliente", () => {
  it("resta un'anteprima fino alla mezzanotte italiana del 23 ottobre", () => {
    const before = new Date("2026-10-22T21:59:59Z");
    expect(upcomingFlyers(flyers, before)[0].id).toBe(id);
    expect(currentFlyers(flyers, before).some((f) => f.id === id)).toBe(false);
    expect(currentFlyers(flyers, new Date("2026-10-22T22:00:00Z"))[0].id).toBe(id);
  });
  it("scade il 1 novembre incluso e non diventa una promozione ricorrente", () => {
    expect(currentFlyers(flyers, new Date("2026-11-01T22:59:59Z"))[0].id).toBe(id);
    const after = new Date("2026-11-01T23:00:00Z");
    expect(currentFlyers(flyers, after)).toEqual([]);
    expect(archivedFlyers(flyers, after)[0].id).toBe(id);
    expect(currentFlyers(flyers, new Date("2027-10-23T12:00:00Z"))).toEqual([]);
  });
  it("attribuisce il catalogo a Sesto, senza estendere i prezzi agli altri negozi", () => {
    const flyer = flyers.find((f) => f.id === id)!;
    expect(flyer.pagine).toHaveLength(8);
    expect(flyerAppliesToStore(flyer, "sesto-fiorentino")).toBe(true);
    expect(flyerAppliesToStore(flyer, "prato")).toBe(false);
    expect(flyerAppliesToStore(flyer, "lucca")).toBe(false);
  });
});

describe("calendario annuale confermato da Alessandro", () => {
  it("passa da Halloween a Natale il 1 novembre e torna al tema base il 1 gennaio", () => {
    for (const year of [2026, 2027, 2028]) {
      expect(pickCampaign(campaigns, new Date(`${year}-10-31T12:00:00Z`)).tema).toBe("halloween");
      expect(pickCampaign(campaigns, new Date(`${year}-11-01T12:00:00Z`)).tema).toBe("natale");
      expect(pickCampaign(campaigns, new Date(`${year}-12-31T12:00:00Z`)).tema).toBe("natale");
      expect(pickCampaign(campaigns, new Date(`${year + 1}-01-01T12:00:00Z`)).tema).toBe("default");
    }
  });
});

describe("orari continuati confermati, domeniche e festivi inclusi", () => {
  it("mantiene una fascia unica tutti i sette giorni", () => {
    for (const store of stores) {
      const slot = store.id === "sesto-fiorentino" ? { da: "08:30", a: "19:30" } : { da: "09:00", a: "20:00" };
      expect(store.orari?.map((d) => d.giorno).sort()).toEqual([0, 1, 2, 3, 4, 5, 6]);
      for (const day of store.orari!) expect(day.aperture).toEqual([slot]);
      expect(isOpenNow(store, new Date("2026-12-25T11:00:00Z"))).toBe(true);
    }
  });
  it("calcola correttamente apertura e chiusura a Sesto nel fuso italiano", () => {
    const store = stores.find((s) => s.id === "sesto-fiorentino")!;
    expect(isOpenNow(store, new Date("2026-10-19T06:29:59Z"))).toBe(false);
    expect(isOpenNow(store, new Date("2026-10-19T06:30:00Z"))).toBe(true);
    expect(isOpenNow(store, new Date("2026-10-19T17:29:59Z"))).toBe(true);
    expect(isOpenNow(store, new Date("2026-10-19T17:30:00Z"))).toBe(false);
  });
});
