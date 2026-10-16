"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Ritardo in secondi. */
  delay?: number;
};

/** Contenuto sempre visibile nell'HTML, anche prima del caricamento di JavaScript. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay }}
    >
      {children}
    </m.div>
  );
}
