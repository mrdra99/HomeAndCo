import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export type SectionTone = "cream" | "sand" | "blue" | "magenta" | "magenta-soft" | "white";

const TONES: Record<SectionTone, string> = {
  cream: "bg-cream text-ink",
  sand: "bg-sand text-ink",
  white: "bg-white text-ink",
  "magenta-soft": "bg-brand-magenta-50 text-ink",
  /** Blu pieno del logo (orientamento). Bianco su #0f6bb4 = 5.55:1. */
  blue: "bg-brand-blue-600 text-white on-dark",
  /** Magenta pieno (commerciale: volantino). Bianco su #d11559 = 5.30:1. */
  magenta: "bg-brand-magenta-600 text-white on-dark",
};

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: SectionTone;
  /** Angoli arrotondati (14 px) per sezioni a colore pieno inserite in pagina. */
  rounded?: boolean;
  /** Ancora per i link interni (es. "dove-siamo"). */
  id?: string;
  containerSize?: "narrow" | "default" | "wide";
};

export function Section({
  tone = "cream",
  rounded = false,
  containerSize = "default",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-9 sm:py-14",
        TONES[tone],
        rounded && "rounded-[var(--radius-xl)]",
        className,
      )}
      {...rest}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
