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

export type ContactResult = { ok: true } | { ok: false; error: string };

/** Contratto di invio del form contatti: cambiare provider = cambiare adapter. */
export interface ContactAdapter {
  send(data: ContactData): Promise<ContactResult>;
}

/** Simula l'invio (ritardo + log in sviluppo). Predefinito finche' non c'e' un backend. */
export class MockAdapter implements ContactAdapter {
  async send(data: ContactData): Promise<ContactResult> {
    await new Promise((r) => setTimeout(r, 900));
    if (process.env.NODE_ENV !== "production") console.info("[ContactForm:mock] messaggio simulato", data);
    return { ok: true };
  }
}

/*
 * TODO integrazione: scegliere UNO tra questi adapter e impostare NEXT_PUBLIC_CONTACT_ADAPTER.
 *
 * // class FormspreeAdapter implements ContactAdapter {
 * //   async send(data: ContactData): Promise<ContactResult> {
 * //     const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_URL!, {
 * //       method: "POST",
 * //       headers: { "Content-Type": "application/json", Accept: "application/json" },
 * //       body: JSON.stringify(data),
 * //     });
 * //     return res.ok ? { ok: true } : { ok: false, error: "Invio non riuscito, riprova." };
 * //   }
 * // }
 *
 * // class ApiDotnetAdapter implements ContactAdapter {
 * //   // POST /api/contact sull'API .NET (ApiResponse<T>, validazione FluentValidation lato server)
 * //   async send(data: ContactData): Promise<ContactResult> {
 * //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
 * //       method: "POST",
 * //       headers: { "Content-Type": "application/json" },
 * //       body: JSON.stringify(data),
 * //     });
 * //     return res.ok ? { ok: true } : { ok: false, error: "Invio non riuscito, riprova." };
 * //   }
 * // }
 */

/** Sceglie l'adapter da NEXT_PUBLIC_CONTACT_ADAPTER ("mock" di default). */
export function getContactAdapter(): ContactAdapter {
  const kind = process.env.NEXT_PUBLIC_CONTACT_ADAPTER ?? "mock";
  switch (kind) {
    // case "formspree": return new FormspreeAdapter();
    // case "api": return new ApiDotnetAdapter();
    default:
      return new MockAdapter();
  }
}
