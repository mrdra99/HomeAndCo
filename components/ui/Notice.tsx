import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type NoticeProps = { children: ReactNode; title?: string; className?: string };

/** Avviso informativo: blu, bordo a sinistra, icona. Per condizioni in aggiornamento, stati, note di pagina. */
export function Notice({ children, title, className }: NoticeProps) {
  return (
    <div role="note" className={cn("flex gap-3 rounded-[var(--radius-md)] border border-brand-blue-100 border-l-[6px] border-l-brand-blue-600 bg-brand-blue-50 p-4 text-brand-blue-900", className)}>
      <Icon name="info" size={22} className="mt-0.5 shrink-0 text-brand-blue-700" />
      <div>
        {title && <p className="font-extrabold">{title}</p>}
        <div className={cn(title && "mt-0.5")}>{children}</div>
      </div>
    </div>
  );
}
