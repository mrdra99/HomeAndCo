"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import type { HeaderCopy, NavItem, Store } from "@/lib/content/schemas";
import { scrollBehavior } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { StoreChip } from "./StoreChip";
import { TabBar } from "./TabBar";

const CORRIDOI_PREFIX = "/corridoi/";
const slugOf = (href: string) => href.split("/")[2];

/**
 * Striscia dei reparti: tutti visibili a 1280 px e oltre (icone da xl); a 1024 px entrano senza icone.
 * Se a una larghezza intermedia non bastasse, sfumatura sul bordo e freccia per scorrere.
 */
function DepartmentStrip({ items, pathname, copy }: { items: NavItem[]; pathname: string; copy: HeaderCopy["a11y"] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft > 4, end: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [items]);

  const scrollBy = (dir: 1 | -1) => listRef.current?.scrollBy({ left: dir * 240, behavior: scrollBehavior() });
  const arrow = "absolute top-0 z-10 flex h-11 w-11 items-center justify-center bg-brand-blue-700 hover:bg-brand-blue-900";

  return (
    <nav aria-label={copy.reparti} className="on-dark relative hidden bg-brand-blue-600 text-white lg:block">
      <ul ref={listRef} className="hide-scrollbar mx-auto flex h-11 w-full max-w-7xl items-center justify-between gap-0.5 overflow-x-auto px-4 xl:px-6">
        {items.map((item) => {
          const active = item.href === pathname;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-[0.8125rem] font-bold hover:bg-white/15",
                  active && "bg-white/20",
                )}
              >
                <span className="hidden rounded bg-white p-0.5 xl:block">
                  <DepartmentIcon name={slugOf(item.href)} size={18} />
                </span>
                {item.breve ?? item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {edges.start && (
        <button type="button" aria-label={copy.repartiPrecedenti} onClick={() => scrollBy(-1)} className={cn(arrow, "left-0 shadow-[8px_0_8px_-4px_rgb(8_87_143)]")}>
          <Icon name="chevron" size={20} className="rotate-90" />
        </button>
      )}
      {edges.end && (
        <button type="button" aria-label={copy.repartiSuccessivi} onClick={() => scrollBy(1)} className={cn(arrow, "right-0 shadow-[-8px_0_8px_-4px_rgb(8_87_143)]")}>
          <Icon name="chevron" size={20} className="-rotate-90" />
        </button>
      )}
    </nav>
  );
}

type HeaderProps = {
  /** Voci di content/navigation.json: principali + reparti (href /corridoi/...). */
  items: NavItem[];
  stores: Store[];
  copy: HeaderCopy;
  instagramUrl: string;
};

/**
 * Testata a tre livelli (desktop): avviso blu 900, riga bianca con logo, menu e "Il tuo negozio",
 * striscia blu 600 dei reparti. Sotto 1024 px: barra compatta (logo + negozio) e tab bar fissa in basso.
 * Il blocco bianco + striscia e' `sticky` (nessuno spazio riservato, nessun salto di layout).
 */
export function Header({ items, stores, copy, instagramUrl }: HeaderProps) {
  const [megaOpen, setMegaOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const focusFirstRef = useRef(false);
  const megaId = useId();

  const reparti = items.filter((i) => i.href.startsWith(CORRIDOI_PREFIX));
  const main = items.filter((i) => !i.href.startsWith(CORRIDOI_PREFIX) && !i.soloPiede);
  const repartiActive = pathname.startsWith(CORRIDOI_PREFIX);
  const cities = stores.map((s) => s.cittaBreve ?? s.citta);

  // ArrowDown sul pulsante Reparti: apre il menu e porta il focus sul primo link.
  useEffect(() => {
    if (megaOpen && focusFirstRef.current) {
      focusFirstRef.current = false;
      megaRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }
  }, [megaOpen]);

  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setMegaOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMegaOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [megaOpen]);

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex min-h-11 items-center rounded-md px-3 text-[0.95rem] font-bold transition-colors",
      active ? "bg-brand-blue-50 text-brand-blue-700" : "text-brand-blue-900 hover:bg-brand-blue-50 hover:text-brand-blue-700",
    );

  return (
    <>
      {/* Livello 1: avviso e social (solo desktop) */}
      <div className="on-dark hidden bg-brand-blue-900 text-sm text-white lg:block">
        <div className="mx-auto flex min-h-9 w-full max-w-7xl items-center justify-between gap-6 px-8">
          <p>
            {copy.avviso}
            {cities.length > 0 && <span aria-hidden="true"> · </span>}
            {cities.join(" · ")}
          </p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center gap-2 font-semibold hover:underline"
          >
            <Icon name="instagram" size={16} />
            Instagram
          </a>
        </div>
      </div>

      <header ref={rootRef} className="sticky top-0 z-40 border-b border-brand-blue-100 bg-white">
        {/* Livello 2: logo, menu, negozio */}
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-8 lg:h-[4.5rem] lg:gap-6">
          <Link href="/" aria-label={copy.a11y.logo} className="inline-flex min-h-11 shrink-0 items-center rounded-md">
            <Logo priority className="w-32 sm:w-36 lg:w-44" />
          </Link>

          <nav aria-label={copy.a11y.navigazione} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              <li>
                <button
                  ref={triggerRef}
                  type="button"
                  aria-expanded={megaOpen}
                  aria-controls={megaId}
                  onClick={() => setMegaOpen((o) => !o)}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowDown") return;
                    e.preventDefault();
                    if (megaOpen) {
                      megaRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
                    } else {
                      focusFirstRef.current = true;
                      setMegaOpen(true);
                    }
                  }}
                  className={cn(linkClass(repartiActive || megaOpen), "gap-1")}
                >
                  {copy.repartiLabel}
                  <Icon name="chevron" size={18} className={cn("transition-transform", megaOpen && "rotate-180")} />
                </button>
              </li>
              {main.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={item.href === pathname ? "page" : undefined}
                    className={
                      item.evidenza
                        ? "inline-flex min-h-11 items-center rounded-md bg-brand-magenta-600 px-4 text-[0.95rem] font-bold text-white transition-colors hover:bg-brand-magenta-700"
                        : linkClass(item.href === pathname)
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto min-w-0">
            <StoreChip stores={stores} copy={copy.negozio} />
          </div>
        </div>

        {/* Livello 3: reparti (desktop), scorribile */}
        <DepartmentStrip items={reparti} pathname={pathname} copy={copy.a11y} />

        {/* Mega-menu Reparti (desktop) */}
        {megaOpen && (
          <div id={megaId} ref={megaRef} className="absolute inset-x-0 top-full hidden border-b border-brand-blue-100 bg-white shadow-lift lg:block">
            <ul className="mx-auto grid max-h-[70dvh] w-full max-w-7xl grid-cols-4 gap-1 overflow-y-auto px-8 py-4">
              {reparti.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMegaOpen(false)}
                    aria-current={item.href === pathname ? "page" : undefined}
                    className="flex min-h-14 items-center gap-3 rounded-md px-3 py-2 font-bold text-brand-blue-900 hover:bg-brand-blue-50"
                  >
                    <DepartmentIcon name={slugOf(item.href)} size={36} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <TabBar items={items} copy={copy} />
    </>
  );
}
