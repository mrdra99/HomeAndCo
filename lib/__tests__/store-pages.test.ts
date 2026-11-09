import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import flyersJson from "../../content/flyers.json";
import navigationJson from "../../content/navigation.json";
import settingsJson from "../../content/settings.json";
import storesJson from "../../content/stores.json";
import sitemap from "../../app/sitemap";
import { FlyerSchema, NavigationSchema, SettingsSchema, StoreSchema, type Flyer } from "../content/schemas";
import { boardMode, storeFlyer } from "../flyers";
import { DEPARTMENT_CARD_MAX_CSS_WIDTH, isSharpAt } from "../image-rules";
import { groupDepartments } from "../navigation";
import { jsonLdOrganization, jsonLdStore, openingHoursSpecification } from "../seo";
import { sitemapRoutes } from "../sitemap-routes";
import { directionsUrl, hasConfirmedCoordinates, mapUrl, osmEmbedUrl, storePath, streetOnly } from "../stores";

const stores = StoreSchema.array().parse(storesJson);
const settings = SettingsSchema.parse(settingsJson);
const flyers = FlyerSchema.array().parse(flyersJson);
const d = (iso: string) => new Date(`${iso}T12:00:00Z`);
const fl = (id: string, dal: string, al: string, negozi: Flyer["negozi"] = "tutti"): Flyer => ({
  id, titolo: id, validoDal: dal, validoAl: al, negozi, pagine: [], pdf: null,
  copertina: { src: "/uploads/flyers/x.webp", alt: "" }, provvisorio: false,
});

describe("pagine dei negozi", () => {
  it("c'e' una pagina per ogni negozio, con slash finale", () => {
    expect(stores.map(storePath)).toEqual(["/dove-siamo/prato/", "/dove-siamo/lucca/", "/dove-siamo/sesto-fiorentino/"]);
  });
  it("la sitemap contiene l'indice, le tre pagine dei negozi e i reparti", async () => {
    const urls = (await sitemap()).map((e) => new URL(e.url).pathname);
    for (const s of stores) expect(urls).toContain(`/dove-siamo/${s.id}/`);
    expect(urls).toContain("/dove-siamo/");
    expect(urls.filter((u) => u.startsWith("/corridoi/"))).toHaveLength(13);
    expect(new Set(urls).size).toBe(urls.length);
    expect(sitemapRoutes(["a"], ["x"])).toContain("/dove-siamo/x/");
  });
});

describe("dati strutturati", () => {
  it("Organization e' globale e non contiene negozi", () => {
    const org = jsonLdOrganization(settings);
    expect(org["@type"]).toBe("Organization");
    expect(JSON.stringify(org)).not.toMatch(/HomeGoodsStore|OpeningHours/);
  });
  it("ogni negozio ha il proprio HomeGoodsStore con indirizzo e orari, senza geo finche' le coordinate non sono confermate", () => {
    const ids = new Set<string>();
    for (const store of stores) {
      const ld = jsonLdStore(store, settings);
      ids.add(ld["@id"]);
      expect(ld["@type"]).toBe("HomeGoodsStore");
      expect(ld.url).toContain(`/dove-siamo/${store.id}/`);
      expect(ld.address.streetAddress).toBe(streetOnly(store));
      expect(ld.geo).toBeUndefined();
      expect(ld.openingHoursSpecification).toHaveLength(1);
      expect(ld.openingHoursSpecification![0].dayOfWeek).toHaveLength(7);
      expect(ld.telephone).toBeUndefined();
    }
    expect(ids.size).toBe(3);
  });
  it("l'immagine c'e' solo dove esiste la foto del negozio (Lucca), mai una foto di ripiego", () => {
    const byId = Object.fromEntries(stores.map((s) => [s.id, jsonLdStore(s, settings).image]));
    expect(byId.lucca).toMatch(/negozio-lucca-esterno\.webp$/);
    expect(byId.prato).toBeUndefined();
    expect(byId["sesto-fiorentino"]).toBeUndefined();
  });
  it("raggruppa i giorni con le stesse fasce e rispetta orari diversi", () => {
    const spec = openingHoursSpecification({
      orari: [
        { giorno: 1, aperture: [{ da: "09:00", a: "13:00" }, { da: "15:00", a: "19:00" }] },
        { giorno: 2, aperture: [{ da: "09:00", a: "13:00" }] },
        { giorno: 0, aperture: [] },
      ],
    })!;
    expect(spec).toHaveLength(2);
    expect(spec[0]).toMatchObject({ opens: "09:00", closes: "13:00", dayOfWeek: ["Monday", "Tuesday"] });
    expect(openingHoursSpecification({ orari: null })).toBeUndefined();
  });
});

describe("coordinate non confermate dal cliente", () => {
  it("oggi nessun negozio ha le coordinate confermate", () => {
    for (const s of stores) expect(s.coordinateConfermate).toBe(false);
    for (const s of stores) expect(hasConfirmedCoordinates(s)).toBe(false);
  });
  it("«Indicazioni» e «Apri in Google Maps» vanno per indirizzo, mai per coordinate", () => {
    for (const s of stores) {
      const urls = [directionsUrl(s), mapUrl(s), jsonLdStore(s, settings).hasMap];
      for (const url of urls) {
        expect(url).toContain(encodeURIComponent(streetOnly(s)));
        expect(url).toContain(encodeURIComponent(s.indirizzo.citta));
        expect(url).not.toContain(String(s.coordinate.lat));
        expect(url).not.toContain(String(s.coordinate.lng));
        expect(url).not.toMatch(/ex%20Coop|Neto/);
      }
    }
  });
  it("Sesto: la nota «ex Coop Il Neto» resta nel testo visibile, non in streetAddress", () => {
    const sesto = stores.find((s) => s.id === "sesto-fiorentino")!;
    expect(sesto.indirizzo.via).toContain("ex Coop Il Neto");
    expect(jsonLdStore(sesto, settings).address.streetAddress).toBe("Via Giacomo Leopardi 66");
  });
  it("con coordinate confermate tornano geo e la mappa incorporata, senza altro codice", () => {
    const confirmed = { ...stores[0], coordinateConfermate: true };
    expect(hasConfirmedCoordinates(confirmed)).toBe(true);
    expect(jsonLdStore(confirmed, settings).geo).toMatchObject({ latitude: confirmed.coordinate.lat, longitude: confirmed.coordinate.lng });
    expect(osmEmbedUrl(confirmed)).toContain("openstreetmap.org");
    // le indicazioni restano per indirizzo anche con le coordinate confermate
    expect(directionsUrl(confirmed)).not.toContain(String(confirmed.coordinate.lat));
  });
});

describe("volantino nella pagina del negozio", () => {
  it("solo se in corso o in arrivo e valido per quel negozio", () => {
    const list = [fl("sesto", "2026-10-23", "2026-11-01", ["sesto-fiorentino"]), fl("tutti", "2026-12-04", "2026-12-24")];
    expect(storeFlyer(list, "sesto-fiorentino", d("2026-10-25"))).toMatchObject({ status: "current", flyer: { id: "sesto" } });
    expect(storeFlyer(list, "prato", d("2026-10-25"))).toMatchObject({ status: "upcoming", flyer: { id: "tutti" } });
    expect(storeFlyer(list, "prato", d("2026-11-06"))).toMatchObject({ status: "upcoming", flyer: { id: "tutti" } });
    expect(storeFlyer([list[0]], "prato", d("2026-10-25"))).toBeNull();
    expect(storeFlyer(list, "lucca", d("2027-01-10"))).toBeNull();
  });
  it("l'ultima edizione ufficiale di Sesto resta solo sulla pagina di Sesto", () => {
    expect(storeFlyer(flyers, "sesto-fiorentino", d("2026-11-09"))).toMatchObject({ status: "latest", flyer: { id: "sesto-ottobre-2026" } });
    expect(storeFlyer(flyers, "prato", d("2026-11-09"))).toBeNull();
    expect(storeFlyer(flyers, "lucca", d("2026-11-09"))).toBeNull();
  });
});

describe("tabellone in home: blocco grande", () => {
  it("volantino in corso o in arrivo: il blocco grande e' il volantino", () => {
    const list = [fl("ottobre", "2026-10-01", "2026-10-31"), fl("dicembre", "2026-12-04", "2026-12-24")];
    expect(boardMode(list, d("2026-10-15"))).toBe("flyer");
    expect(boardMode(list, d("2026-11-06"))).toBe("flyer");
    expect(boardMode(list, d("2026-10-31"))).toBe("flyer");
  });
  it("nessun volantino utile: resta la campagna (comportamento di oggi)", () => {
    expect(boardMode([], d("2026-11-06"))).toBe("campaign");
    expect(boardMode(flyers, d("2026-11-06"))).toBe("campaign");
    expect(boardMode([{ ...fl("v", "2026-10-01", "2026-10-31"), archiviato: true }], d("2026-10-15"))).toBe("campaign");
    expect(boardMode([fl("v", "2026-10-01", "2026-10-31")], d("2026-11-01"))).toBe("campaign");
  });
  it("sul contenuto reale, il 15 ottobre 2026 il volantino e' in primo piano", () => {
    expect(boardMode(flyers, d("2026-10-15"))).toBe("flyer");
  });
});

describe("schede dei gruppi di reparti in home", () => {
  const nav = NavigationSchema.parse(navigationJson);
  const groups = groupDepartments(nav.voci, nav.gruppi);
  it("sono 5 e ognuno dei 13 reparti e' raggiungibile da un link", () => {
    expect(groups).toHaveLength(5);
    const reachable = groups.flatMap((g) => g.items.map((i) => i.href));
    const departments = nav.voci.filter((v) => v.href.startsWith("/corridoi/")).map((v) => v.href);
    expect(departments).toHaveLength(13);
    expect(new Set(reachable)).toEqual(new Set(departments));
    expect(reachable).toHaveLength(13);
  });
  it("ogni gruppo ha una foto esistente con alt", () => {
    for (const g of groups) {
      expect(g.immagine.alt.length).toBeGreaterThan(10);
      expect(existsSync(join(process.cwd(), "public", g.immagine.src!)), g.immagine.src!).toBe(true);
    }
  });
  it("le foto non sono mai ingrandite oltre la regola (larghezza mostrata <= larghezza reale / 2)", async () => {
    for (const [i, g] of groups.entries()) {
      const width = (await sharp(join(process.cwd(), "public", g.immagine.src!)).metadata()).width ?? 0;
      expect(isSharpAt(width, DEPARTMENT_CARD_MAX_CSS_WIDTH[i]), `${g.titolo}: ${width}px`).toBe(true);
    }
  });
});
