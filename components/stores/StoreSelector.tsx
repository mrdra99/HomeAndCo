"use client";

import { LazyMotion, m } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const loadMax = () => import("motion/react").then((mod) => mod.domMax);

type StoreSelectorProps = { stores: { id: string; citta: string }[] };

/**
 * Selettore a pill delle sedi: ancore (#id) con scroll fluido nativo; la pill attiva segue
 * la sede in vista (layoutId). domMax e' caricato solo qui (servono le animazioni di layout).
 */
export function StoreSelector({ stores }: StoreSelectorProps) {
  const [active, setActive] = useState(stores[0]?.id ?? "");

  useEffect(() => {
    const els = stores.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.2, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [stores]);

  return (
    <LazyMotion features={loadMax} strict>
      <nav aria-label="Scegli una sede" className="flex flex-wrap gap-2">
        {stores.map((s) => {
          const on = s.id === active;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setActive(s.id)}
              aria-current={on ? "true" : undefined}
              className={cn(
                "relative rounded-full px-5 py-2.5 font-semibold transition-colors",
                on ? "text-white" : "bg-white text-brand-blue-800 shadow-soft hover:bg-brand-blue-50",
              )}
            >
              {on && (
                <m.span
                  layoutId="store-pill"
                  className="absolute inset-0 rounded-full bg-brand-blue-700"
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                />
              )}
              <span className="relative">{s.citta}</span>
            </a>
          );
        })}
      </nav>
    </LazyMotion>
  );
}
