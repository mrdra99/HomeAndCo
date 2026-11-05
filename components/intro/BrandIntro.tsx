"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Logo } from "@/components/ui/Logo";
import { BRAND_INTRO_ATTRIBUTE } from "@/lib/brand-intro";

function subscribe(listener: () => void) {
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: [BRAND_INTRO_ATTRIBUTE] });
  return () => observer.disconnect();
}

/** Keep the consent dialog from appearing over the opening animation. */
export function useBrandIntroActive() {
  return useSyncExternalStore(subscribe, () => document.documentElement.hasAttribute(BRAND_INTRO_ATTRIBUTE), () => false);
}

function finishIntro() {
  document.documentElement.removeAttribute(BRAND_INTRO_ATTRIBUTE);
}

/** Decorative entrance: the underlying page remains rendered and usable. */
export function BrandIntro() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Escape") finishIntro();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", finishIntro, { once: true, passive: true });
    document.addEventListener("wheel", finishIntro, { once: true, passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", finishIntro);
      document.removeEventListener("wheel", finishIntro);
    };
  }, []);

  return (
    <div className="brand-intro" aria-hidden="true" onAnimationEnd={(event) => {
      if (event.animationName === "brand-intro-wipe") finishIntro();
    }}>
      <div className="brand-intro__veil" />
      <div className="brand-intro__logo"><Logo priority className="!w-full" /></div>
    </div>
  );
}
