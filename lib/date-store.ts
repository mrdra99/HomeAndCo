"use client";

import { useSyncExternalStore } from "react";
import { toIsoDate } from "./campaigns";

/** Ricontrolla anche al ritorno su una scheda sospesa dal browser. */
export function subscribeToDateChange(notify: () => void) {
  const timer = window.setInterval(notify, 30_000);
  window.addEventListener("focus", notify);
  window.addEventListener("pageshow", notify);
  document.addEventListener("visibilitychange", notify);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", notify);
    window.removeEventListener("pageshow", notify);
    document.removeEventListener("visibilitychange", notify);
  };
}

/** Primo render identico all'HTML esportato, poi data reale nel fuso italiano. */
export function useToday(buildDate: string): Date {
  const iso = useSyncExternalStore(subscribeToDateChange, () => toIsoDate(), () => buildDate);
  return new Date(`${iso}T12:00:00Z`);
}
