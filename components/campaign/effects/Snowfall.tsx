"use client";

import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  size: number;
  vy: number;
  sway: number;
  phase: number;
  angle: number;
  spin: number;
  alpha: number;
  sprite: number;
};

const SPRITE = 96;

/** Tre disegni di cristallo a sei punte (rami diversi) e un fiocco rotondo morbido per la profondita'. */
function makeSprites(): HTMLCanvasElement[] {
  const crystal = (branches: number[], tip: boolean) => {
    const c = document.createElement("canvas");
    c.width = c.height = SPRITE;
    const ctx = c.getContext("2d")!;
    const r = SPRITE * 0.38;
    ctx.translate(SPRITE / 2, SPRITE / 2);
    ctx.lineCap = "round";
    // Ombra blu del marchio: sul bianco il cristallo ha un contorno netto, sul blu resta neve bianca.
    ctx.shadowColor = "rgba(11,42,71,0.55)";
    ctx.shadowBlur = 5;
    ctx.strokeStyle = "#ffffff";
    for (let arm = 0; arm < 6; arm++) {
      ctx.save();
      ctx.rotate((Math.PI / 3) * arm);
      ctx.lineWidth = SPRITE * 0.05;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -r);
      ctx.stroke();
      ctx.lineWidth = SPRITE * 0.038;
      for (const b of branches) {
        const y = -r * b;
        const len = r * (0.36 - b * 0.18);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(-len, y - len * 0.9);
        ctx.moveTo(0, y);
        ctx.lineTo(len, y - len * 0.9);
        ctx.stroke();
      }
      if (tip) {
        ctx.beginPath();
        ctx.arc(0, -r, SPRITE * 0.035, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, SPRITE * 0.06, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    return c;
  };
  const dot = () => {
    const c = document.createElement("canvas");
    c.width = c.height = SPRITE;
    const ctx = c.getContext("2d")!;
    ctx.shadowColor = "rgba(11,42,71,0.5)";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(SPRITE / 2, SPRITE / 2, SPRITE * 0.2, 0, Math.PI * 2);
    ctx.fill();
    return c;
  };
  return [crystal([0.45, 0.72], false), crystal([0.35, 0.6], true), crystal([0.55], true), dot()];
}

/**
 * Neve che scende sulla pagina: cristalli a sei punte che ruotano piano, di misure diverse, piu' qualche fiocco
 * rotondo piccolo per dare profondita'. Un solo canvas fisso, nessun clic intercettato, sotto la testata; si ferma
 * quando la scheda non e' visibile. Montato solo da SeasonalEffects (desktop, senza movimento ridotto).
 */
export function Snowfall() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const sprites = makeSprites();
    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let frame = 0;
    let last = performance.now();

    const spawn = (anywhere: boolean): Flake => {
      const isDot = Math.random() < 0.3;
      // Cristalli da 12 a 30 px (i piu' vicini scendono piu' veloci), puntini da 6 a 11 px.
      const depth = Math.random();
      const size = isDot ? 6 + depth * 5 : 12 + depth ** 1.6 * 18;
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : -size,
        size,
        vy: 22 + depth * 46,
        sway: 10 + Math.random() * 26,
        phase: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 1.1,
        alpha: 0.8 + depth * 0.2,
        sprite: isDot ? 3 : Math.floor(Math.random() * 3),
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, Math.max(36, width / 20)));
      flakes = flakes.slice(0, count);
      while (flakes.length < count) flakes.push(spawn(true));
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = canvas.width / width;
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.phase += dt * 0.8;
        f.y += f.vy * dt;
        f.angle += f.spin * dt;
        if (f.y - f.size > height) {
          flakes[i] = spawn(false);
          continue;
        }
        const x = f.x + Math.sin(f.phase) * f.sway;
        ctx.setTransform(dpr, 0, 0, dpr, x * dpr, f.y * dpr);
        ctx.rotate(f.angle);
        ctx.globalAlpha = f.alpha;
        const s = f.size * (SPRITE / (SPRITE * 0.76));
        ctx.drawImage(sprites[f.sprite], -s / 2, -s / 2, s, s);
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
