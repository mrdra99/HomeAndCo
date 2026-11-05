"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/** Wheel inertia on mouse/trackpad devices; phones keep their native touch scroll. */
export function SmoothScroll() {
  useEffect(() => {
    const enabled = window.matchMedia("(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)");
    let instance: Lenis | null = null;
    let locks: MutationObserver | null = null;
    let generation = 0;

    const configure = async () => {
      const current = ++generation;
      locks?.disconnect();
      instance?.destroy();
      instance = null;
      if (!enabled.matches) return;

      const { default: Lenis } = await import("lenis");
      if (current !== generation) return;
      instance = new Lenis({
        autoRaf: true,
        // Short damping tail: wheel input should feel responsive, not delayed.
        lerp: 0.16,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        // Lenis reads the shared CSS scroll-padding and each target's scroll-margin.
        anchors: true,
        stopInertiaOnNavigate: true,
        prevent: (node) => node.matches("textarea, select, [data-native-scroll]"),
      });

      // Stop existing inertia as soon as a menu or modal locks the page.
      const syncLock = () => {
        const blocked = document.body.style.overflow === "hidden" || document.documentElement.style.overflow === "hidden";
        if (blocked) instance?.stop();
        else if (instance?.isStopped) instance.start();
      };
      locks = new MutationObserver(syncLock);
      const options = { attributes: true, attributeFilter: ["style"] };
      locks.observe(document.body, options);
      locks.observe(document.documentElement, options);
      syncLock();
    };

    void configure();
    enabled.addEventListener("change", configure);
    return () => {
      generation++;
      enabled.removeEventListener("change", configure);
      locks?.disconnect();
      instance?.destroy();
    };
  }, []);

  return null;
}
