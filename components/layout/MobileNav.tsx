"use client";

import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import type { NavItem } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Menu mobile con collegamenti ampi, chiusura fissa e scorrimento separato dalla pagina. */
export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      toggle?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);
  const departments = items.filter((item) => item.href.startsWith("/corridoi/"));
  const mainItems = items.filter((item) => !item.href.startsWith("/corridoi/") && !item.evidenza);
  const highlighted = items.filter((item) => item.evidenza);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Apri il menu"
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="inline-flex size-12 items-center justify-center rounded-full text-brand-blue-800 hover:bg-brand-blue-50 lg:hidden"
      >
        <Icon name="menu" size={28} />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            key="drawer"
            id="menu-mobile"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu principale"
            className="on-dark fixed inset-0 z-50 flex h-dvh flex-col overflow-y-auto overscroll-contain bg-brand-blue-900 text-white"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between bg-brand-blue-900 px-5 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <Link href="/" onClick={close} aria-label="Home & Co., vai alla home">
                <Logo variant="white" className="w-40" />
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label="Chiudi il menu"
                className="inline-flex size-12 items-center justify-center rounded-full hover:bg-white/10"
              >
                <Icon name="close" size={28} />
              </button>
            </div>
            <nav aria-label="Navigazione mobile" className="mx-auto w-full max-w-2xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-2">
              <ul className="grid grid-cols-2 gap-2">
                {[...mainItems, { label: "Contatti", href: "/contatti/" }].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={item.href === pathname ? "page" : undefined}
                      className={cn("flex min-h-12 items-center rounded-xl px-3 text-lg font-semibold hover:bg-white/10", item.href === pathname && "bg-white/10")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h2 className="mb-3 mt-6 !text-lg text-white/75">Reparti</h2>
              <ul className="grid grid-cols-2 gap-2">
                {departments.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={close} aria-current={item.href === pathname ? "page" : undefined}
                      className={cn("flex h-full min-h-20 flex-col items-start justify-center gap-2 rounded-xl bg-white/10 p-3 text-sm font-semibold leading-snug hover:bg-white/20 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-start", item.href === pathname && "ring-2 ring-white")}>
                      <span className="rounded-lg bg-white p-1"><DepartmentIcon name={item.href.split("/")[2]} size={28} /></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {highlighted.map((item) => (
                <Link key={item.href} href={item.href} onClick={close} className="mt-5 flex min-h-14 items-center justify-center gap-2 rounded-full bg-brand-magenta-600 px-5 py-3 text-lg font-semibold text-white hover:bg-brand-magenta-700">
                  <Icon name="map-pin" size={22} />{item.label}
                </Link>
              ))}
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
