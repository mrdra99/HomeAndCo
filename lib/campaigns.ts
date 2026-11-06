import type { Campaign } from "./content/schemas";

/**
 * Logica PURA delle campagne: nessun accesso a file/DOM, usabile sia in build (server)
 * sia nel client (ricontrollo della data senza flash).
 */

const TZ = "Europe/Rome";

/** Data ISO (YYYY-MM-DD) del giorno corrente nel fuso italiano. */
export function toIsoDate(date: Date = new Date()): string {
  // "en-CA" produce YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Campagna di default = senza date. */
export function isDefaultCampaign(c: Campaign): boolean {
  return !c.inizio && !c.fine;
}

/** Risolve la ricorrenza nell'anno corrente, anche per intervalli novembre-gennaio. */
export function campaignPeriod(c: Campaign, today: string): { inizio: string | null; fine: string | null } {
  if (c.ricorrenza !== "annuale" || !c.inizio || !c.fine) return { inizio: c.inizio, fine: c.fine };
  const start = c.inizio.slice(5);
  const end = c.fine.slice(5);
  const crossesYear = start > end;
  const year = Number(today.slice(0, 4)) - (crossesYear && today.slice(5) < start ? 1 : 0);
  return { inizio: `${year}-${start}`, fine: `${year + (crossesYear ? 1 : 0)}-${end}` };
}

/** Attiva alla data indicata (estremi inclusivi). Una data mancante = intervallo aperto. */
export function isCampaignActive(c: Campaign, date: Date = new Date()): boolean {
  if (isDefaultCampaign(c)) return false;
  const today = toIsoDate(date);
  const { inizio, fine } = campaignPeriod(c, today);
  if (inizio && today < inizio) return false;
  if (fine && today > fine) return false;
  return true;
}

/**
 * Sceglie la campagna da mostrare: tra le attive vince la priorità più alta,
 * a parità l'inizio più recente. Se nessuna è attiva: la campagna di default
 * (senza date); in mancanza anche di questa, la prima della lista.
 */
export function pickCampaign(campaigns: Campaign[], date: Date = new Date()): Campaign {
  const today = toIsoDate(date);
  const active = campaigns
    .filter((c) => isCampaignActive(c, date))
    .sort(
      (a, b) =>
        b.priorita - a.priorita || (campaignPeriod(b, today).inizio ?? "").localeCompare(campaignPeriod(a, today).inizio ?? ""),
    );
  if (active[0]) return active[0];
  const fallback = campaigns.find(isDefaultCampaign) ?? campaigns[0];
  if (!fallback) throw new Error("Nessuna campagna definita in content/campaigns.json");
  return fallback;
}
