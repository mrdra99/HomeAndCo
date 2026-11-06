"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HoverLiftProps = { children: ReactNode; className?: string };

/**
 * Wrapper "card che si solleva": lift solo con puntatore fine (motion ignora l'hover
 * sui dispositivi touch), tap con scale .97. Aggiunge `group` per zoomare le immagini figlie.
 */
export function HoverLift({ children, className }: HoverLiftProps) {
  return (
    <m.div
      className={cn("group", className)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </m.div>
  );
}
