"use client";

import { useEffect, useRef, useState } from "react";
import { CampaignHero, HeroCard } from "@/components/campaign/CampaignHero";
import type { Campaign, HomeCopy } from "@/lib/content/schemas";
import { scrollBehavior } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = { campaigns: Campaign[]; buildCampaignId: string; buildDate: string; copy: HomeCopy["banner"]; className?: string };

/**
 * Apertura della home sotto 1024 px: le stesse slide del banner desktop (HomeBanner) come schede che si scorrono col dito.
 * Prima la campagna attiva per data (CampaignHero), poi le slide di content/home.json → banner con un titolo e senza
 * `soloDesktop` (le grafiche 3:1 con i testi dentro e i segnaposti restano al desktop). Nessuno scorrimento automatico:
 * la scheda successiva si intravede a destra e i pallini sotto dicono dove si e'. Le foto delle schede dopo la prima
 * sono lazy: si scaricano solo quando ci si avvicina.
 */
export function HomeHeroMobile({ campaigns, buildCampaignId, buildDate, copy, className }: Props) {
  const extra = copy.slide.filter((s) => s.titolo && !s.soloDesktop);
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = extra.length + 1;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const first = el.firstElementChild as HTMLElement | null;
        const step = first ? first.offsetWidth + 12 : el.clientWidth;
        setIndex(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / step))));
      });
    };
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", update);
    };
  }, [count]);

  if (extra.length === 0) return <CampaignHero campaigns={campaigns} buildCampaignId={buildCampaignId} buildDate={buildDate} className={className} />;

  const goTo = (i: number) => {
    const el = scroller.current;
    const target = el?.children[i] as HTMLElement | undefined;
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: scrollBehavior() });
  };

  return (
    <section aria-roledescription="carousel" aria-label={copy.aria} className={className}>
      <div
        ref={scroller}
        className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 sm:-mx-8 sm:scroll-px-8 sm:px-8"
      >
        <div role="group" aria-roledescription="slide" aria-label={`1 / ${count}`} className="w-[88%] shrink-0 snap-start">
          <CampaignHero campaigns={campaigns} buildCampaignId={buildCampaignId} buildDate={buildDate} className="h-full" />
        </div>
        {extra.map((slide, i) => (
          <div key={slide.titolo} role="group" aria-roledescription="slide" aria-label={`${i + 2} / ${count}`} className="w-[88%] shrink-0 snap-start">
            <HeroCard
              immagine={slide.immagine}
              titolo={slide.titolo!}
              etichetta={slide.etichetta}
              cta={slide.cta}
              sizes="(min-width: 640px) 860px, 88vw"
              className="h-full"
            >
              {slide.testo && <p className="mt-3 max-w-[30ch] text-sm leading-snug text-white/90">{slide.testo}</p>}
            </HeroCard>
          </div>
        ))}
      </div>
      <div className="mt-1 flex items-center justify-center">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={copy.vaiAllaSlide.replace("{n}", String(i + 1))}
            aria-current={i === index ? "true" : undefined}
            onClick={() => goTo(i)}
            className="flex h-11 items-center px-1.5"
          >
            <span className={cn("block h-2 rounded-full transition-all duration-300", i === index ? "w-8 bg-brand-magenta-600" : "w-2 bg-brand-blue-600/30")} />
          </button>
        ))}
      </div>
    </section>
  );
}
