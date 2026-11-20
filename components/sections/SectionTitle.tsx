import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionTitleProps = {
  id?: string;
  children: ReactNode;
  /** Riga di sostegno a destra (da sm) o sotto il titolo. */
  note?: ReactNode;
  className?: string;
  /** Su fondo pieno (magenta/blu) la barra e il testo diventano bianchi. */
  onColor?: boolean;
};

/**
 * Titolo di sezione da cartello: barra piena a sinistra, testo a sinistra, nessun centraggio.
 * Da 1024 px molto piu' grande (feedback del 20/11: titoli che si vedano); sotto 1024 px invariato.
 */
export function SectionTitle({ id, children, note, className, onColor }: SectionTitleProps) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6 lg:mb-9", className)}>
      <h2
        id={id}
        className={cn(
          "border-l-[6px] pl-3 !font-black lg:border-l-8 lg:pl-5 lg:!text-[clamp(2.75rem,3.5vw,4.25rem)] lg:!leading-[1] lg:!tracking-[-0.03em]",
          onColor ? "border-white text-white" : "border-brand-magenta-600 text-brand-blue-900",
        )}
      >
        {children}
      </h2>
      {note && <p className={cn("text-sm sm:text-base lg:max-w-md lg:text-lg", onColor ? "text-white/90" : "text-muted")}>{note}</p>}
    </div>
  );
}
