"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { cn } from "@/lib/utils";
import type { AisleShelf } from "@/lib/content/schemas";

type AisleShelvesProps = {
  scaffali: AisleShelf[];
  /** Titolo di sezione (da content/aisles.json: `scaffaliTitolo`). */
  titolo: string;
  /** Introduzione facoltativa (da content/aisles.json: `scaffaliIntro`). */
  intro?: string;
};

const SWIPE_PX = 60;
const CARD_SIZES = "(min-width: 1024px) 384px, (min-width: 640px) 45vw, 80vw";

/**
 * Foto degli scaffali di una categoria. Smartphone: scorrimento orizzontale con scroll-snap;
 * da sm griglia 2-3 colonne. Un tocco apre la foto a schermo intero in <dialog> modale
 * (focus trap ed Esc nativi, frecce da tastiera, swipe con Pointer Events).
 * Senza scaffali la sezione non esiste.
 */
export function AisleShelves({ scaffali, titolo, intro }: AisleShelvesProps) {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
  const last = scaffali.length - 1;
  const isOpen = open !== null;

  const go = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : Math.min(last, Math.max(0, i + delta)))),
    [last],
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) d.close();
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (scaffali.length === 0) return null;

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    swipe.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
  };

  const current = open !== null ? scaffali[open] : null;
  const caption = current ? [current.titolo, current.descrizione].filter(Boolean).join(" - ") : "";

  return (
    <section id="scaffali" aria-labelledby="scaffali-titolo" className="scroll-mt-4 bg-white py-7 sm:py-10">
      <Container size="wide">
        <SectionTitle id="scaffali-titolo" note={intro}>{titolo}</SectionTitle>

        <ul className="hide-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {scaffali.map((s, i) => (
            <li key={`${s.immagine.src}-${i}`} className="w-[80%] shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-haspopup="dialog"
                aria-label={`Ingrandisci: ${s.titolo ?? s.immagine.alt}`}
                className="group block w-full overflow-hidden rounded-[var(--radius-lg)] border-2 border-brand-blue-100 bg-white text-left hover:border-brand-blue-600"
              >
                <SmartImage
                  src={s.immagine.src}
                  alt={s.immagine.alt}
                  label={s.titolo ?? "Scaffale"}
                  ratio="4/3"
                  sizes={CARD_SIZES}
                  rounded="rounded-none"
                />
                {(s.titolo || s.descrizione) && (
                  <span className="block p-3">
                    {s.titolo && <span className="block font-semibold text-brand-blue-900">{s.titolo}</span>}
                    {s.descrizione && <span className="mt-1 block text-sm text-muted">{s.descrizione}</span>}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </Container>

      <dialog
        ref={dialogRef}
        aria-label={`${titolo}${current ? `: ${open! + 1} di ${scaffali.length}` : ""}`}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(null);
        }}
        onKeyDown={onKey}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-brand-blue-900 p-0 text-white backdrop:bg-black/70"
      >
        {current && (
          <div className="on-dark flex h-full flex-col">
            <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-4">
              <p className="min-w-0 flex-1 px-2 text-sm font-semibold sm:text-base" aria-live="polite">
                {open! + 1}/{scaffali.length}
                {caption && <span className="font-normal"> · {caption}</span>}
              </p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Chiudi"
                autoFocus
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-blue-900"
              >
                <Icon name="close" />
              </button>
            </div>
            <div
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => { swipe.current = null; }}
              onLostPointerCapture={() => { swipe.current = null; }}
              className="relative min-h-0 flex-1 px-3 pb-24 [touch-action:pan-y_pinch-zoom]"
            >
              <div className="relative h-full w-full">
                <Image
                  key={open}
                  src={current.immagine.src!}
                  alt={current.immagine.alt}
                  fill
                  sizes="100vw"
                  draggable={false}
                  className="select-none object-contain"
                />
              </div>
            </div>
            {scaffali.length > 1 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] flex justify-center gap-3">
                {(["prev", "next"] as const).map((dir) => {
                  const disabled = dir === "prev" ? open === 0 : open === last;
                  return (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => go(dir === "prev" ? -1 : 1)}
                      disabled={disabled}
                      aria-label={dir === "prev" ? "Foto precedente" : "Foto successiva"}
                      className={cn(
                        "pointer-events-auto inline-flex size-12 items-center justify-center rounded-full bg-white text-brand-blue-800 shadow-soft transition-[transform,opacity] active:scale-95 disabled:opacity-30",
                      )}
                    >
                      <Icon name="arrow-right" className={dir === "prev" ? "rotate-180" : undefined} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
