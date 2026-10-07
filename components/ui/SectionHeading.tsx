import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  /** Su fondi scuri. */
  inverted?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  as: Tag = "h2",
  align = "left",
  inverted = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-bold uppercase tracking-[0.14em]",
            inverted ? "text-brand-magenta-100" : "text-brand-magenta-700",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag className={inverted ? "text-white" : "text-brand-blue-900"}>{title}</Tag>
      {subtitle && (
        <p className={cn("mt-4 text-lg", inverted ? "text-white/85" : "text-muted")}>{subtitle}</p>
      )}
    </div>
  );
}
