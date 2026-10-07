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
export function formatDateIt(iso: string): string {
  const { y, m, d } = parts(iso);
  return `${d} ${MESI[m]} ${y}`;
}

/**
 * Intervallo in italiano:
 * "dal 1 al 31 ottobre 2026" | "dal 27 novembre 2026 al 6 gennaio 2027" | "il 5 ottobre 2026"
 */
export function formatDateRangeIt(dal: string, al: string): string {
  if (dal === al) return `il ${formatDateIt(dal)}`;
  const a = parts(dal);
  const b = parts(al);
  if (a.y === b.y && a.m === b.m) return `dal ${a.d} al ${b.d} ${MESI[b.m]} ${b.y}`;
  if (a.y === b.y) return `dal ${a.d} ${MESI[a.m]} al ${b.d} ${MESI[b.m]} ${b.y}`;
  return `dal ${formatDateIt(dal)} al ${formatDateIt(al)}`;
}

export function isFlyerCurrent(f: Flyer, date: Date = new Date()): boolean {
  const t = toIsoDate(date);
  return f.validoDal <= t && t <= f.validoAl;
}

export function isFlyerUpcoming(f: Flyer, date: Date = new Date()): boolean {
  return f.validoDal > toIsoDate(date);
}

export function isFlyerExpired(f: Flyer, date: Date = new Date()): boolean {
  return f.validoAl < toIsoDate(date);
}

/** Ordina dal più recente (validoDal desc, poi validoAl desc). Non muta l'input. */
export function sortFlyersRecentFirst(flyers: Flyer[]): Flyer[] {
  return [...flyers].sort(
    (a, b) => b.validoDal.localeCompare(a.validoDal) || b.validoAl.localeCompare(a.validoAl),
  );
}

/** Volantini validi oggi, dal più recente. */
export function currentFlyers(flyers: Flyer[], date: Date = new Date()): Flyer[] {
  return sortFlyersRecentFirst(flyers.filter((f) => isFlyerCurrent(f, date)));
}

/** Volantini scaduti (archivio), dal più recente. I futuri non compaiono. */
export function archivedFlyers(flyers: Flyer[], date: Date = new Date()): Flyer[] {
  return sortFlyersRecentFirst(flyers.filter((f) => isFlyerExpired(f, date)));
}

/** Il volantino vale nel negozio indicato? */
export function flyerAppliesToStore(f: Flyer, storeId: string): boolean {
  return f.negozi === "tutti" || f.negozi.includes(storeId);
}
