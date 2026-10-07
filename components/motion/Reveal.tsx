"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Ritardo in secondi. */
  delay?: number;
  /** Spostamento verticale iniziale in px. */
  y?: number;
};

/** Fade + salita all'ingresso nel viewport, una sola volta. Solo opacity/transform. */
export function Reveal({ children, className, delay = 0, y = 16 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay }}
    >
      {children}
    </m.div>
  );
}
