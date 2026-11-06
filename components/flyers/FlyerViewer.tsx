"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { m } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { cn } from "@/lib/utils";
import type { ImageRef, PagesCopy } from "@/lib/content/schemas";

type FlyerViewerProps = {
  pages: ImageRef[];
  /** Titolo del volantino (etichetta accessibile). */
  title: string;
  /** Etichette del lettore (content/pages.json: offerte.visore). */
  copy: PagesCopy["offerte"]["visore"];
  className?: string;
};

const SWIPE_PX = 60;
const PAGE_SIZES = "(min-width: 768px) 576px, calc(100vw - 64px)";

function Arrow({ dir, onClick, disabled, className, label }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean; className?: string; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "inline-flex size-12 items-center justify-center rounded-full bg-white text-brand-blue-800 shadow-soft transition-[transform,opacity] active:scale-95 disabled:opacity-30",
        className,
      )}
    >
      <Icon name="arrow-right" className={dir === "prev" ? "rotate-180" : undefined} />
    </button>
  );
}

/**
 * Sfoglia le pagine di un volantino: frecce, swipe (drag), tastiera (←/→; Esc chiude lo zoom),
 * indicatore pagine, zoom a schermo intero in <dialog> modale (focus trap e Esc nativi; dentro si
 * scorre e si fa pinch col browser). Carica solo la pagina corrente e le adiacenti.
 * Pagine senza `src` -> Placeholder con etichetta.
 */
export function FlyerViewer({ pages, title, copy, className }: FlyerViewerProps) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
  const [nearby, setNearby] = useState(false);
  const last = pages.length - 1;

  // Adjacents load only as the reader approaches the viewer, at low priority.
  useEffect(() => {
    const node = viewerRef.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      setNearby(true);
      observer.disconnect();
    }, { rootMargin: "200px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const go = useCallback(
    (delta: number) => {
      const n = Math.min(last, Math.max(0, index + delta));
      if (n === index) return;
      setDir(delta);
      setIndex(n);
    },
    [index, last],
  );

  // Apertura/chiusura del dialog modale in base allo stato.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (zoomOpen && !d.open) d.showModal();
    if (!zoomOpen && d.open) d.close();
    document.documentElement.style.overflow = zoomOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [zoomOpen]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
  };

  if (pages.length === 0) return null;
  const page = pages[index];
  const pageLabel = page.label ?? copy.pagina.replace("{n}", String(index + 1));
  const prevLabel = copy.paginaPrecedente;
  const nextLabel = copy.paginaSuccessiva;
  const near = [index - 1, index + 1].filter((i) => i >= 0 && i <= last && pages[i].src);

  return (
    <div
      ref={viewerRef}
      className={cn("mx-auto w-full max-w-xl rounded-lg", className)}
      role="group"
      aria-roledescription={copy.carosello}
      aria-label={copy.gruppo.replace("{titolo}", title)}
      tabIndex={0}
      onKeyDown={onKey}
    >
      <div className="relative">
        <div
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { swipe.current = null; }}
          onLostPointerCapture={() => { swipe.current = null; }}
          className="relative cursor-grab overflow-hidden rounded-lg bg-white shadow-lift [touch-action:pan-y_pinch-zoom] active:cursor-grabbing"
        >
          <m.div key={index} initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }}>
            {page.src ? (
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={page.src}
                  alt={page.alt || `${title}, ${pageLabel}`}
                  fill
                  sizes={PAGE_SIZES}
                  draggable={false}
                  className="select-none object-contain"
                />
              </div>
            ) : (
              <Placeholder ratio="3/4" label={`${title} - ${pageLabel}`} rounded="rounded-none" />
            )}
          </m.div>
        </div>

        <button
          type="button"
          onClick={() => {
            setZoomed(false);
            setZoomOpen(true);
          }}
          className="absolute right-3 top-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/95 px-4 text-sm font-semibold text-brand-blue-800 shadow-soft"
        >
          <svg aria-hidden viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-4.200-4.200M11 8.500v5M8.500 11h5" />
          </svg>
          {copy.ingrandisci}
        </button>

        {pages.length > 1 && (
          <>
            <Arrow label={prevLabel} dir="prev" onClick={() => go(-1)} disabled={index === 0} className="absolute left-2 top-1/2 hidden -translate-y-1/2 pointer-fine:inline-flex" />
            <Arrow label={nextLabel} dir="next" onClick={() => go(1)} disabled={index === last} className="absolute right-2 top-1/2 hidden -translate-y-1/2 pointer-fine:inline-flex" />
          </>
        )}
      </div>

      {/* Precarica le pagine adiacenti senza mostrarle */}
      {nearby && <div hidden>
        {near.map((i) => (
          <Image key={i} src={pages[i].src!} alt="" width={576} height={768} sizes={PAGE_SIZES} loading="eager" fetchPriority="low" />
        ))}
      </div>}

      <div className="mt-4 flex items-center justify-center gap-5">
        {pages.length > 1 && <Arrow label={prevLabel} dir="prev" onClick={() => go(-1)} disabled={index === 0} className="pointer-fine:hidden" />}
        <p className="text-center text-sm font-semibold text-muted" aria-live="polite">
          {copy.paginaDi.replace("{n}", String(index + 1)).replace("{tot}", String(pages.length))}
        </p>
        {pages.length > 1 && <Arrow label={nextLabel} dir="next" onClick={() => go(1)} disabled={index === last} className="pointer-fine:hidden" />}
      </div>
      {pages.length > 1 && (
        <ul className="mt-2 flex flex-wrap justify-center" aria-label={copy.vaiAllaPagina}>
          {pages.map((p, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  setIndex(i);
                }}
                aria-label={copy.pagina.replace("{n}", String(i + 1))}
                aria-current={i === index ? "true" : undefined}
                className="group inline-flex size-11 items-center justify-center"
              >
                <span
                  className={cn(
                    "block h-2.5 rounded-full transition-[width,background-color] duration-200",
                    i === index ? "w-7 bg-brand-magenta-600" : "w-2.5 bg-brand-blue-600/30 group-hover:bg-brand-blue-600/60",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`${title}, ${pageLabel}`}
        onClose={() => setZoomOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setZoomOpen(false);
        }}
        onKeyDown={onKey}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-brand-blue-900/95 p-0 text-white backdrop:bg-black/70"
      >
        {zoomOpen && (
          <div className="on-dark flex h-full flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-4">
              <p className="min-w-0 flex-1 basis-full px-2 text-sm font-semibold sm:basis-auto sm:text-base">
                {title} · {index + 1}/{pages.length}
              </p>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomed((z) => !z)}
                  aria-pressed={zoomed}
                  className="min-h-11 rounded-full bg-white px-4 text-sm font-semibold text-brand-blue-900"
                >
                  {zoomed ? copy.adatta : copy.zoom}
                </button>
                <button
                  type="button"
                  onClick={() => setZoomOpen(false)}
                  aria-label={copy.chiudiFinestra}
                  autoFocus
                  className="inline-flex size-11 items-center justify-center rounded-full bg-white text-brand-blue-900"
                >
                  <Icon name="close" />
                </button>
              </div>
            </div>
            <div className="relative min-h-0 flex-1 overflow-auto overscroll-contain px-3 pb-20 [touch-action:pan-x_pan-y_pinch-zoom]">
              {page.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={page.src}
                  alt={page.alt || `${title}, ${pageLabel}`}
                  className={cn("mx-auto block h-auto rounded-md bg-white", zoomed ? "w-[200%] max-w-none sm:w-[150%]" : "max-h-full w-auto max-w-full object-contain")}
                />
              ) : (
                <div className="mx-auto max-w-md">
                  <Placeholder ratio="3/4" label={`${title} - ${pageLabel}`} />
                </div>
              )}
            </div>
            {pages.length > 1 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] flex justify-center gap-3">
                <Arrow label={prevLabel} dir="prev" onClick={() => go(-1)} disabled={index === 0} className="pointer-events-auto" />
                <Arrow label={nextLabel} dir="next" onClick={() => go(1)} disabled={index === last} className="pointer-events-auto" />
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
