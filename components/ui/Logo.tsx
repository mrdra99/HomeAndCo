import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** Su fondo scuro il marchio originale mantiene i colori su una base bianca. */
  variant?: "color" | "white";
  className?: string;
  priority?: boolean;
};

/** Marchio ufficiale, estratto in vettoriale dal PDF dell'insegna. */
export function Logo({ variant = "color", className, priority = false }: LogoProps) {
  return (
    <span className={cn("inline-flex w-48 max-w-full shrink-0", variant === "white" && "rounded-xl bg-white p-3", className)}>
      <Image src="/brand/logo.svg" alt="Home & Co." width={1056} height={294} unoptimized preload={priority} className="h-auto w-full" />
    </span>
  );
}
