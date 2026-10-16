"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { m, type PanInfo } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/ui/Placeholder";
import { cn } from "@/lib/utils";
import type { ImageRef } from "@/lib/content/schemas";

type FlyerViewerProps = {
  pages: ImageRef[];
  /** Titolo del volantino (etichetta accessibile). */
  title: string;
  className?: string;
};

const SWIPE_PX = 60;

function Arrow({ dir, onClick, disabled, className }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Pagina precedente" : "Pagina successiva"}
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
export function FlyerViewer({ pages, title, className }: FlyerViewerProps) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const last = pages.length - 1;

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

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_PX) go(1);
    else if (info.offset.x > SWIPE_PX) go(-1);
  };

  if (pages.length === 0) return null;
  const page = pages[index];
  const pageLabel = page.label ?? `Pagina ${index + 1}`;
  const near = [index - 1, index + 1].filter((i) => i >= 0 && i <= last && pages[i].src);

  return (
    <div
      className={cn("mx-auto w-full max-w-xl rounded-lg", className)}
      role="group"
      aria-roledescription="carosello"
      aria-label={`Volantino ${title}. Usa le frecce sinistra e destra per cambiare pagina.`}
      tabIndex={0}
      onKeyDown={onKey}
    >
      <div className="relative">
        <m.div
          key={index}
          drag={pages.length > 1 ? "x" : false}
          dragSnapToOrigin
          dragElastic={0.25}
          onDragEnd={onDragEnd}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative cursor-grab overflow-hidden rounded-lg bg-white shadow-lift [touch-action:pan-y_pinch-zoom] active:cursor-grabbing"
        >
          {page.src ? (
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={page.src}
                alt={page.alt || `${title}, ${pageLabel}`}
                fill
                sizes="(min-width: 640px) 576px, 100vw"
                draggable={false}
                className="select-none object-contain"
                preload={index === 0}
              />
            </div>
          ) : (
            <Placeholder ratio="3/4" label={`${title} - ${pageLabel}`} rounded="rounded-none" />
          )}
        </m.div>

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
          Ingrandisci
        </button>

        {pages.length > 1 && (
          <>
            <Arrow dir="prev" onClick={() => go(-1)} disabled={index === 0} className="absolute left-2 top-1/2 -translate-y-1/2" />
            <Arrow dir="next" onClick={() => go(1)} disabled={index === last} className="absolute right-2 top-1/2 -translate-y-1/2" />
          </>
        )}
      </div>

      {/* Precarica le pagine adiacenti senza mostrarle */}
      <div hidden>
        {near.map((i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={pages[i].src ?? ""} alt="" loading="eager" />
        ))}
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-muted" aria-live="polite">
        Pagina {index + 1} di {pages.length}
      </p>
      {pages.length > 1 && (
        <ul className="mt-2 flex flex-wrap justify-center" aria-label="Vai alla pagina">
          {pages.map((p, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  setIndex(i);
                }}
                aria-label={`Pagina ${i + 1}`}
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
        data-lenis-prevent
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
                  {zoomed ? "Adatta allo schermo" : "Zoom 2x"}
                </button>
                <button
                  type="button"
                  onClick={() => setZoomOpen(false)}
                  aria-label="Chiudi"
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
                <Arrow dir="prev" onClick={() => go(-1)} disabled={index === 0} className="pointer-events-auto" />
                <Arrow dir="next" onClick={() => go(1)} disabled={index === last} className="pointer-events-auto" />
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
