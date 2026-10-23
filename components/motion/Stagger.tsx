"use client";

import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type StaggerProps = { children: ReactNode; className?: string; gap?: number; as?: "div" | "ul" | "ol" };

/** Contenitore che anima in sequenza i figli <StaggerItem>. */
export function Stagger({ children, className, gap = 0.11, as: Tag = "div" }: StaggerProps) {
  return (
    <Tag
      className={className}
      data-reveal-gap={gap}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  return (
    <Reveal as={as} className={className} stagger>
      {children}
    </Reveal>
  );
}
