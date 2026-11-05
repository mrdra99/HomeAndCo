"use client";

import Link from "next/link";
import { useBrandIntroActive } from "@/components/intro/BrandIntro";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useConsent } from "./ConsentProvider";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Toggle({ id, label, description, checked, disabled, onChange }: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4 rounded-md bg-cream p-4">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="font-semibold text-brand-blue-900">{label}</label>
        <p id={`${id}-d`} className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-describedby={`${id}-d`}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-brand-blue-100 transition-colors checked:bg-brand-blue-700 disabled:cursor-not-allowed disabled:opacity-60
          relative before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:content-[''] checked:before:translate-x-5"
      />
    </div>
  );
}

/**
 * Popup di consenso: bottom-sheet su mobile, finestra centrata da sm in su.
 * Compare al primo ingresso finche' non si sceglie, e quando si riaprono le preferenze.
 */
export function CookieBanner() {
  const { ready, decided, choices, preferencesOpen, acceptAll, rejectAll, save, closePreferences } = useConsent();
  const introActive = useBrandIntroActive();
  const open = ready && !introActive && (!decided || preferencesOpen);
  const [customizing, setCustomizing] = useState(false);
  const [stat, setStat] = useState(false);
  const [mkt, setMkt] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  // Alla riapertura riparte dalle scelte salvate
  useEffect(() => {
    if (open) {
      // Sincronizza lo stato locale del pannello con le scelte salvate a ogni apertura.
      /* eslint-disable react-hooks/set-state-in-effect */
      setStat(choices.statistiche);
      setMkt(choices.marketing);
      setCustomizing(preferencesOpen);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Focus: entra nel dialog, lo trattiene, Esc chiude solo se la scelta esiste gia', poi ripristina
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = dialogRef.current;
    node?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && decided) {
        closePreferences();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === node)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, [open, decided, closePreferences]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          key="consent"
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-end justify-center bg-brand-blue-900/50 p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            tabIndex={-1}
            className="max-h-[92dvh] w-full max-w-xl overflow-y-auto overscroll-contain rounded-t-[var(--radius-lg)] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-ink shadow-pop outline-none sm:rounded-[var(--radius-lg)] sm:p-8"
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
          >
            <h2 id={titleId} className="text-2xl text-brand-blue-900">Il tuo consenso ai cookie</h2>
            <p id={descId} className="mt-3 text-muted">
              Usiamo cookie tecnici necessari al funzionamento del sito. Con il tuo consenso possiamo usare anche
              cookie statistici e di marketing. Puoi cambiare idea quando vuoi. Maggiori dettagli nella{" "}
              <Link href="/cookie-policy/" className="font-semibold text-brand-blue-700 underline underline-offset-4">
                cookie policy
              </Link>
              .
            </p>

            {customizing && (
              <div className="mt-5 space-y-3">
                <Toggle id="consent-necessari" label="Necessari" description="Indispensabili al funzionamento del sito. Sempre attivi." checked disabled />
                <Toggle id="consent-statistiche" label="Statistiche" description="Ci aiutano a capire come viene usato il sito, in forma aggregata." checked={stat} onChange={setStat} />
                <Toggle id="consent-marketing" label="Marketing" description="Permettono di misurare e personalizzare le nostre comunicazioni." checked={mkt} onChange={setMkt} />
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
              {customizing ? (
                <Button onClick={() => save({ statistiche: stat, marketing: mkt })} className="sm:flex-1">Salva preferenze</Button>
              ) : (
                <Button onClick={acceptAll} className="sm:flex-1">Accetta tutti</Button>
              )}
              <Button variant="outline" onClick={rejectAll} className="sm:flex-1">Rifiuta</Button>
              {!customizing && (
                <Button variant="ghost" onClick={() => setCustomizing(true)} className="sm:flex-1">Personalizza</Button>
              )}
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
