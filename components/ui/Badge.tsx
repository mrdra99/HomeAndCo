import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "magenta" | "blue" | "sand" | "white" | "accent";
};

const TONES = {
  magenta: "bg-brand-magenta-600 text-white",
  accent: "bg-accent text-[var(--accent-contrast)]",
  blue: "bg-brand-blue-600 text-white",
  sand: "bg-sand text-brand-blue-900",
  white: "bg-white text-brand-blue-900",
} as const;

/** Etichetta rettangolare arrotondata, a colore pieno. Nessuna inclinazione. */
export function Badge({ tone = "magenta", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-md px-2.5 py-1 text-sm font-bold leading-tight", TONES[tone], className)}
      {...rest}
    />
  );
}
