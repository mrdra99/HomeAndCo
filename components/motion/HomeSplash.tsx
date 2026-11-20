"use client";

import { useLayoutEffect, useState, useSyncExternalStore } from "react";
import { SPLASH_SEEN_KEY } from "@/lib/splash";
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY } from "@/lib/use-media-query";

const subscribeNothing = () => () => {};

/**
 * Decisione presa una volta per caricamento di pagina (prima lettura nel client): niente splash se non e' desktop,
 * se c'e' movimento ridotto o se e' gia' stato visto. Memorizzata, perche' subito dopo lo si segna come visto.
 */
let decided: boolean | undefined;
function shouldSkip(): boolean {
  if (decided === undefined) {
    let seen = false;
    try {
      seen = Boolean(localStorage.getItem(SPLASH_SEEN_KEY));
    } catch {
      /* storage non disponibile */
    }
    decided = seen || !window.matchMedia(DESKTOP_QUERY).matches || window.matchMedia(REDUCED_MOTION_QUERY).matches;
  }
  return decided;
}

/**
 * Splash del marchio alla prima visita della home, solo desktop (da 1024 px) e mai con movimento ridotto.
 * Sequenza tutta in CSS (app/globals.css → .home-splash*), quindi parte anche prima dell'idratazione: il cuore entra con
 * un rimbalzo e un'onda, compare la scritta, poi lo schermo bianco sale e scopre la home seguito da una banda magenta.
 * Dura meno di 2,2 s; un clic o un tasto lo chiudono subito. Decorativo: aria-hidden, nessun focus intrappolato.
 * Chi l'ha gia' visto non lo rivede: lo nasconde lo script SPLASH_SEEN_SCRIPT (lib/splash.ts, caricato in app/layout.tsx) prima del disegno.
 */
export function HomeSplash() {
  const skip = useSyncExternalStore(subscribeNothing, shouldSkip, () => false);
  const [gone, setGone] = useState(false);

  const finish = () => {
    document.documentElement.setAttribute("data-splash", "seen");
    setGone(true);
  };

  // Da mostrare: segnato subito come visto (un ricaricamento a meta' animazione non lo ripete); un tasto lo chiude.
  useLayoutEffect(() => {
    // shouldSkip() e non `skip`: durante l'idratazione `skip` vale ancora il valore del server (false).
    if (shouldSkip()) return;
    try {
      localStorage.setItem(SPLASH_SEEN_KEY, "1");
    } catch {
      /* storage non disponibile: lo splash compare a ogni visita, nessun danno */
    }
    const onKey = () => {
      document.documentElement.setAttribute("data-splash", "seen");
      setGone(true);
    };
    window.addEventListener("keydown", onKey, { once: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  if (skip || gone) return null;

  return (
    <div
      aria-hidden="true"
      className="home-splash fixed inset-0 z-[80] hidden lg:block"
      onClick={finish}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) finish();
      }}
    >
      <div className="home-splash-band absolute inset-0 bg-brand-magenta-600" />
      <div className="home-splash-sheet absolute inset-0 flex items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          <span className="home-splash-ring absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-brand-magenta-600" />
          <span className="home-splash-ring home-splash-ring-2 absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-brand-blue-600" />
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG del marchio, nessuna variante da generare */}
          <img src="/brand/logo.svg" alt="" className="home-splash-heart relative block w-[26rem]" draggable={false} />
        </div>
      </div>
    </div>
  );
}
