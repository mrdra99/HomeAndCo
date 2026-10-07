"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useConsent } from "./ConsentProvider";

/** Pulsante in stile link che riapre le preferenze cookie (footer, cookie policy). */
export function CookiePreferencesLink({ children = "Preferenze cookie", className }: { children?: ReactNode; className?: string }) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={cn("underline underline-offset-4", className)}>
      {children}
    </button>
  );
}
