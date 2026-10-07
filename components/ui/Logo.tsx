/**
 * LOGO PROVVISORIO — wordmark testuale "Home & Co." (blu + magenta, font display).
 *
 * Per sostituirlo con il logo vero:
 *  1. copiare il file vettoriale in /public/brand/logo.svg (e /public/brand/logo-white.svg);
 *  2. in questo file sostituire il corpo di <Logo /> con
 *       <Image src="/brand/logo.svg" alt="Home & Co." width={140} height={40} priority />
 *     (scegliere logo-white.svg quando variant="white");
 *  3. nessun altro file va toccato: il logo e' usato solo tramite questo componente.
 */
import { cn } from "@/lib/utils";

type LogoProps = {
  /** "color" per fondi chiari, "white" per fondi blu/scuri. */
  variant?: "color" | "white";
  className?: string;
};

export function Logo({ variant = "color", className }: LogoProps) {
  const white = variant === "white";
  return (
    <span
      className={cn("inline-flex items-baseline font-display text-2xl font-bold leading-none tracking-tight", className)}
      aria-label="Home & Co."
      role="img"
    >
      <span aria-hidden className={white ? "text-white" : "text-brand-blue-600"}>Home</span>
      <span aria-hidden className={cn("mx-[0.18em]", white ? "text-white/90" : "text-brand-magenta-600")}>&amp;</span>
      <span aria-hidden className={white ? "text-white" : "text-brand-blue-600"}>Co</span>
      <span aria-hidden className={white ? "text-white" : "text-brand-magenta-600"}>.</span>
    </span>
  );
}
