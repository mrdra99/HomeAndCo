"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Chiave localStorage della scelta "Il tuo negozio" (id del negozio, es. "prato"). */
export const SELECTED_STORE_KEY = "homeco:negozio";
const EVENT = "homeco:negozio-change";

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
};

/**
 * Scelta tenuta in memoria: se il browser blocca localStorage (o la scrittura fallisce) la scelta vale comunque
 * finche' la pagina resta aperta, anche navigando tra le pagine del sito (il modulo non viene ricaricato).
 * Si perde solo a ricarica completa: li' non c'e' modo di conservarla senza storage.
 */
let memoryChoice: string | null = null;

function read(): string | null {
  try {
    return window.localStorage.getItem(SELECTED_STORE_KEY) ?? memoryChoice;
  } catch {
    return memoryChoice;
  }
}

/**
 * Negozio scelto dal visitatore. `null` sul server e al primo render del client (stato neutro,
 * niente mismatch di idratazione); dopo il mount legge localStorage e si aggiorna tra schede e componenti.
 * L'id viene validato dal chiamante contro l'elenco dei negozi.
 */
export function useSelectedStoreId(): [string | null, (id: string) => void] {
  const id = useSyncExternalStore(subscribe, read, () => null);
  const select = useCallback((next: string) => {
    memoryChoice = next;
    try {
      window.localStorage.setItem(SELECTED_STORE_KEY, next);
    } catch {
      /* ignorato */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [id, select];
}
