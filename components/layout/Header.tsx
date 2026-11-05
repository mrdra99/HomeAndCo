"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import type { NavItem } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";

const CORRIDOI_PREFIX = "/corridoi/";

/**
 * Header fisso: si compatta senza modificare l’altezza del documento. Su desktop le voci dei corridoi
 * sono raccolte nel menu "Corridoi" (cosi' le 10 voci del menu stanno in una riga).
 * Il mobile mostra tutte le voci nel drawer.
 */
export function Header({ items }: { items: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [aislesOpen, setAislesOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    let compact = false;
    const onScroll = () => {
      const next = window.scrollY > 12;
      if (next === compact) return;
      compact = next;
      setScrolled(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!aislesOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setAislesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAislesOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [aislesOpen]);

  const aisles = items.filter((i) => i.href.startsWith(CORRIDOI_PREFIX));
  const firstAisleIndex = items.findIndex((i) => i.href.startsWith(CORRIDOI_PREFIX));
  const aislesActive = pathname.startsWith(CORRIDOI_PREFIX);

  const linkClass = (active: boolean) =>
    cn(
      "rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition-colors",
      active ? "bg-brand-blue-50 text-brand-blue-800" : "text-ink hover:bg-brand-blue-50 hover:text-brand-blue-800",
    );

  const renderTop = (item: NavItem) => (
    <li key={item.href + item.label}>
      <Link
        href={item.href}
        aria-current={item.href === pathname ? "page" : undefined}
        className={
          item.evidenza
            ? "ml-1 inline-flex rounded-full bg-brand-magenta-600 px-5 py-2.5 text-[0.95rem] font-bold text-white transition-colors hover:bg-brand-magenta-700"
            : linkClass(item.href === pathname)
        }
      >
        {item.label}
      </Link>
    </li>
  );

  return (
    <>
      {/* Reserve the full header height so compacting never shifts the scrolling page. */}
      <div aria-hidden="true" className="h-18 sm:h-24" />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b border-brand-blue-100/60 bg-white transition-shadow duration-300",
          scrolled && "shadow-[0_6px_20px_-10px_rgb(11_42_71/0.35)]",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-7xl items-center justify-between px-5 transition-[height] duration-300 sm:px-8",
            scrolled ? "h-16 sm:h-[4.5rem]" : "h-18 sm:h-24",
          )}
        >
          <Link href="/" aria-label="Home & Co., vai alla home" className="rounded-lg">
            <Logo priority className={cn("transition-[width] duration-300", scrolled ? "w-36 sm:w-44" : "w-40 sm:w-56")} />
          </Link>

          <nav aria-label="Principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {items.map((item, i) => {
                if (!item.href.startsWith(CORRIDOI_PREFIX)) return renderTop(item);
                if (i !== firstAisleIndex) return null;
                return (
                  <li key="corridoi" ref={dropdownRef} className="relative">
                      <button
                        type="button"
                        aria-expanded={aislesOpen}
                        aria-controls="menu-corridoi"
                        onClick={() => setAislesOpen((o) => !o)}
                        className={cn(linkClass(aislesActive), "inline-flex items-center gap-1")}
                      >
                        Reparti
                        <Icon
                          name="arrow-right"
                          size={16}
                          className={cn("transition-transform", aislesOpen ? "-rotate-90" : "rotate-90")}
                        />
                      </button>
                      {aislesOpen && (
                        <ul
                          id="menu-corridoi"
                          style={{ top: scrolled ? "4.5rem" : "6rem" }}
                          className="fixed left-1/2 z-50 mt-2 grid max-h-[75dvh] w-[min(760px,85vw)] -translate-x-1/2 grid-cols-3 gap-1 overflow-y-auto rounded-[var(--radius-md)] border border-brand-blue-100 bg-white p-4 shadow-lift"
                        >
                          {aisles.map((a) => (
                            <li key={a.href}>
                              <Link
                                href={a.href}
                                onClick={() => setAislesOpen(false)}
                                aria-current={a.href === pathname ? "page" : undefined}
                                className="flex h-full min-h-20 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-brand-blue-50"
                              >
                                <DepartmentIcon name={a.href.split("/")[2]} size={32} />
                                {a.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                );
              })}
            </ul>
          </nav>

          <MobileNav items={items} />
        </div>
      </header>
    </>
  );
}
