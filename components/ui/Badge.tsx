import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "magenta" | "blue" | "sand" | "white" | "accent";
  /** Gradi di rotazione per l'effetto sticker (consigliati 3-6). */
  rotate?: number;
};

const TONES = {
  magenta: "bg-brand-magenta-600 text-white",
  accent: "bg-accent text-white",
  blue: "bg-brand-blue-600 text-white",
  sand: "bg-sand text-brand-blue-900",
  white: "bg-white text-brand-blue-900",
} as const;

/** Etichetta/sticker. Con `rotate` diventa uno sticker inclinato. */
export function Badge({ tone = "magenta", rotate = 0, className, style, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1 text-sm font-bold leading-tight",
        rotate !== 0 && "font-display text-base shadow-pop",
        TONES[tone],
        className,
      )}
      style={rotate ? { transform: `rotate(${rotate}deg)`, ...style } : style}
      {...rest}
    />
  );
}

/** Alias semantico: sticker ruotato di 4 gradi di default. */
export function Sticker({ rotate = 4, ...rest }: BadgeProps) {
  return <Badge rotate={rotate} {...rest} />;
}
