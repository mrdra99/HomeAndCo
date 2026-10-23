import { z } from "zod";

/**
 * Schemi Zod dei contenuti di Home & Co.
 * Convenzioni:
 * - date: stringhe ISO "YYYY-MM-DD" (la data di fine è INCLUSIVA);
 * - immagini: percorso sotto /uploads/<entità>/... oppure null (-> <Placeholder />);
 * - provvisorio: true = testo/dato inventato o da confermare con il cliente.
 */

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data attesa nel formato YYYY-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T12:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "La data deve esistere nel calendario");
export const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Colore atteso nel formato #RRGGBB");
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug non valido");
const provvisorio = z.boolean().default(false);

/** Immagine opzionale: src null/assente -> grafica di ripiego. */
export const ImageSchema = z.object({
  src: z.string().nullable().default(null),
  alt: z.string().default(""),
  /** Etichetta mostrata dal Placeholder quando manca la foto. */
  label: z.string().optional(),
  fit: z.enum(["cover", "contain"]).optional(),
  position: z.string().optional(),
});
export type ImageRef = z.infer<typeof ImageSchema>;

const Cta = z.object({ label: z.string().min(1), href: z.string().min(1) });

// ---------- Campaign ----------
export const CampaignSchema = z
  .object({
    id: z.string().min(1),
    titolo: z.string().min(1),
    sottotitolo: z.string().default(""),
    /** null = campagna di default (sempre valida, priorità minima) */
    inizio: isoDate.nullable().default(null),
    fine: isoDate.nullable().default(null),
    ricorrenza: z.literal("annuale").optional(),
    immagineHero: ImageSchema.default({ src: null, alt: "" }),
    accento: hexColor,
    contrastoAccento: hexColor.optional(),
    accentoTesto: hexColor.optional(),
    tema: z.string().default("default"),
    etichetta: z.string().optional(),
    sticker: z.string().optional(),
    collezione: z.object({
      titolo: z.string().min(1),
      descrizione: z.string(),
      idee: z.array(z.object({
        titolo: z.string().min(1),
        testo: z.string(),
        corridoio: slug,
        icona: z.string(),
        immagine: ImageSchema.optional(),
      })).min(1).max(4),
    }).optional(),
    cta: Cta,
    ctaSecondaria: Cta.optional(),
    corridoiInEvidenza: z.array(slug).default([]),
    priorita: z.number().int().default(0),
    provvisorio,
  })
  .refine((c) => !c.inizio || !c.fine || c.inizio <= c.fine, {
    message: "inizio deve essere <= fine",
    path: ["fine"],
  })
  .refine((c) => !c.ricorrenza || Boolean(c.inizio && c.fine), {
    message: "Una ricorrenza annuale richiede entrambe le date",
    path: ["ricorrenza"],
  });
export type Campaign = z.infer<typeof CampaignSchema>;

// ---------- Home copy ----------
const SectionCopySchema = z.object({ titolo: z.string().min(1), descrizione: z.string().min(1) });
export const HomeCopySchema = z.object({
  reparti: SectionCopySchema.extend({ cta: z.string().min(1) }),
  negozi: SectionCopySchema,
  volantini: z.object({
    titolo: z.string().min(1), introAttivo: z.string(), introArchivio: z.string(),
    ctaAttivo: z.string(), ctaArchivio: z.string(), statoArchivio: z.string(),
    introAnteprima: z.string(), ctaAnteprima: z.string(), statoAnteprima: z.string(),
  }),
});
export type HomeCopy = z.infer<typeof HomeCopySchema>;

// ---------- Aisle ----------
export const AisleHighlightSchema = z.object({
  titolo: z.string().min(1),
  descrizione: z.string().default(""),
  immagine: ImageSchema.default({ src: null, alt: "" }),
  badge: z.string().optional(),
  /** Se presente, l'idea compare solo durante una delle campagne indicate. */
  campagne: z.array(z.string().min(1)).min(1).optional(),
});
export type AisleHighlight = z.infer<typeof AisleHighlightSchema>;

/** Foto di uno scaffale in negozio: l'alt e' obbligatorio. */
export const AisleShelfSchema = z.object({
  immagine: ImageSchema.extend({ src: z.string().min(1), alt: z.string().min(1) }),
  titolo: z.string().min(1).optional(),
  descrizione: z.string().min(1).optional(),
});
export type AisleShelf = z.infer<typeof AisleShelfSchema>;

export const AisleSchema = z.object({
  slug,
  titolo: z.string().min(1),
  titoloBreve: z.string().min(1),
  descrizione: z.string(),
  descrizioneLunga: z.string(),
  immagine: ImageSchema,
  /** Nome icona (es. "cucina", "tessile"): risolto dai componenti. */
  icona: z.string(),
  colore: hexColor.optional(),
  inEvidenza: z.array(AisleHighlightSchema).default([]),
  /** Foto degli scaffali in negozio; vuoto = la sezione non compare. */
  scaffali: z.array(AisleShelfSchema).default([]),
  scaffaliTitolo: z.string().default("Gli scaffali in negozio"),
  scaffaliIntro: z.string().optional(),
  ordine: z.number().int().default(0),
  visibile: z.boolean().default(true),
  seo: z.object({ title: z.string(), description: z.string() }),
  /** Aggancio futuro alla categoria dello shop (lib/api/types.ts). */
  categoryId: z.string().optional(),
  provvisorio,
});
export type Aisle = z.infer<typeof AisleSchema>;

// ---------- Store ----------
export const OpeningSlotSchema = z.object({
  da: z.string().regex(/^\d{2}:\d{2}$/, "Orario HH:MM"),
  a: z.string().regex(/^\d{2}:\d{2}$/, "Orario HH:MM"),
});
export const OpeningDaySchema = z.object({
  /** 0 = domenica ... 6 = sabato (come Date.getDay()) */
  giorno: z.number().int().min(0).max(6),
  /** array vuoto = chiuso */
  aperture: z.array(OpeningSlotSchema),
});
export type OpeningDay = z.infer<typeof OpeningDaySchema>;

export const StoreSchema = z.object({
  id: slug,
  nome: z.string().min(1),
  citta: z.string().min(1),
  indirizzo: z.object({
    via: z.string(),
    cap: z.string(),
    citta: z.string(),
    provincia: z.string().length(2),
  }),
  coordinate: z.object({ lat: z.number(), lng: z.number() }),
  telefono: z.string().nullable().default(null),
  email: z.string().nullable().default(null),
  whatsapp: z.string().nullable().default(null),
  /** null = orari non ancora forniti: niente stato "Aperto ora". */
  orari: z.array(OpeningDaySchema).nullable().default(null),
  noteOrari: z.string().default(""),
  particolarita: z.array(z.string()).default([]),
  servizi: z.array(z.string()).default([]),
  immagine: ImageSchema,
  mappaUrl: z.string(),
  provvisorio,
});
export type Store = z.infer<typeof StoreSchema>;

// ---------- Brand ----------
export const BrandSchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  logo: z.object({ src: z.string().nullable().default(null) }),
  url: z.string().optional(),
  provvisorio,
});
export type Brand = z.infer<typeof BrandSchema>;

// ---------- Flyer ----------
export const FlyerSchema = z
  .object({
    id: z.string().min(1),
    titolo: z.string().min(1),
    validoDal: isoDate,
    validoAl: isoDate,
    negozi: z.union([z.literal("tutti"), z.array(z.string())]),
    pagine: z.array(ImageSchema).default([]),
    pdf: z.string().nullable().default(null),
    pdfDimensione: z.string().optional(),
    copertina: ImageSchema,
    provvisorio,
  })
  .refine((f) => f.validoDal <= f.validoAl, {
    message: "validoDal deve essere <= validoAl",
    path: ["validoAl"],
  });
export type Flyer = z.infer<typeof FlyerSchema>;

// ---------- Promotion ----------
export const PromotionSchema = z.object({
  id: z.string().min(1),
  titolo: z.string().min(1),
  testo: z.string(),
  immagine: ImageSchema.default({ src: null, alt: "" }),
  validoDal: isoDate.optional(),
  validoAl: isoDate.optional(),
  corridoio: slug.optional(),
  link: z.string().optional(),
  provvisorio,
});
export type Promotion = z.infer<typeof PromotionSchema>;

// ---------- Settings ----------
export const SettingsSchema = z.object({
  nomeSito: z.string(),
  claim: z.string(),
  societa: z.object({
    ragioneSociale: z.string(),
    indirizzo: z.string(),
    piva: z.string(),
    email: z.string(),
  }),
  social: z.object({ instagram: z.string(), facebook: z.string() }),
  whatsapp: z.object({
    /** Formato internazionale senza + (es. "393331234567"). null = TODO. */
    numero: z.string().nullable().default(null),
    messaggioPredefinito: z.string(),
  }),
  siteUrl: z.string().url(),
  analytics: z.object({
    gaId: z.string().nullable().default(null),
    metaPixelId: z.string().nullable().default(null),
  }),
});
export type Settings = z.infer<typeof SettingsSchema>;

// ---------- LoyaltyProgram ----------
export const LoyaltyProgramSchema = z.object({
  nome: z.string(),
  intro: z.string(),
  vantaggi: z.array(
    z.object({ titolo: z.string(), testo: z.string(), icona: z.string() }),
  ),
  comeRichiederla: z.string(),
  faq: z.array(z.object({ d: z.string(), r: z.string() })).default([]),
  provvisorio,
});
export type LoyaltyProgram = z.infer<typeof LoyaltyProgramSchema>;

// ---------- Navigation ----------
export const NavItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  /** Voce evidenziata (es. pulsante nel menu) */
  evidenza: z.boolean().default(false),
});
export type NavItem = z.infer<typeof NavItemSchema>;

export const NavigationSchema = z
  .array(NavItemSchema)
  .max(10, "Il menu può avere al massimo 10 voci");
export type Navigation = z.infer<typeof NavigationSchema>;
