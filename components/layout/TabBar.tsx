"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import type { HeaderCopy, NavGroup, NavItem } from "@/lib/content/schemas";
import { groupDepartments } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { MENU_OPEN_EVENT } from "./StoreChip";

const CORRIDOI_PREFIX = "/corridoi/";
const TAB_ICONS: Record<HeaderCopy["tab"][number]["icona"], IconName> = {
  home: "home", reparti: "grid", volantino: "flyer", negozi: "store", carta: "card", contatti: "mail",
};

/** Barra blu con selezione magenta; Reparti apre un menu compatto sopra la barra, con gruppi espandibili. */
export function TabBar({ items, groups, copy }: { items: NavItem[]; groups: NavGroup[]; copy: HeaderCopy }) {
  const pathname = usePathname();
  const departmentGroups = groupDepartments(items, groups);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();

  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    window.dispatchEvent(new CustomEvent(MENU_OPEN_EVENT, { detail: "mobile-departments" }));
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    onResize();
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onResize);
      if (dialog.open) dialog.close();
    };
  }, [open]);

  const close = () => setOpen(false);
  const openMenu = () => {
    setExpanded(departmentGroups.find((group) => group.items.some((item) => item.href === pathname))?.titolo ?? null);
    setOpen(true);
  };
  const tabHrefs = new Set(copy.tab.map((t) => t.href).filter(Boolean));
  const others = items.filter((i) => !i.href.startsWith(CORRIDOI_PREFIX) && !i.soloPiede && !tabHrefs.has(i.href));
  const isActive = (href: string) => !open && (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const tabClass = (active: boolean) => cn(
    "flex min-h-[var(--tabbar-h)] flex-col items-center justify-center gap-1 px-1 text-xs font-bold leading-none text-white transition-colors",
    active ? "bg-brand-magenta-600" : "hover:bg-white/10 active:bg-white/15",
  );

  return (
    <>
      <nav aria-label={copy.a11y.tabBar} className="on-dark fixed inset-x-0 bottom-0 z-40 bg-brand-blue-600 pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-2px_14px_rgb(11_42_71/0.12)] lg:hidden">
        <ul className="mx-auto grid max-w-xl grid-cols-5">
          {copy.tab.map((tab) => {
            const icon = <Icon name={TAB_ICONS[tab.icona]} size={23} />;
            if (tab.icona === "reparti" || !tab.href) {
              const active = open || pathname.startsWith(CORRIDOI_PREFIX);
              return (
                <li key={tab.icona}>
                  <button ref={triggerRef} type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={panelId}
                    onClick={openMenu} className={cn(tabClass(active), "w-full")}>
                    {open ? <Icon name="chevron" size={23} /> : icon}
                    {tab.label}
                  </button>
                </li>
              );
            }
            const active = isActive(tab.href);
            return <li key={tab.icona}><Link href={tab.href} aria-current={active ? "page" : undefined} className={tabClass(active)}>{icon}{tab.label}</Link></li>;
          })}
        </ul>
      </nav>

      <dialog ref={dialogRef} id={panelId} aria-labelledby={titleId}
        onClose={() => { setOpen(false); if (window.innerWidth < 1024) triggerRef.current?.focus(); }}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          const box = e.currentTarget.getBoundingClientRect();
          if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) close();
        }}
        className="mobile-departments fixed inset-x-3 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.75rem)] top-auto m-auto mb-0 max-h-[min(75dvh,42rem)] w-[calc(100%-1.5rem)] max-w-lg flex-col overflow-hidden rounded-2xl border-0 bg-white p-0 text-brand-blue-900 shadow-[0_16px_60px_rgb(11_42_71/0.25)] backdrop:bg-brand-blue-900/40 open:flex lg:hidden">
        <div className="flex shrink-0 items-center justify-between border-b border-brand-blue-100 border-t-4 border-t-brand-magenta-600 px-5 py-3">
          <h2 id={titleId} className="!text-xl text-brand-blue-900">{copy.repartiLabel}</h2>
          <button type="button" autoFocus onClick={close} aria-label={copy.a11y.chiudi} className="inline-flex size-11 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue-700 hover:bg-brand-blue-100">
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-3 pb-3">
          {departmentGroups.map((group, i) => {
            const expandedHere = expanded === group.titolo;
            const groupId = `${panelId}-group-${i}`;
            return (
              <section key={group.titolo} className="border-b border-brand-blue-100 last:border-b-0">
                <h3>
                  <button type="button" aria-expanded={expandedHere} aria-controls={groupId}
                    onClick={() => setExpanded(expandedHere ? null : group.titolo)}
                    className={cn("flex min-h-[4.5rem] w-full items-center gap-3 rounded-lg px-2 py-3 text-left text-base font-bold", expandedHere ? "text-brand-magenta-700" : "text-brand-blue-900 hover:bg-brand-blue-50")}>
                    <span className="size-12 shrink-0 overflow-hidden rounded-lg"><SmartImage src={group.immagine.src} alt="" label={group.titolo} ratio="1/1" sizes="48px" rounded="rounded-lg" imgClassName="group-hover:scale-100" /></span>
                    <span className="flex-1">{group.titolo}</span>
                    <Icon name="chevron" size={20} className={cn("shrink-0 transition-transform", expandedHere && "rotate-180")} />
                  </button>
                </h3>
                <ul id={groupId} hidden={!expandedHere} className="mb-3 ml-8 mr-2 border-l-2 border-brand-magenta-100 pl-3">
                  {group.items.map((item) => <li key={item.href}>
                    <Link href={item.href} onClick={close} aria-current={item.href === pathname ? "page" : undefined}
                      className={cn("flex min-h-12 items-center justify-between gap-3 rounded-lg px-3 py-2 text-[0.9375rem] font-semibold leading-snug hover:bg-brand-blue-50", item.href === pathname && "bg-brand-magenta-50 text-brand-magenta-700")}>
                      {item.label}<Icon name="arrow-right" size={17} className="shrink-0 text-brand-blue-600" />
                    </Link>
                  </li>)}
                </ul>
              </section>
            );
          })}
          {others.length > 0 && <nav aria-label={copy.a11y.altriLink} className="mt-3 grid gap-1">{others.map((item) => <Link key={item.href} href={item.href} onClick={close} className="flex min-h-12 items-center justify-between rounded-lg bg-brand-blue-50 px-4 text-sm font-bold text-brand-blue-900">{item.label}<Icon name="arrow-right" size={18} /></Link>)}</nav>}
        </div>
      </dialog>
    </>
  );
}
