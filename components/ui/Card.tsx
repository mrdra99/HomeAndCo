import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  tone?: "white" | "sand" | "blue" | "magenta-soft";
  /** Rimuove il padding (per card con immagine a filo). */
  flush?: boolean;
};

const TONES = {
  white: "bg-white text-ink ring-1 ring-brand-blue-100",
  sand: "bg-sand text-ink",
  "magenta-soft": "bg-brand-magenta-50 text-ink",
  blue: "bg-brand-blue-600 text-white on-dark",
} as const;

export function Card({ as: Tag = "div", tone = "white", flush = false, className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn("overflow-hidden rounded-lg", TONES[tone], !flush && "p-4 sm:p-6", className)}
      {...rest}
    />
  );
}
