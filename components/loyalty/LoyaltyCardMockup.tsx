"use client";

import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type LoyaltyCardMockupProps = {
  /** Nome del programma (da content/loyalty.json). */
  nome: string;
  className?: string;
};

/** Mockup della tessera (gradiente blu->magenta) con leggero tilt 3D al passaggio/trascinamento. */
export function LoyaltyCardMockup({ nome, className }: LoyaltyCardMockupProps) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 300, damping: 24 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), spring);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      className={cn("mx-auto w-full max-w-sm [perspective:900px]", className)}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerUp={reset}
      style={{ touchAction: "pan-y" }}
    >
      <m.div
        role="img"
        aria-label={`Tessera ${nome}`}
        className="relative aspect-[1.586/1] w-full -rotate-3 overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-brand-blue-600 via-brand-blue-700 to-brand-magenta-600 p-6 text-white shadow-pop"
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div aria-hidden className="absolute -right-10 -top-10 size-44 rounded-full bg-white/10" />
        <div aria-hidden className="absolute -bottom-16 -left-8 size-48 rounded-full bg-brand-magenta-600/40" />
        <div className="relative flex h-full flex-col justify-between">
          <Logo variant="white" className="text-3xl" />
          <div>
            <p className="font-display text-xl leading-tight">{nome}</p>
            <p aria-hidden className="mt-2 font-mono text-sm tracking-[0.3em] text-white/80">
              •••• •••• 2026
            </p>
          </div>
        </div>
      </m.div>
    </div>
  );
}
