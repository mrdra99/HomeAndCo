"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/** Incrementare quando cambiano categorie o finalita': riporta il banner a chi aveva gia' scelto. */
export const CONSENT_VERSION = 1;
const STORAGE_KEY = "hco-consent";

export type ConsentChoices = {
  /** Sempre true: cookie tecnici necessari. */
  necessari: true;
  statistiche: boolean;
  marketing: boolean;
};

type Stored = ConsentChoices & { version: number; timestamp: string };

type ConsentContextValue = {
  /** false finche' non e' stato letto localStorage (evita mismatch di idratazione). */
  ready: boolean;
  /** true se l'utente ha gia' scelto (con la versione corrente). */
  decided: boolean;
  choices: ConsentChoices;
  preferencesOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (choices: Pick<ConsentChoices, "statistiche" | "marketing">) => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const DEFAULT: ConsentChoices = { necessari: true, statistiche: false, marketing: false };
const noop = () => {};
/** Valore di ripiego se manca il provider (es. pagine renderizzate fuori dal layout): nessun effetto. */
const FALLBACK: ConsentContextValue = {
  ready: false, decided: false, choices: DEFAULT, preferencesOpen: false,
  acceptAll: noop, rejectAll: noop, save: noop, openPreferences: noop, closePreferences: noop,
};
const ConsentContext = createContext<ConsentContextValue>(FALLBACK);

function read(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<Stored>;
    if (p.version !== CONSENT_VERSION) return null;
    return { ...DEFAULT, statistiche: !!p.statistiche, marketing: !!p.marketing, version: CONSENT_VERSION, timestamp: p.timestamp ?? "" };
  } catch {
    return null;
  }
}

function write(c: ConsentChoices) {
  try {
    const value: Stored = { ...c, version: CONSENT_VERSION, timestamp: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage non disponibile: la scelta vale solo per la sessione */
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [decided, setDecided] = useState(false);
  const [choices, setChoices] = useState<ConsentChoices>(DEFAULT);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const stored = read();
    // Lettura di localStorage solo dopo l'idratazione: setState in effect e' voluto qui.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (stored) {
      setChoices({ necessari: true, statistiche: stored.statistiche, marketing: stored.marketing });
      setDecided(true);
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const commit = useCallback((c: ConsentChoices) => {
    setChoices(c);
    setDecided(true);
    setPreferencesOpen(false);
    write(c);
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      ready,
      decided,
      choices,
      preferencesOpen,
      acceptAll: () => commit({ necessari: true, statistiche: true, marketing: true }),
      rejectAll: () => commit(DEFAULT),
      save: (c) => commit({ necessari: true, ...c }),
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
    }),
    [ready, decided, choices, preferencesOpen, commit],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

/** Stato e azioni del consenso cookie. Senza <ConsentProvider> restituisce un valore inerte. */
export function useConsent(): ConsentContextValue {
  return useContext(ConsentContext);
}
