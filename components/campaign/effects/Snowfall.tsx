"use client";

import { useEffect, useRef } from "react";

type Flake = { x: number; y: number; r: number; vy: number; sway: number; phase: number; alpha: number };

const SPRITE = 32;

/**
 * Fiocco disegnato una volta sola: un disco morbido bianco appena azzurrato. Sui fondi scuri e' neve bianca,
 * sul bianco resta un puntino azzurro chiaro (un centro bianco puro con alone darebbe l'effetto "anello").
 */
function makeSprite(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = SPRITE;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
  g.addColorStop(0, "rgba(240,246,252,1)");
  g.addColorStop(0.4, "rgba(222,234,247,0.95)");
  g.addColorStop(0.7, "rgba(205,222,241,0.45)");
  g.addColorStop(1, "rgba(205,222,241,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SPRITE, SPRITE);
  return c;
}

/**
 * Neve che scende sulla pagina. Un solo canvas fisso, nessun clic intercettato, sotto la testata.
 * Si ferma quando la scheda non e' visibile. Montato solo da SeasonalEffects (desktop, senza movimento ridotto).
 */
export function Snowfall() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const sprite = makeSprite();
    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let frame = 0;
    let last = performance.now();

    const spawn = (anywhere: boolean): Flake => {
      const r = 1.4 + Math.random() ** 2 * 3.6;
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : -10,
        r,
        vy: 18 + r * 11 + Math.random() * 12,
        sway: 8 + Math.random() * 22,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.55 + Math.random() * 0.45,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, Math.max(40, width / 16)));
      flakes = flakes.slice(0, count);
      while (flakes.length < count) flakes.push(spawn(true));
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.phase += dt * 0.9;
        f.y += f.vy * dt;
        const x = f.x + Math.sin(f.phase) * f.sway;
        if (f.y - f.r > height) flakes[i] = spawn(false);
        const size = f.r * 4;
        ctx.globalAlpha = f.alpha;
        ctx.drawImage(sprite, x - size / 2, f.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    resize();
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" data-effect="neve" className="pointer-events-none fixed inset-0 z-30 h-dvh w-full" />;
}
