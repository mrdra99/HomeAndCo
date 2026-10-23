"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, m } from "motion/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CONTACT_SUBJECTS, ContactSchema, getContactAdapter } from "@/lib/contact/adapter";

type Field = "nome" | "email" | "oggetto" | "messaggio" | "privacy";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "success" | "demo" | "error";

const inputCls =
  "mt-2 block w-full rounded-md border-2 border-brand-blue-100 bg-white px-4 py-3 text-ink placeholder:text-muted/70 aria-[invalid=true]:border-brand-magenta-700";

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <m.p
          id={id}
          key={message}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-1 text-sm font-medium text-brand-magenta-700"
        >
          {message}
        </m.p>
      )}
    </AnimatePresence>
  );
}

export function ContactForm({ email }: { email: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const adapter = getContactAdapter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    const parsed = ContactSchema.safeParse({
      nome: fd.get("nome"),
      email: fd.get("email"),
      oggetto: fd.get("oggetto") || undefined,
      messaggio: fd.get("messaggio"),
      privacy: fd.get("privacy") === "on" ? true : false,
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      // porta il focus sul primo campo non valido
      const first = (["nome", "email", "oggetto", "messaggio", "privacy"] as Field[]).find((k) => next[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await adapter.send(parsed.data);
      if (res.ok) {
        setStatus(res.simulated ? "demo" : "success");
        formRef.current?.reset();
      } else {
        setServerError(res.error);
        setStatus("error");
      }
    } catch {
      setServerError("Qualcosa non ha funzionato. Riprova tra poco.");
      setStatus("error");
    }
  }

  const a11y = (f: Field) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `err-${f}` : undefined,
  });

  if (!adapter.available) return (
    <div>
      <h2 className="text-2xl text-brand-blue-900">Scrivici via email</h2>
      <p className="mt-3 text-muted">Hai una domanda? Raccontaci di cosa hai bisogno e indica il negozio a cui ti riferisci.</p>
      <Button href={`mailto:${email}`} className="mt-6 max-w-full [&>span]:break-all">{email}</Button>
    </div>
  );

  return (
    <div>
      {adapter.simulated && <p className="mb-5 rounded-xl bg-brand-blue-50 p-4 text-sm text-brand-blue-900">Stai provando il modulo: i messaggi non vengono spediti.</p>}
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" || status === "demo" ? (
          <m.div
            key="ok"
            role="status"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-brand-blue-50 p-8 text-center"
          >
            <h2 className="text-2xl text-brand-blue-900">{status === "demo" ? "Prova completata" : "Messaggio inviato, grazie!"}</h2>
            <p className="mt-3 text-muted">{status === "demo" ? "Nessuna email è stata inviata." : "Ti risponderemo il prima possibile."}</p>
            <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
              Scrivi un altro messaggio
            </Button>
          </m.div>
        ) : (
          <m.form key="form" ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5" exit={{ opacity: 0 }}>
            <div>
              <label htmlFor="nome" className="font-semibold text-brand-blue-900">Nome</label>
              <input id="nome" name="nome" type="text" autoComplete="name" required className={inputCls} {...a11y("nome")} />
              <FieldError id="err-nome" message={errors.nome} />
            </div>
            <div>
              <label htmlFor="email" className="font-semibold text-brand-blue-900">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required className={inputCls} {...a11y("email")} />
              <FieldError id="err-email" message={errors.email} />
            </div>
            <div>
              <label htmlFor="oggetto" className="font-semibold text-brand-blue-900">Oggetto</label>
              <select id="oggetto" name="oggetto" defaultValue="" required className={inputCls} {...a11y("oggetto")}>
                <option value="" disabled>Scegli un argomento</option>
                {CONTACT_SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <FieldError id="err-oggetto" message={errors.oggetto} />
            </div>
            <div>
              <label htmlFor="messaggio" className="font-semibold text-brand-blue-900">Messaggio</label>
              <textarea id="messaggio" name="messaggio" rows={6} required className={inputCls} {...a11y("messaggio")} />
              <FieldError id="err-messaggio" message={errors.messaggio} />
            </div>
            <div>
              <div className="flex items-start gap-3">
                <input
                  id="privacy"
                  name="privacy"
                  type="checkbox"
                  className={cn("mt-0.5 h-6 w-6 shrink-0 accent-[var(--color-brand-blue-700)]")}
                  {...a11y("privacy")}
                />
                <label htmlFor="privacy" className="text-sm">
                  Ho letto l&apos;
                  <Link href="/privacy-policy/" className="font-semibold text-brand-blue-700 underline underline-offset-4">
                    informativa privacy
                  </Link>{" "}
                  e acconsento al trattamento dei dati per rispondere alla mia richiesta.
                </label>
              </div>
              <FieldError id="err-privacy" message={errors.privacy} />
            </div>

            <AnimatePresence initial={false}>
              {status === "error" && (
                <m.p
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-md bg-brand-magenta-50 p-4 font-medium text-brand-magenta-800"
                >
                  {serverError}
                </m.p>
              )}
            </AnimatePresence>

            {status === "error" && <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center font-semibold text-brand-blue-700 underline underline-offset-4">Scrivici via email</a>}

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === "sending"} aria-busy={status === "sending"}>
              {status === "sending" ? "Invio in corso..." : "Invia messaggio"}
            </Button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
