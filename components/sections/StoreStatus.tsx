"use client";

import { statusText } from "@/components/layout/StoreChip";
import { useOpenStatusDetail } from "@/components/stores/useOpenStatus";
import type { HeaderCopy, Store } from "@/lib/content/schemas";
import { hoursSummary } from "@/lib/stores";
import { cn } from "@/lib/utils";

type Props = {
  store: Store;
  copy: HeaderCopy["negozio"];
  /** Testo neutro prima del mount, ad es. "Tutti i giorni" + orario. */
  neutralPrefix: string;
  /** "light" su fondi scuri, "dark" su fondi chiari. */
  tone: "light" | "dark";
  className?: string;
};

/**
 * Stato del negozio in una riga ad altezza fissa. Server e primo render del client mostrano il testo
 * neutro con l'orario fisso (stesso ingombro), poi, dopo il mount, "Aperto fino alle 20:00" / "Chiuso ...".
 */
export function StoreStatus({ store, copy, neutralPrefix, tone, className }: Props) {
  const detail = useOpenStatusDetail(store);
  const text = statusText(detail, copy);
  const { uniform } = hoursSummary(store);
  const neutral = [neutralPrefix, uniform?.replace("-", "–")].filter(Boolean).join(" ");
  const light = tone === "light";
  return (
    <span className={cn("flex min-h-5 items-center gap-2 text-sm", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "size-2.5 shrink-0 rounded-full border-2",
          detail.state === "unknown" && "border-transparent",
          detail.state === "open" && (light ? "border-white bg-white" : "border-brand-blue-600 bg-brand-blue-600"),
          detail.state === "closed" && (light ? "border-white/70" : "border-muted"),
        )}
      />
      <span className={cn("font-semibold", detail.state === "unknown" && "font-normal", light ? "text-white" : "text-brand-blue-900")}>
        {text || neutral}
      </span>
    </span>
  );
}
