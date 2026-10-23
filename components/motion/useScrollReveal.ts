"use client";

import { useEffect, type RefObject } from "react";

/** Progressive enhancement: server HTML stays readable, only offscreen content is armed. */
export function useScrollReveal(ref: RefObject<HTMLElement | null>, delay: number, stagger: boolean) {
  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || node.getBoundingClientRect().top < window.innerHeight) return;
    // Caroselli orizzontali: le card fuori schermo a destra non devono restare invisibili
    // ne' comparire con un salto durante lo swipe (l'observer le vede solo quando entrano).
    if (node.parentElement && /auto|scroll/.test(getComputedStyle(node.parentElement).overflowX)) return;

    let finished = false;
    const complete = () => {
      finished = true;
      node.dataset.reveal = "complete";
      observer.disconnect();
    };
    const show = () => {
      if (finished) return;
      finished = true;
      let wait = delay;
      if (stagger && node.parentElement) {
        const parent = node.parentElement;
        const layout = getComputedStyle(parent);
        const columns = layout.display === "grid" ? layout.gridTemplateColumns.split(" ").length : 1;
        const index = Array.from(parent.children).indexOf(node);
        wait += (index % columns) * Number(parent.dataset.revealGap ?? 0.11);
      }
      node.style.setProperty("--reveal-delay", `${Math.min(Math.max(wait, 0), 0.45)}s`);
      node.dataset.reveal = "entering";
      observer.disconnect();
    };
    const onPreference = () => { if (reduced.matches) complete(); };
    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target === node && event.animationName === "scroll-reveal-in") complete();
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) show();
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.06 });

    node.dataset.reveal = "pending";
    observer.observe(node);
    node.addEventListener("focusin", complete);
    node.addEventListener("animationend", onAnimationEnd);
    reduced.addEventListener("change", onPreference);
    return () => {
      observer.disconnect();
      node.removeEventListener("focusin", complete);
      node.removeEventListener("animationend", onAnimationEnd);
      reduced.removeEventListener("change", onPreference);
      node.dataset.reveal = "ready";
      node.style.removeProperty("--reveal-delay");
    };
  }, [ref, delay, stagger]);
}
