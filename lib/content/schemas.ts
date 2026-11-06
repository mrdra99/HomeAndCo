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
        immagine: ImageSchema.optional(),
      })).min(1).max(8),
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
const text = z.string().min(1);
const template = (token: string) => z.string().min(1).refine((v) => v.includes(token), `Il testo deve contenere ${token}`);
export const HomeCopySchema = z.object({
  /** Descrizione della home per i motori di ricerca (max ~160 caratteri). */
  seo: z.object({ descrizione: text }),
  /** Primo schermo: riquadri accanto alla campagna (il volantino usa `volantino`). */
  tabellone: z.object({
    aria: text,
    negozi: z.object({ titolo: text, cta: text, apertoNeutro: text }),
  }),
  /** Etichetta accessibile della fascia fatti. */
  fattiAria: text,
  /** Fascia fatti: 3-4 fatti verificati con icona (nome di Icon). */
  fatti: z.array(z.object({ icona: text, titolo: text, testo: text })).min(3).max(4),
  reparti: z.object({ titolo: text, descrizione: text }),
  idee: z.object({ vaiAlReparto: z.string().refine((v) => v.includes("{reparto}"), "Il testo deve contenere {reparto}"), scorriPrecedente: text, scorriSuccessivo: text, regione: text }),
  /** Volantino: usato dal riquadro del primo schermo e dalla fascia magenta. */
  volantino: z.object({
    titolo: text,
    statoAttivo: text,
    statoAnteprima: text,
    avvisoAnteprima: text,
    soloNegozi: z.string().refine((v) => v.includes("{negozi}"), "Il testo deve contenere {negozi}"),
    tuttiINegozi: text,
    ctaAttivo: text,
    ctaAnteprima: text,
    /** Nessun volantino in corso ne' in arrivo: riquadro del primo schermo e striscia sottile. */
    vuoto: z.object({ testo: text, cta: text, fascia: text, ctaFascia: text }),
  }),
  negozi: z.object({ titolo: text, descrizione: text, indicazioni: text, tutti: text, orari: text, mappa: text }),
  carta: z.object({ titolo: text, cta: text }),
  social: z.object({
    titolo: text,
    descrizione: z.string(),
    video: z.object({ src: z.string(), poster: ImageSchema, titolo: z.string(), descrizione: z.string() }),
    reels: z.array(z.object({ href: z.string().url(), titolo: z.string(), immagine: ImageSchema })).length(2),
    instagram: text,
    videoAlternativa: text,
    seguici: text,
    videoAria: template("{titolo}"),
    reelAria: template("{titolo}"),
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
  /** Nome corto per spazi stretti (es. "Sesto F.no"); se assente si usa `citta`. */
  cittaBreve: z.string().optional(),
  noteOrari: z.string().default(""),
  particolarita: z.array(z.string()).default([]),
  servizi: z.array(z.string()).default([]),
  /** Dettagli non ancora verificati: NON compaiono sul sito finche' non passano in particolarita' o servizi. */
  daConfermare: z.array(z.string()).default([]),
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
    validoDal: isoDate.nullable(),
    validoAl: isoDate.nullable(),
    periodo: z.string().optional(),
    archiviato: z.boolean().optional(),
    negozi: z.union([z.literal("tutti"), z.array(z.string())]),
    pagine: z.array(ImageSchema).default([]),
    pdf: z.string().nullable().default(null),
    pdfDimensione: z.string().optional(),
    copertina: ImageSchema,
    provvisorio,
  })
  .refine((f) => f.validoDal && f.validoAl ? f.validoDal <= f.validoAl : f.archiviato === true && !f.validoDal && !f.validoAl, {
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

// ---------- Testata e piede: etichette dell'interfaccia (mai cablate nei componenti) ----------
const TEMPLATE_ORA = z.string().refine((v) => v.includes("{ora}"), "Il testo deve contenere {ora}");
export const TabIconSchema = z.enum(["home", "reparti", "volantino", "negozi", "carta", "contatti"]);
export const HeaderCopySchema = z.object({
  /** Fascia superiore blu 900. Le citta' si ricavano dai negozi (cittaBreve o citta). */
  avviso: z.string().min(1),
  repartiLabel: z.string().min(1),
  /** Chip "Il tuo negozio" (scelta salvata nel browser, stato da useOpenStatus). */
  negozio: z.object({
    etichetta: z.string().min(1),
    scegli: z.string().min(1),
    titoloScelta: z.string().min(1),
    apertoFinoAlle: TEMPLATE_ORA,
    chiuso: z.string().min(1),
    riapreOggi: TEMPLATE_ORA,
    riapreDomani: TEMPLATE_ORA,
    orariEIndicazioni: z.string().min(1),
  }),
  /** Tab bar mobile: 5 voci. "reparti" apre il pannello dei reparti, le altre sono link. */
  tab: z.array(z.object({ label: z.string().min(1), icona: TabIconSchema, href: z.string().optional() })).length(5),
  a11y: z.object({
    saltaAlContenuto: z.string().min(1),
    logo: z.string().min(1),
    navigazione: z.string().min(1),
    reparti: z.string().min(1),
    tabBar: z.string().min(1),
    chiudi: z.string().min(1),
    altriLink: z.string().min(1),
  }),
});
export type HeaderCopy = z.infer<typeof HeaderCopySchema>;

export const ConsentCopySchema = z.object({
  titolo: text,
  testoPrima: text,
  linkCookie: text,
  necessari: z.object({ etichetta: text, descrizione: text }),
  statistiche: z.object({ etichetta: text, descrizione: text }),
  marketing: z.object({ etichetta: text, descrizione: text }),
  salva: text,
  accettaTutti: text,
  rifiuta: text,
  personalizza: text,
});
export type ConsentCopy = z.infer<typeof ConsentCopySchema>;

export const FooterCopySchema = z.object({
  reparti: z.string().min(1),
  negozi: z.string().min(1),
  linkUtili: z.string().min(1),
  social: z.string().min(1),
  legale: z.string().min(1),
  tuttiIGiorni: z.string().min(1),
  indicazioni: z.string().min(1),
  partitaIva: z.string().min(1),
  privacy: z.string().min(1),
  cookie: z.string().min(1),
  preferenzeCookie: z.string().min(1),
});
export type FooterCopy = z.infer<typeof FooterCopySchema>;

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
  testata: HeaderCopySchema,
  piede: FooterCopySchema,
  consenso: ConsentCopySchema,
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
  /** Vantaggi confermati dal cliente; vuoto = la sezione non compare. */
  vantaggi: z.array(
    z.object({ titolo: z.string(), testo: z.string(), icona: z.string() }),
  ).default([]),
  /** Costo della carta (es. "Gratuita"); compare solo se compilato. */
  costo: z.string().optional(),
  /** Regolamento, in sintesi; compare solo se compilato. */
  regolamento: z.string().optional(),
  /** Passaggi per ottenere la carta; vuoto = la sezione non compare (nessun passaggio confermato). */
  passi: z.array(z.string().min(1)).default([]),
  faq: z.array(z.object({ d: z.string(), r: z.string() })).default([]),
  provvisorio,
});
export type LoyaltyProgram = z.infer<typeof LoyaltyProgramSchema>;

// ---------- Navigation ----------
export const NavItemSchema = z.object({
  label: z.string().min(1),
  /** Etichetta corta per i selettori compatti dei reparti (chip nella pagina reparto). */
  breve: z.string().min(1).optional(),
  href: z.string().min(1),
  /** Voce evidenziata (es. pulsante nel menu) */
  evidenza: z.boolean().default(false),
  /** Compare solo nel footer: non nel menu della testata ne' nella tab bar mobile. */
  soloPiede: z.boolean().default(false),
});
export type NavItem = z.infer<typeof NavItemSchema>;

const DEPT_PREFIX = "/corridoi/";
export const NavGroupSchema = z.object({
  titolo: z.string().min(1),
  /** Href dei reparti (come in `voci`), nell'ordine in cui compaiono nel menu. */
  reparti: z.array(z.string().min(1)).min(1),
});
export type NavGroup = z.infer<typeof NavGroupSchema>;

export const NavigationSchema = z
  .object({
    voci: z.array(NavItemSchema),
    /** Raggruppamento dei reparti per il mega-menu e il pannello mobile. */
    gruppi: z.array(NavGroupSchema).min(1),
  })
  .superRefine(({ voci, gruppi }, ctx) => {
    if (voci.filter((item) => !item.href.startsWith(DEPT_PREFIX)).length > 10) {
      ctx.addIssue({ code: "custom", message: "Il menu può avere al massimo 10 voci principali, oltre ai reparti nel menu a tendina" });
    }
    const departments = voci.filter((item) => item.href.startsWith(DEPT_PREFIX)).map((item) => item.href);
    const grouped = gruppi.flatMap((g) => g.reparti);
    for (const href of departments) {
      const n = grouped.filter((h) => h === href).length;
      if (n !== 1) ctx.addIssue({ code: "custom", message: `Il reparto ${href} deve comparire in un solo gruppo (trovato ${n})` });
    }
    for (const href of grouped) {
      if (!departments.includes(href)) ctx.addIssue({ code: "custom", message: `Il gruppo cita ${href}, che non è un reparto in "voci"` });
    }
  });
export type Navigation = z.infer<typeof NavigationSchema>;

// ---------- Testi delle pagine interne ----------
export const PagesCopySchema = z.object({
  breadcrumb: z.object({ aria: text, home: text, reparti: text }),
  offerte: z.object({
    titolo: text,
    intro: text,
    inCorso: text,
    anteprima: text,
    testoInCorso: text,
    testoAnteprima: template("{data}"),
    nessuno: z.object({ titolo: text, testo: text, social: text }),
    schede: text,
    etichettaAnteprima: text,
    sfoglia: text,
    scaricaPdf: text,
    negozi: z.object({ tutti: text, uno: template("{negozi}"), alcuni: template("{negozi}") }),
    negoziConclusi: z.object({ tutti: text, uno: template("{negozi}"), alcuni: template("{negozi}") }),
    visore: z.object({
      titolo: text,
      istruzioni: text,
      concluso: template("{date}"),
      chiudi: text,
      paginaPrecedente: text,
      paginaSuccessiva: text,
      gruppo: template("{titolo}"),
      carosello: text,
      ingrandisci: text,
      paginaDi: template("{n}"),
      vaiAllaPagina: text,
      pagina: template("{n}"),
      zoom: text,
      adatta: text,
      chiudiFinestra: text,
    }),
    archivio: z.object({ titolo: text, nota: text, concluso: text, sfoglia: text }),
    promozioni: z.object({ titolo: text, sottotitolo: text }),
  }),
  doveSiamo: z.object({
    titolo: text,
    intro: text,
    scegli: text,
    tuoNegozio: text,
    daSapere: text,
    servizi: text,
    orari: text,
    orariInAggiornamento: text,
    mappa: text,
    indicazioni: text,
    chiama: text,
    whatsapp: text,
    impostaNegozio: text,
  }),
  cartaFedelta: z.object({
    vantaggi: text,
    passi: text,
    faq: text,
    domande: z.object({ titolo: text, testo: text, scrivici: text, negozi: text }),
    /** Pagina senza dati confermati: solo avviso e due link. */
    vuota: z.object({ volantino: text, negozi: text }),
    /** Descrizione per i motori di ricerca: senza dati / con dati. */
    meta: z.object({ vuota: text, completa: text }),
    costo: text,
    regolamento: text,
  }),
  contatti: z.object({
    titolo: text,
    /** Senza modulo (adattatore non configurato): contiene {email}. */
    intro: template("{email}"),
    /** Con un modulo realmente attivo. */
    introModulo: text,
    descrizione: text,
    descrizioneModulo: text,
    emailTesto: text,
    indicazioni: text,
    modulo: z.object({
      nome: text,
      email: text,
      oggetto: text,
      scegliOggetto: text,
      messaggio: text,
      privacyPrima: text,
      privacyLink: text,
      privacyDopo: text,
      invia: text,
      invio: text,
      prova: text,
      provaTitolo: text,
      provaTesto: text,
      inviatoTitolo: text,
      inviatoTesto: text,
      scriviAncora: text,
      erroreGenerico: text,
      viaEmail: text,
    }),
    diretti: text,
    negozi: text,
    orariEIndicazioni: text,
    privacyPrima: text,
    privacyLink: text,
  }),
  corridoi: z.object({
    tuttiIReparti: text,
    negozi: text,
    scaffali: text,
    idee: z.object({ titolo: text, testo: text }),
    promozioni: template("{reparto}"),
    chiusura: z.object({ titolo: template("{reparto}"), testo: template("{citta}"), negozi: text, volantino: text }),
  }),
  legale: z.object({ avviso: text, aggiornamento: template("{data}") }),
});
export type PagesCopy = z.infer<typeof PagesCopySchema>;
