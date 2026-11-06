"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import type { HeaderCopy, NavGroup, NavItem, Store } from "@/lib/content/schemas";
import { DEPARTMENT_PREFIX, groupDepartments } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { StoreChip } from "./StoreChip";
import { TabBar } from "./TabBar";

const CORRIDOI_PREFIX = DEPARTMENT_PREFIX;

type HeaderProps = {
  /** Voci di content/navigation.json: principali + reparti (href /corridoi/...). */
  items: NavItem[];
  /** Raggruppamento dei reparti (content/navigation.json → gruppi). */
  groups: NavGroup[];
  stores: Store[];
  copy: HeaderCopy;
  instagramUrl: string;
};

/**
 * Testata pulita (desktop): avviso blu 900 e una sola riga bianca con logo, «Tutti i reparti» (mega-menu a
 * gruppi, solo testo), Volantino, Negozi, Contatti e "Il tuo negozio". Sotto 1024 px: barra compatta
 * (logo + negozio) e tab bar fissa in basso. La riga bianca e' `sticky` (nessun salto di layout).
 */
export function Header({ items, groups, stores, copy, instagramUrl }: HeaderProps) {
  const [megaOpen, setMegaOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const focusFirstRef = useRef(false);
  const megaId = useId();

  const departmentGroups = groupDepartments(items, groups);
  const main = items.filter((i) => !i.href.startsWith(CORRIDOI_PREFIX) && !i.soloPiede);
  const repartiActive = pathname.startsWith(CORRIDOI_PREFIX);
  const cities = stores.map((s) => s.cittaBreve ?? s.citta);

  // Chiude il menu a ogni navigazione (aggiornamento durante il render, senza effetto).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMegaOpen(false);
  }

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
                  className={cn(
                    "on-dark inline-flex min-h-11 items-center gap-1 rounded-md px-4 text-[0.95rem] font-bold text-white transition-colors",
                    megaOpen || repartiActive ? "bg-brand-blue-900" : "bg-brand-blue-600 hover:bg-brand-blue-700",
                  )}
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

        {/* Mega-menu «Tutti i reparti» (desktop): gruppi di testo, a tutta larghezza del contenitore */}
        {megaOpen && (
          <div id={megaId} ref={megaRef} className="absolute inset-x-0 top-full hidden border-b border-brand-blue-100 bg-white shadow-lift lg:block">
            <div className="mx-auto max-h-[75dvh] w-full max-w-7xl overflow-y-auto px-8 pb-8 pt-6">
              <div className="grid grid-cols-3 gap-x-8 gap-y-8 xl:grid-cols-5">
                {departmentGroups.map((group) => (
                  <section key={group.titolo} aria-label={group.titolo}>
                    <h2 className="border-b-2 border-brand-blue-100 pb-2 !text-[0.8125rem] font-extrabold uppercase tracking-wider text-brand-blue-700">
                      {group.titolo}
                    </h2>
                    <ul className="mt-2">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setMegaOpen(false)}
                            aria-current={item.href === pathname ? "page" : undefined}
                            className={cn(
                              "-mx-2 flex min-h-11 items-center rounded-md px-2 py-1.5 text-[0.95rem] font-semibold leading-snug hover:bg-brand-blue-50 hover:text-brand-blue-700",
                              item.href === pathname ? "bg-brand-blue-50 text-brand-blue-700" : "text-brand-blue-900",
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <TabBar items={items} groups={groups} copy={copy} />
    </>
  );
}
