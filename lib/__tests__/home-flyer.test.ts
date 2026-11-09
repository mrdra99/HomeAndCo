import { describe, expect, it } from "vitest";
import flyersJson from "../../content/flyers.json";
import loyaltyJson from "../../content/loyalty.json";
import { FlyerSchema, LoyaltyProgramSchema, type Flyer } from "../content/schemas";
import { homeFlyer } from "../flyers";
import { isLoyaltyFilled } from "../loyalty";

const d = (iso: string) => new Date(`${iso}T12:00:00Z`);
const fl = (id: string, dal: string, al: string, extra: Partial<Flyer> = {}): Flyer => ({
  id, titolo: id, validoDal: dal, validoAl: al, negozi: "tutti", pagine: [], pdf: null,
  copertina: { src: "/uploads/flyers/x.webp", alt: "" }, provvisorio: false, ...extra,
});

describe("volantino in home: quale mostrare", () => {
  const list = [fl("ottobre", "2026-10-01", "2026-10-31"), fl("dicembre", "2026-12-04", "2026-12-24")];

  it("con un volantino in corso mostra quello, con stato 'current'", () => {
    expect(homeFlyer(list, d("2026-10-15"))).toMatchObject({ status: "current", flyer: { id: "ottobre" } });
  });
  it("estremi inclusivi: primo e ultimo giorno sono in corso", () => {
    expect(homeFlyer(list, d("2026-10-01"))?.status).toBe("current");
    expect(homeFlyer(list, d("2026-10-31"))?.status).toBe("current");
  });
  it("senza volantino in corso mostra il primo in arrivo, con stato 'upcoming'", () => {
    expect(homeFlyer(list, d("2026-11-06"))).toMatchObject({ status: "upcoming", flyer: { id: "dicembre" } });
  });
  it("con piu' volantini in corso sceglie il piu' recente", () => {
    const l = [fl("a", "2026-10-01", "2026-10-31"), fl("b", "2026-10-20", "2026-11-10")];
    expect(homeFlyer(l, d("2026-10-25"))?.flyer.id).toBe("b");
  });
  it("quando tutti sono conclusi restituisce null: mai la copertina di un volantino scaduto", () => {
    expect(homeFlyer(list, d("2027-01-10"))).toBeNull();
    expect(homeFlyer([fl("vecchio", "2026-10-01", "2026-10-31", { archiviato: true })], d("2026-10-15"))).toBeNull();
    expect(homeFlyer([], d("2026-11-06"))).toBeNull();
  });
  it("mantiene l’ultima edizione ufficiale di ottobre fino al nuovo volantino", () => {
    const all = FlyerSchema.array().parse(flyersJson);
    expect(homeFlyer(all, d("2026-11-06"))).toMatchObject({ status: "latest", flyer: { id: "sesto-ottobre-2026", validoAl: "2026-11-01" } });
    // simulazione: un volantino di dicembre farebbe tornare il riquadro ricco con la copertina
    const withDecember = [...all, fl("natale-2026-test", "2026-12-04", "2026-12-24")];
    expect(homeFlyer(withDecember, d("2026-11-06"))).toMatchObject({ status: "upcoming" });
    expect(homeFlyer(withDecember, d("2026-12-10"))).toMatchObject({ status: "current" });
  });
  it("non prolunga le offerte e non ripropone ottobre dopo un'edizione successiva", () => {
    const october = fl("ottobre", "2026-10-23", "2026-11-01", { inPrimoPiano: true });
    const november = fl("novembre", "2026-11-25", "2026-11-30");
    expect(homeFlyer([october], d("2026-11-09"))).toMatchObject({ status: "latest", flyer: { validoAl: "2026-11-01" } });
    expect(homeFlyer([october, november], d("2026-11-26"))).toMatchObject({ status: "current", flyer: { id: "novembre" } });
    expect(homeFlyer([october, november], d("2026-12-01"))).toBeNull();
  });
});

describe("carta fedelta': il riquadro compare solo con fatti reali", () => {
  it("oggi il contenuto non ha fatti: niente riquadro in home", () => {
    expect(isLoyaltyFilled(LoyaltyProgramSchema.parse(loyaltyJson))).toBe(false);
  });
  it("vantaggi, passi, costo o regolamento bastano", () => {
    const base = { vantaggi: [], passi: [] };
    expect(isLoyaltyFilled({ ...base, costo: "Gratuita" })).toBe(true);
    expect(isLoyaltyFilled({ ...base, regolamento: "Testo" })).toBe(true);
    expect(isLoyaltyFilled({ ...base, passi: ["Chiedi la carta"] })).toBe(true);
    expect(isLoyaltyFilled({ ...base, vantaggi: [{ titolo: "t", testo: "x", icona: "check" }] })).toBe(true);
    expect(isLoyaltyFilled({ ...base, costo: "", regolamento: "" })).toBe(false);
  });
});
