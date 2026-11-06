"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Aisle, Campaign, HomeCopy } from "@/lib/content/schemas";
import { scrollBehavior } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useActiveCampaign } from "./useActiveCampaign";

type Props = { campaigns: Campaign[]; buildCampaignId: string; copy: HomeCopy["idee"]; aisles: Pick<Aisle, "slug" | "titoloBreve">[] };

/**
 * Rail orizzontale con scroll-snap della campagna in corso. Il contenitore scorrevole e' focalizzabile
 * (frecce da tastiera) e ha due pulsanti da 44 px; ogni scheda e' un link. Nessun prezzo.
 * Immagini 1800 px mostrate a 300 px al massimo.
 */
export function CampaignCollection({ campaigns, buildCampaignId, copy, aisles }: Props) {
  const names = new Map(aisles.map((a) => [a.slug, a.titoloBreve]));
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const scroller = useRef<HTMLDivElement>(null);
  const collection = campaign.collezione;
  // Frecce: spente all'inizio e alla fine dello scorrimento, nascoste se non c'e' overflow.
  const [edges, setEdges] = useState({ overflow: false, start: true, end: true });
  const hasCollection = Boolean(collection);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () =>
      setEdges({
        overflow: el.scrollWidth > el.clientWidth + 4,
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [hasCollection, campaign.id]);

  if (!collection) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: scrollBehavior() });
  };
  const arrowCls = "flex size-11 items-center justify-center rounded-md bg-brand-blue-600 text-white hover:bg-brand-blue-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-brand-blue-600";

  return (
    <section id="idee-di-stagione" aria-labelledby="collection-title" className="bg-brand-blue-50 py-7 sm:py-10">
      <Container size="wide">
        <div className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
          <div className="min-w-0">
            <h2 id="collection-title" className="border-l-[6px] border-brand-magenta-600 pl-3 !font-black text-brand-blue-900">
              {collection.titolo}
            </h2>
            <p className="mt-1 pl-[1.125rem] text-sm text-muted sm:text-base">{collection.descrizione}</p>
          </div>
          <div className={cn("hidden shrink-0 gap-2", edges.overflow && "sm:flex")}>
            <button type="button" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label={copy.scorriPrecedente} className={arrowCls}>
              <Icon name="arrow-right" size={22} className="rotate-180" />
            </button>
            <button type="button" onClick={() => scrollBy(1)} disabled={edges.end} aria-label={copy.scorriSuccessivo} className={arrowCls}>
              <Icon name="arrow-right" size={22} />
            </button>
          </div>
        </div>
      </Container>
      <Container size="wide" className="px-0 sm:px-8">
        <div
          ref={scroller}
          tabIndex={0}
          role="region"
          aria-label={copy.regione}
          className="hide-scrollbar snap-x snap-mandatory overflow-x-auto scroll-px-5 px-5 pb-1 sm:scroll-px-0 sm:px-0"
        >
        <ul className="flex gap-3">
          {collection.idee.map((idea) => (
            <li key={idea.titolo} className="w-[72%] shrink-0 snap-start sm:w-[calc((100%-2.25rem)/3.2)] lg:w-[calc((100%-3.75rem)/4.4)]">
              <Link href={`/corridoi/${idea.corridoio}/`} className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border-2 border-brand-blue-100 bg-white hover:border-brand-blue-600">
                {idea.immagine?.src ? (
                  <SmartImage
                    src={idea.immagine.src}
                    alt=""
                    label={idea.titolo}
                    ratio="4/3"
                    position={idea.immagine.position}
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 230px, 72vw"
                    rounded="rounded-none"
                    imgClassName="group-hover:scale-100"
                  />
                ) : null}
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <h3 className="!text-lg text-brand-blue-900">{idea.titolo}</h3>
                  <p className="mt-1 text-sm text-muted">{idea.testo}</p>
                  <span className="mt-auto flex min-h-11 items-center gap-2 pt-2 text-sm font-extrabold text-brand-blue-700">
                    <span className="group-hover:underline">{copy.vaiAlReparto.replace("{reparto}", names.get(idea.corridoio) ?? idea.titolo)}</span>
                    <Icon name="arrow-right" size={18} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        </div>
      </Container>
    </section>
  );
}
