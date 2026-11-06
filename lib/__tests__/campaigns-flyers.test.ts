import { describe, expect, it } from "vitest";
import { campaignPeriod, pickCampaign, toIsoDate } from "../campaigns";
import { CampaignSchema, isoDate } from "../content/schemas";
import { formatDateRangeIt, sortFlyersRecentFirst, currentFlyers, archivedFlyers } from "../flyers";
import { isOpenNow } from "../stores";
import type { Campaign, Flyer } from "../content/schemas";

const base = {
  sottotitolo: "",
  immagineHero: { src: null, alt: "" },
  tema: "default",
  cta: { label: "x", href: "/" },
  corridoiInEvidenza: [],
  provvisorio: false,
};
const camp = (id: string, inizio: string | null, fine: string | null, priorita = 0): Campaign => ({
  ...base, id, titolo: id, inizio, fine, priorita,
});
// mezzogiorno UTC: stesso giorno a Roma
const d = (iso: string) => new Date(`${iso}T12:00:00Z`);

describe("pickCampaign", () => {
  const list = [
    camp("default", null, null),
    camp("halloween", "2026-10-01", "2026-11-01", 10),
    camp("natale", "2026-11-27", "2027-01-06", 10),
  ];
  it("usa il default fuori dalle campagne", () => {
    expect(pickCampaign(list, d("2026-09-30")).id).toBe("default");
  });
  it("estremi inclusivi", () => {
    expect(pickCampaign(list, d("2026-10-01")).id).toBe("halloween");
    expect(pickCampaign(list, d("2026-11-01")).id).toBe("halloween");
    expect(pickCampaign(list, d("2026-11-02")).id).toBe("default");
    expect(pickCampaign(list, d("2027-01-06")).id).toBe("natale");
  });
  it("sovrapposizione: vince la priorità, poi l'inizio più recente", () => {
    const l = [...list, camp("flash", "2026-10-10", "2026-10-12", 50), camp("tardi", "2026-10-05", "2026-10-20", 10)];
    expect(pickCampaign(l, d("2026-10-11")).id).toBe("flash");
    expect(pickCampaign(l, d("2026-10-06")).id).toBe("tardi");
  });
});

describe("date delle campagne", () => {
  const annualHalloween: Campaign = { ...camp("halloween-annuale", "2026-10-01", "2026-11-01", 10), ricorrenza: "annuale" };
  const annualChristmas: Campaign = { ...camp("natale-annuale", "2026-11-27", "2027-01-06", 10), ricorrenza: "annuale" };
  const fallback = camp("default", null, null);
  const recurring = [fallback, annualHalloween, annualChristmas];

  it("ripete Halloween negli anni successivi, con estremi inclusi", () => {
    for (const year of [2026, 2027, 2028, 2030]) {
      expect(pickCampaign(recurring, d(`${year}-09-30`)).id).toBe("default");
      expect(pickCampaign(recurring, d(`${year}-10-01`)).id).toBe("halloween-annuale");
      expect(pickCampaign(recurring, d(`${year}-11-01`)).id).toBe("halloween-annuale");
      expect(pickCampaign(recurring, d(`${year}-11-02`)).id).toBe("default");
      expect(campaignPeriod(annualHalloween, `${year}-10-16`)).toEqual({ inizio: `${year}-10-01`, fine: `${year}-11-01` });
    }
  });
  it("risolve Natale attraverso il cambio anno e non ripete eventi senza ricorrenza", () => {
    expect(pickCampaign(recurring, d("2028-01-06")).id).toBe("natale-annuale");
    expect(pickCampaign(recurring, d("2028-01-07")).id).toBe("default");
    expect(campaignPeriod(annualChristmas, "2028-01-06")).toEqual({ inizio: "2027-11-27", fine: "2028-01-06" });
    const oneOff = camp("una-volta", "2026-10-10", "2026-10-20", 50);
    expect(pickCampaign([...recurring, oneOff], d("2026-10-16")).id).toBe("una-volta");
    expect(pickCampaign([...recurring, oneOff], d("2027-10-16")).id).toBe("halloween-annuale");
  });
  it("richiede entrambe le date per la ricorrenza e confronta gli inizi risolti", () => {
    expect(CampaignSchema.safeParse({ ...annualHalloween, fine: null }).success).toBe(false);
    const flash = camp("flash-2028", "2028-10-10", "2028-10-20", 10);
    expect(pickCampaign([...recurring, flash], d("2028-10-16")).id).toBe("flash-2028");
  });
  it("valida il calendario, inclusi gli anni bisestili", () => {
    expect(isoDate.safeParse("2026-02-30").success).toBe(false);
    expect(isoDate.safeParse("2026-02-29").success).toBe(false);
    expect(isoDate.safeParse("2028-02-29").success).toBe(true);
    expect(isoDate.safeParse("2026-13-01").success).toBe(false);
  });
  it("usa il giorno italiano, anche quando UTC è ancora al giorno prima", () => {
    expect(toIsoDate(new Date("2026-09-30T22:00:00Z"))).toBe("2026-10-01");
    expect(toIsoDate(new Date("2026-11-01T22:59:59Z"))).toBe("2026-11-01");
    expect(toIsoDate(new Date("2026-11-01T23:00:00Z"))).toBe("2026-11-02");
  });
});

const fl = (id: string, dal: string, al: string): Flyer => ({
  id, titolo: id, validoDal: dal, validoAl: al, negozi: "tutti", pagine: [], pdf: null,
  copertina: { src: null, alt: "" }, provvisorio: false,
});

describe("volantini", () => {
  const list = [fl("a", "2026-09-01", "2026-09-30"), fl("b", "2026-10-01", "2026-10-31"), fl("c", "2026-10-15", "2026-11-15")];
  it("ordina dal più recente", () => {
    expect(sortFlyersRecentFirst(list).map((f) => f.id)).toEqual(["c", "b", "a"]);
  });
  it("correnti e archivio", () => {
    expect(currentFlyers(list, d("2026-10-20")).map((f) => f.id)).toEqual(["c", "b"]);
    expect(archivedFlyers(list, d("2026-10-20")).map((f) => f.id)).toEqual(["a"]);
  });
  it("formatta le date in italiano", () => {
    expect(formatDateRangeIt("2026-10-01", "2026-10-31")).toBe("dal 1 al 31 ottobre 2026");
    expect(formatDateRangeIt("2026-11-27", "2027-01-06")).toBe("dal 27 novembre 2026 al 6 gennaio 2027");
  });
});

describe("isOpenNow", () => {
  it("null senza orari", () => {
    expect(isOpenNow({ orari: null })).toBeNull();
  });
  it("true nella fascia, false fuori", () => {
    const orari = [{ giorno: 3, aperture: [{ da: "09:00", a: "19:00" }] }]; // mercoledì
    expect(isOpenNow({ orari }, new Date("2026-10-07T10:00:00Z"))).toBe(true); // 12:00 Roma
    expect(isOpenNow({ orari }, new Date("2026-10-07T18:00:00Z"))).toBe(false); // 20:00 Roma
  });
});
