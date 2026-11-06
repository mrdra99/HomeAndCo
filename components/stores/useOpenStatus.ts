"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { Store } from "@/lib/content/schemas";
import { isOpenNow, storeStatusDetail, type StoreStatusDetail } from "@/lib/stores";

const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};

/** "open" | "closed" | "unknown": calcolato SOLO nel client (il server dice sempre "unknown"). */
export function useOpenStatus(store: Pick<Store, "orari">): "open" | "closed" | "unknown" {
  return useSyncExternalStore(
    subscribe,
    () => {
      const v = isOpenNow(store);
      return v === null ? "unknown" : v ? "open" : "closed";
    },
    () => "unknown",
  );
}

/**
 * Come useOpenStatus, con l'orario ("fino alle 20:00", "riapre domani alle 09:00").
 * Lo snapshot e' una stringa (stabile tra i render); prima del mount e' sempre "unknown",
 * quindi server e primo render del client coincidono (nessun mismatch di idratazione).
 */
export function useOpenStatusDetail(store: Pick<Store, "orari"> | null): StoreStatusDetail {
  const key = useSyncExternalStore(
    subscribe,
    () => {
      if (!store) return "unknown";
      const d = storeStatusDetail(store);
      if (d.state === "open") return `open|${d.until}`;
      if (d.state === "closed") return `closed|${d.when ?? ""}|${d.opensAt ?? ""}`;
      return "unknown";
    },
    () => "unknown",
  );
  return useMemo<StoreStatusDetail>(() => {
    const [state, a, b] = key.split("|");
    if (state === "open") return { state: "open", until: a };
    if (state === "closed") return { state: "closed", when: (a || null) as "today" | "tomorrow" | null, opensAt: b || null };
    return { state: "unknown" };
  }, [key]);
}
