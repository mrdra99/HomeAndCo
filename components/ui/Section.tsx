import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

export type SectionTone = "cream" | "sand" | "blue" | "magenta-soft" | "white";

const TONES: Record<SectionTone, string> = {
  cream: "bg-cream text-ink",
  sand: "bg-sand text-ink",
  white: "bg-white text-ink",
  "magenta-soft": "bg-brand-magenta-50 text-ink",
  blue: "bg-brand-blue-700 text-white on-dark grain-light",
};

type SectionProps = HTMLAttributes<HTMLElement> & {
  tone?: SectionTone;
  /** Angoli arrotondati grandi (sezioni a colore pieno). */
  rounded?: boolean;
  /** Grana SVG sul fondo (sempre attiva sul tono blu). */
  grain?: boolean;
  /** Ancora per i link interni (es. "dove-siamo"). */
  id?: string;
  containerSize?: "narrow" | "default" | "wide";
};

export function Section({
  tone = "cream",
  rounded = false,
  grain = false,
  containerSize = "default",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-12 sm:py-24",
        TONES[tone],
        rounded && "rounded-[var(--radius-xl)]",
        (grain || tone === "blue") && "grain",
        className,
      )}
      {...rest}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
