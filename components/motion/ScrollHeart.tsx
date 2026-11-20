"use client";

import { m, useScroll, useSpring, useTransform } from "motion/react";
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY, useMediaQuery } from "@/lib/use-media-query";

/** Simbolo del marchio (cuore + casa) in trasparenza; misura e opacita' in un solo posto. */
const HEART = "/brand/symbol.svg";
const SIZE = "min(46vw, 44rem)";

/**
 * Cuore del marchio fisso sullo sfondo, solo desktop. Scorrendo compare, scivola dal bordo destro verso il centro
 * e si inclina a sinistra; la molla smorza lo scroll della rotellina. Nessun clic intercettato, sotto testata e neve.
 * Con movimento ridotto resta fermo e inclinato. Sotto 1024 px non viene montato.
 */
export function ScrollHeart() {
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
  if (!desktop) return null;
  return reduced ? <StaticHeart /> : <MovingHeart />;
}

/*
 * mix-blend-multiply: sul bianco il cuore si vede netto nei colori del marchio, sul testo scuro sparisce
 * (moltiplicare per il blu scuro resta blu scuro), quindi la leggibilita' non cambia.
 */
const layer = "pointer-events-none fixed right-[-8vw] top-1/2 z-[25] select-none mix-blend-multiply";

function MovingHeart() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 18, mass: 0.5 });
  const opacity = useTransform(p, [0, 0.04, 0.16, 1], [0, 0, 0.2, 0.2]);
  const x = useTransform(p, [0, 1], ["0vw", "-36vw"]);
  const rotate = useTransform(p, [0, 1], [14, -36]);
  const scale = useTransform(p, [0, 0.5, 1], [0.78, 1.1, 1.2]);
  return (
    <m.div aria-hidden="true" data-effect="cuore" className={layer} style={{ width: SIZE, y: "-50%", x, rotate, scale, opacity }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG decorativo, nessuna variante da generare */}
      <img src={HEART} alt="" className="block h-auto w-full" draggable={false} />
    </m.div>
  );
}

function StaticHeart() {
  return (
    <div aria-hidden="true" data-effect="cuore" className={layer} style={{ width: SIZE, transform: "translate(-12vw, -50%) rotate(-14deg)", opacity: 0.14 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG decorativo */}
      <img src={HEART} alt="" className="block h-auto w-full" draggable={false} />
    </div>
  );
}
