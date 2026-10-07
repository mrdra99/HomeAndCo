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

/** Attiva alla data indicata (estremi inclusivi). Una data mancante = intervallo aperto. */
export function isCampaignActive(c: Campaign, date: Date = new Date()): boolean {
  if (isDefaultCampaign(c)) return false;
  const today = toIsoDate(date);
  if (c.inizio && today < c.inizio) return false;
  if (c.fine && today > c.fine) return false;
  return true;
}

/**
 * Sceglie la campagna da mostrare: tra le attive vince la priorità più alta,
 * a parità l'inizio più recente. Se nessuna è attiva: la campagna di default
 * (senza date); in mancanza anche di questa, la prima della lista.
 */
export function pickCampaign(campaigns: Campaign[], date: Date = new Date()): Campaign {
  const active = campaigns
    .filter((c) => isCampaignActive(c, date))
    .sort(
      (a, b) =>
        b.priorita - a.priorita || (b.inizio ?? "").localeCompare(a.inizio ?? ""),
    );
  if (active[0]) return active[0];
  const fallback = campaigns.find(isDefaultCampaign) ?? campaigns[0];
  if (!fallback) throw new Error("Nessuna campagna definita in content/campaigns.json");
  return fallback;
}

/** Variabili CSS del tema per la campagna (da applicare su <html> o su un wrapper). */
export function campaignCssVars(c: Campaign): Record<string, string> {
  return {
    "--accent": c.accento,
    // sfumatura tenue per fondi/chip: accento al 12% su trasparente
    "--accent-soft": `color-mix(in srgb, ${c.accento} 12%, transparent)`,
    "--accent-contrast": "#ffffff",
  };
}

/** Stringa `style` inline ("--accent:#...;...") utile in <html style> o in script anti-flash. */
export function campaignCssText(c: Campaign): string {
  return Object.entries(campaignCssVars(c))
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}
