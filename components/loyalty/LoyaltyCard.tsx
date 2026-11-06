import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

/** Tessera piatta a colore pieno (nessun numero, nessun tilt): usata nel riquadro della home e nella pagina carta. */
export function LoyaltyCard({ nome, className }: { nome: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={nome}
      className={cn("flex aspect-[1.586/1] w-full max-w-72 flex-col justify-between rounded-[var(--radius-lg)] bg-brand-blue-900 p-4", className)}
    >
      <Logo variant="white" className="w-28 rounded-md p-1.5" />
      <span className="text-sm font-extrabold uppercase tracking-wide text-white">{nome}</span>
    </div>
  );
}
