import Image from "next/image";
import { cn } from "@/lib/utils";
import { Placeholder } from "./Placeholder";

type SmartImageProps = {
  /** Percorso sotto /public (es. "/uploads/aisles/casa.jpg"). Se null/assente: Placeholder. */
  src?: string | null;
  alt: string;
  /** Rapporto d'aspetto CSS, es. "4/3". */
  /** Se omesso riempie il contenitore (h-full). */
  ratio?: string;
  /** Etichetta del segnaposto (usata solo senza src). */
  label: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  rounded?: string;
  imgClassName?: string;
  fit?: "cover" | "contain";
  position?: string;
};

/**
 * Immagine con fallback: in produzione basta valorizzare il percorso nel file dati
 * e il segnaposto sparisce da solo.
 */
export function SmartImage({
  src,
  alt,
  ratio,
  label,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  className,
  rounded = "rounded-md",
  imgClassName,
  fit = "cover",
  position,
}: SmartImageProps) {
  if (!src) return <Placeholder ratio={ratio} label={label} className={className} rounded={rounded} />;
  return (
    <div className={cn("relative w-full overflow-hidden", !ratio && "h-full", rounded, className)} style={ratio ? { aspectRatio: ratio } : undefined}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={priority}
        className={cn(fit === "contain" ? "object-contain" : "object-cover", "transition-transform duration-500 group-hover:scale-[1.04]", imgClassName)}
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}
