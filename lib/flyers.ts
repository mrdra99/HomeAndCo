import type { Flyer } from "./content/schemas";
import { toIsoDate } from "./campaigns";

/** Funzioni PURE su validità, ordinamento e formattazione date dei volantini. */

const MESI = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

function parts(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m: m - 1, d };
}

/** "1 ottobre 2026" */
export function formatDateIt(iso: string | null): string {
  if (!iso) return "Data non indicata";
  const { y, m, d } = parts(iso);
  return `${d} ${MESI[m]} ${y}`;
}

/**
 * Intervallo in italiano:
 * "dal 1 al 31 ottobre 2026" | "dal 27 novembre 2026 al 6 gennaio 2027" | "il 5 ottobre 2026"
 */
export function formatDateRangeIt(dal: string | null, al: string | null): string {
  if (!dal || !al) return "Date non indicate";
  if (dal === al) return `il ${formatDateIt(dal)}`;
  const a = parts(dal);
  const b = parts(al);
  if (a.y === b.y && a.m === b.m) return `dal ${a.d} al ${b.d} ${MESI[b.m]} ${b.y}`;
  if (a.y === b.y) return `dal ${a.d} ${MESI[a.m]} al ${b.d} ${MESI[b.m]} ${b.y}`;
  return `dal ${formatDateIt(dal)} al ${formatDateIt(al)}`;
}

function isFlyerCurrent(f: Flyer, date: Date = new Date()): boolean {
  const t = toIsoDate(date);
  return !f.archiviato && Boolean(f.validoDal && f.validoAl && f.validoDal <= t && t <= f.validoAl);
}

export function isFlyerUpcoming(f: Flyer, date: Date = new Date()): boolean {
  return !f.archiviato && Boolean(f.validoDal && f.validoDal > toIsoDate(date));
}

function isFlyerExpired(f: Flyer, date: Date = new Date()): boolean {
  return f.archiviato === true || Boolean(f.validoAl && f.validoAl < toIsoDate(date));
}

/** Ordina dal più recente (validoDal desc, poi validoAl desc). Non muta l'input. */
export function sortFlyersRecentFirst(flyers: Flyer[]): Flyer[] {
  return [...flyers].sort(
    (a, b) => (b.validoDal ?? "").localeCompare(a.validoDal ?? "") || (b.validoAl ?? "").localeCompare(a.validoAl ?? ""),
  );
}

/** Volantini validi oggi, dal più recente. */
export function currentFlyers(flyers: Flyer[], date: Date = new Date()): Flyer[] {
  return sortFlyersRecentFirst(flyers.filter((f) => isFlyerCurrent(f, date)));
}

/** Anteprime, dalla data di inizio più vicina. Le offerte non sono ancora attive. */
export function upcomingFlyers(flyers: Flyer[], date: Date = new Date()): Flyer[] {
  return flyers.filter((f) => isFlyerUpcoming(f, date)).sort((a, b) => (a.validoDal ?? "").localeCompare(b.validoDal ?? ""));
}

/** Volantini scaduti (archivio), dal più recente. I futuri non compaiono. */
export function archivedFlyers(flyers: Flyer[], date: Date = new Date()): Flyer[] {
  return sortFlyersRecentFirst(flyers.filter((f) => isFlyerExpired(f, date)));
}

/** Il volantino vale nel negozio indicato? */
export function flyerAppliesToStore(f: Flyer, storeId: string): boolean {
  return f.negozi === "tutti" || f.negozi.includes(storeId);
}

export type HomeFlyerStatus = "current" | "upcoming" | "latest";

/** Ultima edizione scelta dal cliente: le date restano quelle stampate sul volantino. */
export function featuredFlyer(flyers: Flyer[], date: Date = new Date()): Flyer | null {
  const today = toIsoDate(date);
  const published = sortFlyersRecentFirst(flyers.filter((f) => f.validoDal && f.validoDal <= today));
  // Dopo la pubblicazione di un'edizione più recente, quella vecchia non torna in primo piano.
  const latest = published[0];
  return latest?.inPrimoPiano && !latest.archiviato ? latest : null;
}

/** In corso, poi anteprima, altrimenti ultima edizione ufficiale scelta dal cliente. */
export function homeFlyer(flyers: Flyer[], date: Date = new Date()): { flyer: Flyer; status: HomeFlyerStatus } | null {
  const current = currentFlyers(flyers, date)[0];
  if (current) return { flyer: current, status: "current" };
  const upcoming = upcomingFlyers(flyers, date)[0];
  if (upcoming) return { flyer: upcoming, status: "upcoming" };
  const featured = featuredFlyer(flyers, date);
  return featured ? { flyer: featured, status: "latest" } : null;
}

/**
 * Stato del blocco grande del tabellone in home: con un volantino in corso o in arrivo lo mostra il blocco
 * grande ("flyer"); per l’ultima edizione già conclusa resta la campagna fotografica ("campaign").
 */
export type BoardMode = "flyer" | "campaign";
export function boardMode(flyers: Flyer[], date: Date = new Date()): BoardMode {
  const found = homeFlyer(flyers, date);
  return found && found.status !== "latest" ? "flyer" : "campaign";
}

/** Volantino da consultare per il negozio: in corso, anteprima o ultima edizione ufficiale di quella sede. */
export function storeFlyer(flyers: Flyer[], storeId: string, date: Date = new Date()): { flyer: Flyer; status: HomeFlyerStatus } | null {
  return homeFlyer(flyers.filter((f) => flyerAppliesToStore(f, storeId)), date);
}

/** Negozi a cui vale il volantino, in forma testuale ("Prato e Lucca"); null se vale ovunque. */
export function flyerStoreNames(f: Flyer, stores: { id: string; citta: string }[]): string | null {
  if (f.negozi === "tutti") return null;
  const names = stores.filter((s) => (f.negozi as string[]).includes(s.id)).map((s) => s.citta);
  if (names.length === 0) return null;
  return names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`;
}
