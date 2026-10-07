import { cn } from "@/lib/utils";

type PlaceholderProps = {
  /** Rapporto d'aspetto CSS, es. "4/3", "16/9", "1/1". */
  /** Se omesso il riquadro riempie il contenitore (h-full). */
  ratio?: string;
  /** Cosa va qui, es. "Foto corridoio Casa e cucina". Anche aria-label. */
  label: string;
  className?: string;
  rounded?: string;
};

/**
 * Segnaposto immagine chiaramente riconoscibile (tratteggio + icona + etichetta).
 * Ogni uso va censito in ASSETS_TODO.md.
 */
export function Placeholder({ ratio, label, className, rounded = "rounded-md" }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Immagine da inserire: ${label}`}
      data-placeholder
      style={ratio ? { aspectRatio: ratio } : undefined}
      className={cn(
        "relative flex w-full", !ratio && "h-full", " flex-col items-center justify-center gap-2 overflow-hidden border-2 border-dashed border-brand-blue-600/40 p-4 text-center text-brand-blue-800",
        "bg-brand-blue-50 [background-image:repeating-linear-gradient(135deg,transparent_0_12px,rgb(11_108_176/0.07)_12px_24px)]",
        rounded,
        className,
      )}
    >
      <svg aria-hidden viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <circle cx="9" cy="10" r="1.8" />
        <path d="m4 18 5-5 4 4 3-3 4 4" />
      </svg>
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-xs uppercase tracking-wider opacity-70">Foto da inserire</span>
    </div>
  );
}
