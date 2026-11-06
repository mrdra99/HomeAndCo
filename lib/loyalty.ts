import type { LoyaltyProgram } from "./content/schemas";

/** La carta fedelta' ha "fatti reali" solo se il contenuto ha vantaggi, passaggi, costo o regolamento. */
export function isLoyaltyFilled(loyalty: Pick<LoyaltyProgram, "vantaggi" | "passi" | "costo" | "regolamento">): boolean {
  return loyalty.vantaggi.length > 0 || loyalty.passi.length > 0 || Boolean(loyalty.costo) || Boolean(loyalty.regolamento);
}
