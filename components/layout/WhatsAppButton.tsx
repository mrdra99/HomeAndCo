import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = {
  /** Formato internazionale senza + (es. "393331234567"). null = numero non ancora fornito. */
  numero: string | null;
  messaggio: string;
  /** Pulsante tondo fisso in basso a destra, solo mobile. */
  floating?: boolean;
  label?: string;
  className?: string;
};

export function whatsappHref(numero: string, messaggio: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(messaggio)}`;
}

/**
 * Pulsante WhatsApp Business. Senza numero: in development mostra un badge TODO,
 * in production non renderizza nulla.
 */
export function WhatsAppButton({
  numero,
  messaggio,
  floating = false,
  label = "Scrivici su WhatsApp",
  className,
}: WhatsAppButtonProps) {
  if (!numero) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <span className="inline-flex rounded-full border-2 border-dashed border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
        TODO numero WhatsApp
      </span>
    );
  }
  return (
    <a
      href={whatsappHref(numero, messaggio)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={floating ? label : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 bg-[#0f7a43] font-semibold text-white shadow-soft transition-[transform,background-color] hover:bg-[#0c6637] active:scale-[0.97]",
        floating
          ? "fixed bottom-4 right-4 z-30 size-14 rounded-full md:hidden"
          : "min-h-12 rounded-full px-6",
        className,
      )}
    >
      <Icon name="whatsapp" size={floating ? 30 : 22} />
      {!floating && <span>{label}</span>}
    </a>
  );
}
