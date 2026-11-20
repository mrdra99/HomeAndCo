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
type GalleryImage = NonNullable<Campaign["collezione"]>["galleria"][number];

/** Inclinazioni del collage, a rotazione: foto appoggiate a mano, non una griglia. */
const TILTS = ["-rotate-[5deg] translate-y-[1.2vw]", "rotate-[4deg] -translate-y-[1.6vw]", "rotate-[3deg] translate-y-[0.6vw]", "-rotate-[4deg] -translate-y-[0.8vw]"];

/** Collage di foto di stagione accanto al titolo grande (solo desktop). Foto 1200 px mostrate a 18vw al massimo. */
function CollectionGallery({ images }: { images: GalleryImage[] }) {
  return (
    <ul className="grid grid-cols-2 gap-[1.8vw] py-[2vw]">
      {images.map((img, i) => (
        <li
          key={img.src}
          className={cn(
            "overflow-hidden rounded-[var(--radius-xl)] border-[6px] border-white bg-white shadow-[0_18px_50px_rgb(0_0_0/0.4)] transition-transform duration-500 ease-out hover:z-10 hover:rotate-0 hover:scale-[1.04] motion-reduce:transition-none",
            TILTS[i % TILTS.length],
          )}
        >
          <SmartImage src={img.src} alt={img.alt} label={img.alt} ratio="4/5" sizes="(min-width: 1024px) 18vw, 1px" position={img.position} rounded="rounded-none" imgClassName="group-hover:scale-100" />
        </li>
      ))}
    </ul>
  );
}

/** Inclinazioni del ventaglio mobile: tre foto appoggiate e sovrapposte, quella centrale piu' in alto. */
const FAN = ["-rotate-[7deg] translate-y-2", "z-10 rotate-[2deg] -translate-y-1", "rotate-[8deg] translate-y-3"];

/** Ventaglio di foto di stagione sotto il titolo grande (solo sotto 1024 px). Foto 1200 px mostrate a 140 px al massimo. */
function CollectionFan({ images }: { images: GalleryImage[] }) {
  return (
    <ul aria-hidden="true" className="mt-6 flex justify-center">
      {images.slice(0, 3).map((img, i) => (
        <li key={img.src} className={cn("-mx-2 w-[34%] max-w-[140px] overflow-hidden rounded-[var(--radius-lg)] border-4 border-white bg-white shadow-[0_14px_34px_rgb(0_0_0/0.45)]", FAN[i])}>
          <SmartImage src={img.src} alt="" label={img.alt} ratio="4/5" sizes="140px" position={img.position} rounded="rounded-none" imgClassName="group-hover:scale-100" />
        </li>
      ))}
    </ul>
  );
}

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
  // Desktop con titolo grande: sfondo fotografico, parola enorme (almeno meta' schermo) e collage di foto.
  const big = Boolean(collection.titoloGrande);
  const arrows = (
    <>
      <button type="button" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label={copy.scorriPrecedente} className={arrowCls}>
        <Icon name="arrow-right" size={22} className="rotate-180" />
      </button>
      <button type="button" onClick={() => scrollBy(1)} disabled={edges.end} aria-label={copy.scorriSuccessivo} className={arrowCls}>
        <Icon name="arrow-right" size={22} />
      </button>
    </>
  );

  return (
    <section
      id="idee-di-stagione"
      aria-labelledby="collection-title"
      className={cn("bg-brand-blue-50 py-7 sm:py-10", big && "relative isolate overflow-hidden bg-brand-blue-900 pb-9 pt-10 lg:pb-20 lg:pt-16")}
    >
      {big && collection.sfondo && (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <SmartImage src={collection.sfondo.src} alt="" label={collection.titolo} sizes="100vw" position={collection.sfondo.position} rounded="rounded-none" className="h-full" imgClassName="group-hover:scale-100" />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(11_42_71/0.92)_0%,rgb(11_42_71/0.7)_45%,rgb(11_42_71/0.42)_100%)]" />
        </div>
      )}
      {big && (
        <div className="on-dark mx-auto mb-12 hidden w-full grid-cols-[minmax(0,60fr)_minmax(0,40fr)] items-center gap-[3vw] px-[4vw] lg:grid">
          <div className="min-w-0 text-white">
            {campaign.etichetta && (
              <span className="inline-block rounded-md bg-brand-magenta-600 px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide">{campaign.etichetta}</span>
            )}
            <h2 className="mt-4 !leading-none">
              <span className="sr-only">{collection.titolo}</span>
              <span aria-hidden="true" data-titolo-grande className="inline-block !text-[14vw] font-black uppercase leading-[0.8] tracking-[-0.045em] text-white [text-shadow:0_6px_40px_rgb(0_0_0/0.25)]">
                {collection.titoloGrande}
              </span>
              {collection.sottotitoloGrande && (
                <span aria-hidden="true" className="mt-[1.2vw] block pl-[0.6vw] text-[3.8vw] font-black leading-none tracking-[-0.02em] text-brand-magenta-100">
                  {collection.sottotitoloGrande}
                </span>
              )}
            </h2>
            <p className="mt-6 max-w-[38rem] pl-[0.6vw] text-xl leading-snug text-white/85">{collection.descrizione}</p>
          </div>
          {collection.galleria.length > 0 && <CollectionGallery images={collection.galleria} />}
        </div>
      )}
      {/* Con il titolo grande la sezione e' a tutta larghezza anche sotto: schede allineate al titolo. */}
      <Container size="wide" className={big ? "lg:max-w-none lg:px-[4vw]" : undefined}>
        {big ? (
          // Sotto 1024 px, con il titolo grande: la stessa apertura del desktop in verticale (etichetta, parola enorme a
          // tutta larghezza, sottotitolo, descrizione) e un ventaglio di tre foto al posto del collage.
          <div className="on-dark mb-6 text-white lg:hidden">
            {campaign.etichetta && (
              <span className="inline-block rounded-md bg-brand-magenta-600 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide">{campaign.etichetta}</span>
            )}
            <h2 id="collection-title" className="mt-3 !leading-none">
              <span className="sr-only">{collection.titolo}</span>
              <span aria-hidden="true" className="block !text-[clamp(4.5rem,23vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.045em] text-white [text-shadow:0_4px_28px_rgb(0_0_0/0.3)]">
                {collection.titoloGrande}
              </span>
              {collection.sottotitoloGrande && (
                <span aria-hidden="true" className="mt-2 block pl-1 text-[clamp(1.75rem,8vw,3rem)] font-black leading-none tracking-[-0.02em] text-brand-magenta-100">
                  {collection.sottotitoloGrande}
                </span>
              )}
            </h2>
            <p className="mt-4 pl-1 text-base leading-snug text-white/85">{collection.descrizione}</p>
            {collection.galleria.length > 0 && <CollectionFan images={collection.galleria} />}
            <div className={cn("mt-6 hidden justify-end gap-2", edges.overflow && "sm:flex")}>{arrows}</div>
          </div>
        ) : (
          <div className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
            <div className="min-w-0">
              <h2 id="collection-title" className="border-l-[6px] border-brand-magenta-600 pl-3 !font-black text-brand-blue-900">
                {collection.titolo}
              </h2>
              <p className="mt-1 pl-[1.125rem] text-sm text-muted sm:text-base">{collection.descrizione}</p>
            </div>
            <div className={cn("hidden shrink-0 gap-2", edges.overflow && "sm:flex")}>
              {arrows}
            </div>
          </div>
        )}
        {big && edges.overflow && <div className="mb-5 hidden justify-end gap-2 lg:flex">{arrows}</div>}
      </Container>
      <Container size="wide" className={cn("px-0 sm:px-8", big && "lg:max-w-none lg:px-[4vw]")}>
        <div
          ref={scroller}
          tabIndex={0}
          role="region"
          aria-label={copy.regione}
          className="hide-scrollbar snap-x snap-mandatory overflow-x-auto scroll-px-5 px-5 pb-1 sm:scroll-px-0 sm:px-0"
        >
        <ul className="flex gap-3">
          {collection.idee.map((idea) => (
            <li key={idea.titolo} className={cn("w-[72%] shrink-0 snap-start sm:w-[calc((100%-2.25rem)/3.2)]", big ? "lg:w-[calc((100%-3rem)/3.3)]" : "lg:w-[calc((100%-3.75rem)/4.4)]")}>
              <Link href={`/corridoi/${idea.corridoio}/`} className={cn("group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border-2 border-brand-blue-100 bg-white hover:border-brand-blue-600", big && "border-white/0 shadow-lift lg:rounded-[var(--radius-xl)] lg:border-white/0 lg:transition-transform lg:duration-300 lg:hover:-translate-y-1 lg:hover:border-brand-magenta-600")}>
                {idea.immagine?.src ? (
                  <SmartImage
                    src={idea.immagine.src}
                    alt=""
                    label={idea.titolo}
                    ratio="4/3"
                    position={idea.immagine.position}
                    // Desktop in px, non in vw: un vw piu' piccolo di 72 cambierebbe le varianti proposte anche al mobile.
                    sizes={big ? "(min-width: 1024px) 540px, (min-width: 640px) 230px, 72vw" : "(min-width: 1024px) 300px, (min-width: 640px) 230px, 72vw"}
                    rounded="rounded-none"
                    imgClassName="group-hover:scale-100"
                  />
                ) : null}
                <div className={cn("flex flex-1 flex-col p-3 sm:p-4", big && "lg:p-6")}>
                  <h3 className={cn("!text-lg text-brand-blue-900", big && "lg:!text-[1.625rem] lg:!font-black")}>{idea.titolo}</h3>
                  <p className={cn("mt-1 text-sm text-muted", big && "lg:text-base")}>{idea.testo}</p>
                  <span className={cn("mt-auto flex min-h-11 items-center gap-2 pt-2 text-sm font-extrabold text-brand-blue-700", big && "lg:text-base")}>
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
