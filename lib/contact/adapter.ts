import { z } from "zod";

export const CONTACT_SUBJECTS = [
  "Informazioni",
  "Volantino/Offerte",
  "Carta fedeltà",
  "Collabora con noi",
  "Altro",
] as const;

export const ContactSchema = z.object({
  nome: z.string().trim().min(2, "Scrivi il tuo nome (almeno 2 caratteri)."),
  email: z.string().trim().email("Inserisci un indirizzo email valido."),
  oggetto: z.enum(CONTACT_SUBJECTS, { error: "Scegli un oggetto." }),
  messaggio: z.string().trim().min(10, "Il messaggio deve avere almeno 10 caratteri.").max(2000, "Massimo 2000 caratteri."),
  privacy: z.literal(true, { error: "Per inviare devi accettare l'informativa privacy." }),
});
export type ContactData = z.infer<typeof ContactSchema>;

export type ContactResult = { ok: true; simulated?: boolean } | { ok: false; error: string };

/** Un provider diverso può rispettare lo stesso contratto senza cambiare il modulo. */
export interface ContactAdapter {
  available: boolean;
  simulated: boolean;
  send(data: ContactData): Promise<ContactResult>;
}

class UnavailableAdapter implements ContactAdapter {
  available = false;
  simulated = false;
  async send(): Promise<ContactResult> {
    return { ok: false, error: "Il modulo non è disponibile. Puoi scriverci via email." };
  }
}

/** Prova esplicita: non invia né registra dati personali e non conferma un invio reale. */
export class MockAdapter implements ContactAdapter {
  available = true;
  simulated = true;
  async send(): Promise<ContactResult> {
    return { ok: true, simulated: true };
  }
}

function formspreeEndpoint(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.origin !== "https://formspree.io" || !/^\/f\/[a-zA-Z0-9]+\/?$/.test(url.pathname)
      || url.username || url.password || url.search || url.hash) return null;
    return url.href;
  } catch {
    return null;
  }
}

export class FormspreeAdapter implements ContactAdapter {
  available = true;
  simulated = false;
  constructor(private readonly endpoint: string) {}

  async send(data: ContactData): Promise<ContactResult> {
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) return { ok: false, error: "Controlla i campi del modulo e riprova." };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "omit",
        redirect: "error",
        signal: controller.signal,
        body: JSON.stringify(parsed.data),
      });
      const body: unknown = await response.json().catch(() => null);
      if (response.ok && typeof body === "object" && body !== null && !Array.isArray(body)
        && !("errors" in body) && (!("ok" in body) || body.ok === true)) {
        return { ok: true };
      }
      return {
        ok: false,
        error: response.status === 429
          ? "Al momento non riusciamo a ricevere altri messaggi dal modulo. Puoi scriverci via email."
          : "L’invio non è stato confermato. Riprova tra poco oppure scrivici via email.",
      };
    } catch {
      return { ok: false, error: "L’invio non è stato confermato. Controlla la connessione oppure scrivici via email." };
    } finally {
      clearTimeout(timer);
    }
  }
}

/** Le variabili pubbliche vengono incorporate nella build: modificarle richiede un nuovo deploy. */
export function getContactAdapter(): ContactAdapter {
  const kind = process.env.NEXT_PUBLIC_CONTACT_ADAPTER
    ?? (process.env.NODE_ENV === "development" ? "mock" : "disabled");
  if (kind === "mock") return new MockAdapter();
  if (kind === "formspree") {
    const endpoint = formspreeEndpoint(process.env.NEXT_PUBLIC_FORMSPREE_URL);
    if (endpoint) return new FormspreeAdapter(endpoint);
  }
  return new UnavailableAdapter();
}
