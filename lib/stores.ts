import type { OpeningDay, Store } from "./content/schemas";

/** Helper PURI sugli orari dei negozi. Tutti null-safe: orari null = dato non disponibile. */

const TZ = "Europe/Rome";
const GIORNI = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
const GIORNI_BREVI = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Giorno della settimana (0=domenica) e minuti dall'inizio del giorno, nel fuso italiano. */
function romeNow(date: Date): { day: number; minutes: number } {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function hasOpeningHours(store: Pick<Store, "orari">): boolean {
  return Array.isArray(store.orari) && store.orari.length > 0;
}

/**
 * true/false se gli orari sono noti, null se non disponibili
 * (in tal caso la UI NON deve mostrare "Aperto/Chiuso").
 */
export function isOpenNow(store: Pick<Store, "orari">, date: Date = new Date()): boolean | null {
  if (!hasOpeningHours(store)) return null;
  const { day, minutes } = romeNow(date);
  const today = store.orari!.find((o) => o.giorno === day);
  if (!today) return false;
  return today.aperture.some((s) => minutes >= toMinutes(s.da) && minutes < toMinutes(s.a));
}

/** "09:00-13:00, 15:30-19:30" oppure "Chiuso". */
export function formatDaySlots(day: OpeningDay): string {
  if (day.aperture.length === 0) return "Chiuso";
  return day.aperture.map((s) => `${s.da}-${s.a}`).join(", ");
}

export interface FormattedHoursRow {
  giorno: number;
  etichetta: string; // "lunedì"
  etichettaBreve: string; // "Lun"
  testo: string; // "09:00-19:30" | "Chiuso"
}

/** Righe lun->dom per la tabella orari; [] se orari non disponibili. */
export function formatOpeningHours(store: Pick<Store, "orari">): FormattedHoursRow[] {
  if (!hasOpeningHours(store)) return [];
  return [1, 2, 3, 4, 5, 6, 0].map((g) => {
    const d = store.orari!.find((o) => o.giorno === g);
    return {
      giorno: g,
      etichetta: GIORNI[g],
      etichettaBreve: GIORNI_BREVI[g],
      testo: d ? formatDaySlots(d) : "Chiuso",
    };
  });
}

/** Indirizzo su una riga: "Viale G. Marconi 38, 59100 Prato (PO)". */
export function formatAddress(store: Pick<Store, "indirizzo">): string {
  const a = store.indirizzo;
  return `${a.via}, ${a.cap} ${a.citta} (${a.provincia})`;
}

/** Link "indicazioni" Google Maps senza chiavi API. */
export function directionsUrl(store: Pick<Store, "coordinate">): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${store.coordinate.lat},${store.coordinate.lng}`;
}

/** Embed OpenStreetMap (iframe) senza chiavi API. */
export function osmEmbedUrl(store: Pick<Store, "coordinate">, delta = 0.004): string {
  const { lat, lng } = store.coordinate;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

/** Link tel: dal numero (null se assente). */
export function telHref(telefono: string | null): string | null {
  if (!telefono) return null;
  return `tel:${telefono.replace(/[^\d+]/g, "")}`;
}
