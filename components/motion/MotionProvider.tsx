"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Provider alla radice: rispetta prefers-reduced-motion (reducedMotion="user")
 * e carica le feature di animazione in modo lazy. Con `strict` i componenti
 * devono usare `m` (non `motion`) per non appesantire il bundle.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 300, damping: 24 }}>
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
