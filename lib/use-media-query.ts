"use client";

import { useSyncExternalStore } from "react";

/** Da 1024 px: il breakpoint `lg` di Tailwind, dove iniziano gli elementi solo desktop. */
export const DESKTOP_QUERY = "(min-width: 1024px)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Media query reattiva. Sul server e al primo render e' sempre false: un elemento che dipende da
 * questo hook non esiste nell'HTML esportato e compare solo dopo l'idratazione, dove la query e' vera.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Vero solo su desktop e senza richiesta di movimento ridotto: la condizione di ogni effetto decorativo. */
export function useDesktopMotion(): boolean {
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  return desktop && !reduced;
}
