"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { HeaderCopy, NavGroup, NavItem } from "@/lib/content/schemas";
import { groupDepartments } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const CORRIDOI_PREFIX = "/corridoi/";
const TAB_ICONS: Record<HeaderCopy["tab"][number]["icona"], IconName> = {
  home: "home",
  reparti: "grid",
  volantino: "flyer",
  negozi: "store",
  carta: "card",
  contatti: "mail",
};

/**
 * Tab bar fissa in basso (sotto 1024 px): 5 voci da settings.testata.tab. "Reparti" apre un pannello
 * a schermo intero con i reparti e le altre pagine. Rispetta env(safe-area-inset-bottom); il layout
 * riserva lo spazio con la classe `pb-tabbar`.
 */
export function TabBar({ items, groups, copy }: { items: NavItem[]; groups: NavGroup[]; copy: HeaderCopy }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
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
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);
  const departmentGroups = groupDepartments(items, groups);
  const tabHrefs = new Set(copy.tab.map((t) => t.href).filter(Boolean));
  const others = items.filter((i) => !i.href.startsWith(CORRIDOI_PREFIX) && !i.soloPiede && !tabHrefs.has(i.href));
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const tabClass = (active: boolean) =>
    cn(
      "relative flex h-[var(--tabbar-h)] flex-col items-center justify-center gap-0.5 text-[0.75rem] font-bold leading-none",
      active ? "text-brand-blue-700" : "text-brand-blue-900",
    );
  const activeBar = <span aria-hidden="true" className="absolute inset-x-3 top-0 h-0.5 bg-brand-blue-600" />;

  return (
    <>
      <nav
        aria-label={copy.a11y.tabBar}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-blue-100 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto grid max-w-xl grid-cols-5">
          {copy.tab.map((tab) => {
            const icon = <Icon name={TAB_ICONS[tab.icona]} size={24} />;
            if (tab.icona === "reparti" || !tab.href) {
              const active = open || pathname.startsWith(CORRIDOI_PREFIX);
              return (
                <li key={tab.icona}>
                  <button
                    ref={triggerRef}
                    type="button"
                    aria-expanded={open}
                    aria-controls="pannello-reparti"
                    onClick={() => setOpen((o) => !o)}
                    className={cn(tabClass(active), "w-full")}
                  >
                    {active && activeBar}
                    {icon}
                    {tab.label}
                  </button>
                </li>
              );
            }
            const active = isActive(tab.href);
            return (
              <li key={tab.icona}>
                <Link href={tab.href} aria-current={active ? "page" : undefined} className={tabClass(active)}>
                  {active && activeBar}
                  {icon}
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {open && (
        <div
          id="pannello-reparti"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={copy.a11y.reparti}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-white lg:hidden"
        >
          <div className="on-dark sticky top-0 z-10 flex shrink-0 items-center justify-between bg-brand-blue-600 px-4 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-white">
            <h2 className="!text-lg text-white">{copy.a11y.reparti}</h2>
            <button
              type="button"
              onClick={close}
              aria-label={copy.a11y.chiudi}
              className="inline-flex size-11 items-center justify-center rounded-md hover:bg-white/15"
            >
              <Icon name="close" size={26} />
            </button>
          </div>
          <div className="px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
            {departmentGroups.map((group, i) => (
              <section key={group.titolo} aria-label={group.titolo} className={i > 0 ? "mt-5" : undefined}>
                <h3 className="border-b-2 border-brand-blue-600 pb-1.5 !text-[0.8125rem] font-extrabold uppercase tracking-wider text-brand-blue-700">
                  {group.titolo}
                </h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.href} className="border-b border-brand-blue-100">
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={item.href === pathname ? "page" : undefined}
                        className={cn(
                          "flex min-h-11 items-center px-1 py-2 text-base font-semibold leading-snug text-brand-blue-900 active:bg-brand-blue-50",
                          item.href === pathname && "bg-brand-blue-50 text-brand-blue-700",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {others.length > 0 && (
              <>
                <h3 className="mb-2 mt-6 text-base text-brand-blue-900">{copy.a11y.altriLink}</h3>
                <ul className="grid gap-2">
                  {others.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className="flex min-h-12 items-center justify-between rounded-lg bg-brand-blue-50 px-4 font-bold text-brand-blue-900"
                      >
                        {item.label}
                        <Icon name="arrow-right" size={20} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
