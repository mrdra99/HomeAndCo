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

/** Titolo di sezione da cartello: barra piena a sinistra, testo a sinistra, nessun centraggio. */
export function SectionTitle({ id, children, note, className, onColor }: SectionTitleProps) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6", className)}>
      <h2 id={id} className={cn("border-l-[6px] pl-3 !font-black", onColor ? "border-white text-white" : "border-brand-magenta-600 text-brand-blue-900")}>
        {children}
      </h2>
      {note && <p className={cn("text-sm sm:text-base", onColor ? "text-white/90" : "text-muted")}>{note}</p>}
    </div>
  );
}
