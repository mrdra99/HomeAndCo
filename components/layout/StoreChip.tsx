"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useOpenStatusDetail } from "@/components/stores/useOpenStatus";
import { useSelectedStoreId } from "@/components/stores/useSelectedStore";
import type { HeaderCopy, Store } from "@/lib/content/schemas";
import type { StoreStatusDetail } from "@/lib/stores";
import { cn } from "@/lib/utils";

type StoreCopy = HeaderCopy["negozio"];

/** Testo di stato ("Aperto fino alle 20:00"); stringa vuota se lo stato non e' noto. */
export function statusText(detail: StoreStatusDetail, copy: StoreCopy): string {
  if (detail.state === "open") return copy.apertoFinoAlle.replace("{ora}", detail.until);
  if (detail.state === "closed") {
    if (detail.opensAt && detail.when === "today") return `${copy.chiuso} · ${copy.riapreOggi.replace("{ora}", detail.opensAt)}`;
    if (detail.opensAt && detail.when === "tomorrow") return `${copy.chiuso} · ${copy.riapreDomani.replace("{ora}", detail.opensAt)}`;
    return copy.chiuso;
  }
  return "";
}

/** Un solo menu aperto alla volta: il selettore e il mega-menu «Tutti i reparti» si chiudono a vicenda. */
export const MENU_OPEN_EVENT = "homeco:menu-open";

const shortName = (s: Store) => s.cittaBreve ?? s.citta;

function Dot({ detail, bar }: { detail: StoreStatusDetail; bar?: boolean }) {
  if (detail.state === "unknown") return null;
  const open = detail.state === "open";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-2 shrink-0 rounded-full",
        bar ? (open ? "bg-white" : "border border-white/70") : open ? "bg-brand-blue-600" : "bg-muted",
      )}
    />
  );
}

function StoreOption({ store, selected, copy, onPick }: { store: Store; selected: boolean; copy: StoreCopy; onPick: () => void }) {
  const detail = useOpenStatusDetail(store);
  const text = statusText(detail, copy);
  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        onClick={onPick}
        className={cn(
          "flex min-h-12 w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-brand-blue-50",
          selected && "bg-brand-blue-50 ring-1 ring-brand-blue-600",
        )}
      >
        <Dot detail={detail} />
        <span className="min-w-0">
          <span className="block font-bold text-brand-blue-900">{store.citta}</span>
          {text && <span className="block text-sm text-muted">{text}</span>}
        </span>
      </button>
    </li>
  );
}

/**
 * "Il tuo negozio": scelta salvata in localStorage, stato da useOpenStatusDetail.
 * Prima del mount (server + primo render) mostra solo l'invito a scegliere: nessun mismatch.
 * `tone="bar"`: versione per la fascia blu 900 in alto (desktop), su una riga; `"light"`: barra mobile.
 */
export function StoreChip({ stores, copy, tone = "light" }: { stores: Store[]; copy: StoreCopy; tone?: "light" | "bar" }) {
  const bar = tone === "bar";
  const [open, setOpen] = useState(false);
  const [savedId, select] = useSelectedStoreId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const store = stores.find((s) => s.id === savedId) ?? null;
  const detail = useOpenStatusDetail(store);
  const text = statusText(detail, copy);

  useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent(MENU_OPEN_EVENT, { detail: "chip" }));
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail !== "chip") setOpen(false);
    };
    window.addEventListener(MENU_OPEN_EVENT, onOther);
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(MENU_OPEN_EVENT, onOther);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={bar && store ? copy.ariaNegozio.replace("{negozio}", store.citta).replace("{stato}", text ? text.charAt(0).toLowerCase() + text.slice(1) : "").replace(/, $/, "") : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex min-h-11 max-w-full items-center gap-2 rounded-md px-3 py-1.5 text-left",
          bar
            ? "on-dark border border-white/40 text-white hover:border-white hover:bg-white/10"
            : "border border-brand-blue-100 bg-brand-blue-50 hover:border-brand-blue-600",
        )}
      >
        <Icon name="map-pin" size={bar ? 18 : 20} className={cn("shrink-0", bar ? "text-white" : "text-brand-blue-700")} />
        <span className="min-w-0 leading-tight">
          {/* Sotto 1024 px, con negozio scelto: due righe (citta' + stato) senza etichetta, per stare nella barra compatta. */}
          {!bar && <span className={cn("block text-xs font-semibold text-muted", store && "hidden lg:block")}>{copy.etichetta}</span>}
          <span className={cn("flex text-sm font-bold", bar ? "items-center gap-2 text-white" : "flex-col text-brand-blue-900 lg:flex-row lg:items-center lg:gap-2")}>
            {store ? (
              <>
                <span className="shrink-0">{shortName(store)}</span>
                {text && (
                  <>
                    {bar ? <span aria-hidden="true" className="text-white/70">·</span> : <span className="hidden lg:block"><Dot detail={detail} /></span>}
                    <span className={cn("truncate font-semibold", bar ? "text-sm text-white" : "text-xs text-brand-blue-800 lg:text-sm")}>{text}</span>
                  </>
                )}
              </>
            ) : (
              <span className="truncate">{bar ? copy.titoloScelta : copy.scegli}</span>
            )}
          </span>
        </span>
        <Icon name="chevron" size={18} className={cn("shrink-0 transition-transform", bar ? "text-white" : "text-brand-blue-700", open && "rotate-180")} />
      </button>
      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={copy.titoloScelta}
          className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-brand-blue-100 bg-white p-2 shadow-lift"
        >
          <p className="px-3 pb-1 pt-2 text-sm font-bold text-brand-blue-900">{copy.titoloScelta}</p>
          <ul>
            {stores.map((s) => (
              <StoreOption
                key={s.id}
                store={s}
                selected={s.id === savedId}
                copy={copy}
                onPick={() => {
                  select(s.id);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
              />
            ))}
          </ul>
          <Link
            href="/dove-siamo/"
            onClick={() => setOpen(false)}
            className="mt-1 flex min-h-11 items-center justify-between rounded-md px-3 text-sm font-bold text-brand-blue-700 hover:bg-brand-blue-50"
          >
            {copy.orariEIndicazioni}
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
