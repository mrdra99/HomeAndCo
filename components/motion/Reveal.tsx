"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "./useScrollReveal";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Ritardo in secondi. */
  delay?: number;
  as?: "div" | "li";
  /** Sequence only the columns currently entering the viewport, never an entire long list. */
  stagger?: boolean;
};

/** Contenuto sempre visibile nell'HTML, anche prima del caricamento di JavaScript. */
export function Reveal({ children, className, delay = 0, as: Tag = "div", stagger = false }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const setRef = useCallback((node: HTMLElement | null) => { ref.current = node; }, []);
  useScrollReveal(ref, delay, stagger);
  return (
    <Tag
      ref={setRef}
      className={cn("scroll-reveal", className)}
      data-reveal="ready"
    >
      {children}
    </Tag>
  );
}
