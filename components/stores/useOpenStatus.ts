"use client";

import { useSyncExternalStore } from "react";
import type { Store } from "@/lib/content/schemas";
import { isOpenNow } from "@/lib/stores";

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
