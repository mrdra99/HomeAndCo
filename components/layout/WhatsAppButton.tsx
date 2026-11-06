import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = {
  /** Formato internazionale senza + (es. "393331234567"). null = numero non ancora fornito. */
  numero: string | null;
  messaggio: string;
  /** Pulsante tondo fisso in basso a destra, sopra la tab bar mobile; nascosto da 1024 px in su. */
  floating?: boolean;
  label?: string;
  className?: string;
};

export function whatsappHref(numero: string, messaggio: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(messaggio)}`;
}

/**
 * Pulsante WhatsApp Business. Senza numero (oggi non ne esiste uno confermato) non renderizza nulla, in ogni
 * ambiente: nessun badge di sviluppo. Il colore e' il blu del marchio (contatto/orientamento), non il verde
 * di WhatsApp: il riconoscimento lo danno il simbolo e l'etichetta, e la palette resta quella del logo.
 */
export function WhatsAppButton({
  numero,
  messaggio,
  floating = false,
  label = "Scrivici su WhatsApp",
  className,
}: WhatsAppButtonProps) {
  if (!numero) return null;
  return (
    <a
      href={whatsappHref(numero, messaggio)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={floating ? label : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 on-dark bg-brand-blue-600 font-bold text-white transition-colors hover:bg-brand-blue-700",
        floating
          ? "fixed bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.75rem)] right-[max(1rem,env(safe-area-inset-right))] z-30 size-14 rounded-full border-2 border-white lg:hidden"
          : "min-h-12 rounded-md px-6",
        className,
      )}
    >
      <Icon name="whatsapp" size={floating ? 30 : 22} />
      {!floating && <span>{label}</span>}
    </a>
  );
}
