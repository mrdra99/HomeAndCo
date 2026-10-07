"use client";

import { useId, useState } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

export type AccordionItem = { id?: string; domanda: string; risposta: string };

/**
 * Accordion accessibile: button + aria-expanded + regione collegata. Altezza animata con
 * il trucco grid-rows (0fr -> 1fr), senza transizione con prefers-reduced-motion.
 */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const base = useId();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className={cn("divide-y divide-brand-blue-100 rounded-lg bg-white shadow-soft", className)}>
      {items.map((it, i) => {
        const isOpen = open === i;
        const bid = `${base}-b${i}`;
        const pid = `${base}-p${i}`;
        return (
          <div key={it.id ?? it.domanda}>
            <h3>
              <button
                id={bid}
                type="button"
                aria-expanded={isOpen}
                aria-controls={pid}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg text-brand-blue-900"
              >
                {it.domanda}
                <Icon
                  name="arrow-right"
                  size={20}
                  className={cn(
                    "shrink-0 transition-transform duration-300 motion-reduce:transition-none",
                    isOpen ? "-rotate-90" : "rotate-90",
                  )}
                />
              </button>
            </h3>
            <div
              id={pid}
              role="region"
              aria-labelledby={bid}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-muted">{it.risposta}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
