"use client";

import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import type { NavItem } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Menu mobile a drawer: focus trap, Esc chiude, scroll del body bloccato, voci con stagger. */
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
            className="on-dark fixed inset-0 z-50 flex flex-col overflow-y-auto bg-brand-blue-900 text-white"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between px-5 py-3">
              <Link href="/" onClick={close} aria-label="Home & Co., vai alla home">
                <Logo variant="white" />
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
            <m.ul
              className="flex flex-1 flex-col gap-1 px-5 pb-10 pt-4"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            >
              {items.map((item) => {
                const current = item.href === pathname;
                return (
                  <m.li
                    key={item.href + item.label}
                    variants={{ hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0 } }}
                  >
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "block rounded-2xl px-4 py-3 font-display text-2xl",
                        item.evidenza
                          ? "mt-3 bg-brand-magenta-600 text-center text-white"
                          : "hover:bg-white/10",
                        current && !item.evidenza && "bg-white/10",
                      )}
                    >
                      {item.label}
                    </Link>
                  </m.li>
                );
              })}
            </m.ul>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
