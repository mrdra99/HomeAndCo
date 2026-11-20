"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Icon, isIconName } from "@/components/ui/Icon";
import type { HomeCopy } from "@/lib/content/schemas";

/** Inclinazione massima della scheda verso il cursore, in gradi. */
const TILT = 7;

/** Inclina la scheda verso il mouse e sposta il riflesso di luce (variabili CSS, nessun re-render). Solo mouse. */
function onTilt(e: PointerEvent<HTMLLIElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  el.style.setProperty("--rx", `${((0.5 - y) * TILT).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${((x - 0.5) * TILT).toFixed(2)}deg`);
}
function onTiltEnd(e: PointerEvent<HTMLLIElement>) {
  const el = e.currentTarget;
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
}

/**
 * Fascia fatti. Mobile: due colonne con tutti i fatti, invariata.
 * Desktop: solo i fatti `desktop` (oggi tre) come schede di vetro su uno sfondo fluido (forme sfocate che si muovono
 * piano), che entrano una dopo l'altra quando la fascia arriva sullo schermo; l'icona sta in una goccia che cambia
 * forma, e al passaggio del mouse la scheda si inclina verso il cursore con un riflesso di luce.
 * Animazioni solo CSS (app/globals.css → .facts-*), spente con movimento ridotto.
 */
export function FactsStrip({ facts, label }: { facts: HomeCopy["fatti"]; label: string }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} aria-label={label} data-inview={inView || undefined} className="facts border-y border-brand-blue-100 bg-brand-blue-50 lg:relative lg:isolate lg:overflow-hidden lg:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        <span className="facts-blob facts-blob-1" />
        <span className="facts-blob facts-blob-2" />
        <span className="facts-blob facts-blob-3" />
        <span className="facts-blob facts-blob-4" />
      </div>
      <Container size="wide" className="px-0 sm:px-8">
        <ul className="grid grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:[perspective:1100px]">
          {facts.map((fact, i) => (
            <li
              key={fact.titolo}
              style={{ "--i": i } as CSSProperties}
              onPointerMove={onTilt}
              onPointerLeave={onTiltEnd}
              className={`facts-card flex items-center gap-3 px-4 py-3 sm:px-5 lg:gap-5 lg:px-7 lg:py-8 ${i % 2 === 1 ? "border-l border-brand-blue-100" : ""} ${i > 1 ? "border-t border-brand-blue-100 lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-brand-blue-100" : ""} ${fact.desktop ? "" : "lg:hidden"}`}
            >
              <span className="facts-icon flex size-11 shrink-0 items-center justify-center rounded-md bg-brand-blue-600 text-white lg:size-[4.5rem]">
                <Icon name={isIconName(fact.icona) ? fact.icona : "check"} size={24} className="relative lg:size-9" />
              </span>
              <span className="relative min-w-0 leading-tight">
                <span className="block text-sm font-extrabold text-brand-blue-900 sm:text-base lg:text-[1.375rem] lg:font-black xl:text-[1.625rem]">{fact.titolo}</span>
                <span className="block text-xs text-muted sm:text-sm lg:mt-1.5 lg:text-base">{fact.testo}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
