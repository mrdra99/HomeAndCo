"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { SmartImage } from "@/components/ui/SmartImage";
import type { HeaderCopy, NavGroup, NavItem, Store } from "@/lib/content/schemas";
import { DEPARTMENT_PREFIX, groupDepartments, seasonalMenu, type DepartmentGroup } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { MENU_OPEN_EVENT, StoreChip } from "./StoreChip";
import { TabBar } from "./TabBar";
import { useActiveCampaign } from "@/components/campaign/useActiveCampaign";
import type { Campaign } from "@/lib/content/schemas";

const CORRIDOI_PREFIX = DEPARTMENT_PREFIX;
/** Ritardi del passaggio del mouse: aprire non deve scattare sfiorando la barra, chiudere non deve scattare uscendo di un pixel. */
const OPEN_DELAY = 90;
const CLOSE_DELAY = 180;

type HeaderProps = {
  /** Voci di content/navigation.json: principali + reparti (href /corridoi/...). */
  items: NavItem[];
  /** Raggruppamento dei reparti (content/navigation.json → gruppi). */
  groups: NavGroup[];
  stores: Store[];
  copy: HeaderCopy;
  instagramUrl: string;
  /** Campagne: la voce di stagione nella barra desktop segue la campagna attiva per data. */
  campaigns: Campaign[];
  buildCampaignId: string;
};

/**
 * Testata (desktop): fascia blu 900 con avviso, Negozi, Contatti, "Il tuo negozio" e Instagram; poi una sola riga bianca
 * con logo, i gruppi di reparti (ognuno apre la sua tendina al passaggio del mouse, al clic o da tastiera) e Volantino.
 * Tra 1024 e 1279 px i gruppi usano l'etichetta corta (`breve`). Sotto 1024 px: nessuna fascia; barra compatta
 * (logo + negozio) e tab bar fissa in basso, invariate.
 * Scorrimento: solo la riga bianca e' `sticky`; la fascia blu scorre via con la pagina.
 */
export function Header({ items, groups, stores, copy, instagramUrl, campaigns, buildCampaignId }: HeaderProps) {
  const [open, setOpen] = useState<number | null>(null);
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const season = seasonalMenu(campaign);
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const openedByHover = useRef(false);
  const focusFirst = useRef(false);

  const departmentGroups = groupDepartments(items, groups);
  // Tendine della barra: i gruppi di reparti e, in coda, la voce di stagione (se la campagna attiva ne ha una).
  const menus: { group: DepartmentGroup; season: boolean }[] = [
    ...departmentGroups.map((group) => ({ group, season: false })),
    ...(season ? [{ group: season, season: true }] : []),
  ];
  const main = items.filter((i) => !i.href.startsWith(CORRIDOI_PREFIX) && !i.soloPiede);
  const primary = main.filter((i) => !i.evidenza);
  const highlighted = main.filter((i) => i.evidenza);
  const cities = stores.map((s) => s.cittaBreve ?? s.citta);

  // Chiude il menu a ogni navigazione (aggiornamento durante il render, senza effetto).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
  }

  const schedule = (fn: () => void, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(fn, delay);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Freccia giu' sul titolo di un gruppo: apre la tendina e porta il focus sul primo reparto.
  useEffect(() => {
    if (open === null || !focusFirst.current) return;
    focusFirst.current = false;
    rootRef.current?.querySelector<HTMLElement>(`[data-dept-panel="${open}"] a[href]`)?.focus();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    window.dispatchEvent(new CustomEvent(MENU_OPEN_EVENT, { detail: "mega" }));
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail !== "mega") setOpen(null);
    };
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      rootRef.current?.querySelector<HTMLElement>(`[data-dept-trigger="${open}"]`)?.focus();
      setOpen(null);
    };
    window.addEventListener(MENU_OPEN_EVENT, onOther);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(MENU_OPEN_EVENT, onOther);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const stripLink = (active: boolean) =>
    cn("inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline", active && "underline");

  return (
    <>
      {/* Livello 1: avviso, link di servizio e social (solo desktop) */}
      {/* z-50: il menu a tendina del negozio si apre sopra la riga bianca sticky (z-40) */}
      <div className="on-dark relative z-50 hidden bg-brand-blue-900 text-sm text-white lg:block">
        <div className="mx-auto flex min-h-12 w-full max-w-7xl items-center justify-between gap-4 px-8">
          <p className="min-w-0">
            {copy.avviso}
            {/* Le citta' compaiono da 1280 px: a 1024 px lasciano il posto al selettore del negozio. */}
            {cities.length > 0 && <span aria-hidden="true" className="hidden xl:inline"> · </span>}
            <span className="hidden xl:inline">{cities.join(" · ")}</span>
          </p>
          <div className="flex shrink-0 items-center gap-5">
            {primary.map((item) => (
              <Link key={item.href} href={item.href} aria-current={item.href === pathname ? "page" : undefined} className={stripLink(item.href === pathname)}>
                {item.label}
              </Link>
            ))}
            <StoreChip stores={stores} copy={copy.negozio} tone="bar" />
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-semibold hover:underline"
            >
              <Icon name="instagram" size={16} />
              Instagram
            </a>
          </div>
        </div>
      </div>

      <header ref={rootRef} className="sticky top-0 z-40 border-b border-brand-blue-100 bg-white">
        {/* Livello 2: logo, gruppi di reparti, volantino */}
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-8 lg:h-[4.5rem] lg:gap-5">
          <Link href="/" aria-label={copy.a11y.logo} className="inline-flex min-h-11 shrink-0 items-center rounded-md">
            <Logo priority className="w-32 sm:w-36 lg:w-36 xl:w-44" />
          </Link>

          <nav aria-label={copy.a11y.navigazione} className="hidden lg:block lg:flex-1 lg:self-stretch">
            <ul className="flex h-full items-center gap-0.5">
              {menus.map(({ group, season: isSeason }, i) => (
                <DepartmentMenu
                  key={group.titolo}
                  group={group}
                  index={i}
                  alignRight={i >= menus.length - 2}
                  open={open === i}
                  pathname={pathname}
                  allLabel={isSeason ? campaign.cta.label : copy.repartiLabel}
                  allHref={isSeason ? campaign.cta.href : "/#corridoi"}
                  season={isSeason}
                  onHover={(entering) => {
                    if (entering) {
                      schedule(() => {
                        openedByHover.current = true;
                        setOpen(i);
                      }, open === null ? OPEN_DELAY : 0);
                    } else {
                      schedule(() => setOpen((o) => (o === i ? null : o)), CLOSE_DELAY);
                    }
                  }}
                  onToggle={() => {
                    window.clearTimeout(timer.current);
                    // Un clic subito dopo l'apertura al passaggio del mouse conferma la tendina, non la richiude.
                    if (open === i && openedByHover.current) {
                      openedByHover.current = false;
                      return;
                    }
                    openedByHover.current = false;
                    setOpen(open === i ? null : i);
                  }}
                  onArrowDown={() => {
                    if (open === i) {
                      rootRef.current?.querySelector<HTMLElement>(`[data-dept-panel="${i}"] a[href]`)?.focus();
                    } else {
                      focusFirst.current = true;
                      setOpen(i);
                    }
                  }}
                  onLeaveFocus={() => setOpen((o) => (o === i ? null : o))}
                  onNavigate={() => setOpen(null)}
                />
              ))}
              {/* La voce evidenziata (Volantino) chiude la riga a destra. */}
              {highlighted.map((item, i) => (
                <li key={item.href} className={i === 0 ? "ml-auto" : undefined}>
                  <Link
                    href={item.href}
                    aria-current={item.href === pathname ? "page" : undefined}
                    className="btn-bounce inline-flex min-h-11 items-center rounded-md bg-brand-magenta-600 px-4 text-[1.05rem] font-extrabold text-white transition-colors hover:bg-brand-magenta-700"
                  >
                    <span className="btn-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile: il negozio resta nella barra compatta (da 1024 px sta nella fascia blu in alto). */}
          <div className="ml-auto min-w-0 lg:hidden">
            <StoreChip stores={stores} copy={copy.negozio} />
          </div>
        </div>
      </header>

      <TabBar items={items} groups={groups} copy={copy} season={season ? { group: season, cta: campaign.cta } : null} />
    </>
  );
}

type DepartmentMenuProps = {
  group: DepartmentGroup;
  index: number;
  alignRight: boolean;
  open: boolean;
  pathname: string;
  allLabel: string;
  allHref: string;
  /** Voce di stagione: magenta, per distinguerla dai reparti. */
  season: boolean;
  onHover: (entering: boolean) => void;
  onToggle: () => void;
  onArrowDown: () => void;
  onLeaveFocus: () => void;
  onNavigate: () => void;
};

/**
 * Un gruppo nella barra: titolo (pulsante con aria-expanded) e tendina con i suoi reparti e la foto del gruppo.
 * La voce occupa tutta l'altezza della barra, cosi' la tendina parte dal bordo inferiore e il mouse ci arriva senza vuoti.
 */
function DepartmentMenu({ group, index, alignRight, open, pathname, allLabel, allHref, season, onHover, onToggle, onArrowDown, onLeaveFocus, onNavigate }: DepartmentMenuProps) {
  const panelId = `reparti-gruppo-menu-${index}`;
  const active = !season && group.items.some((item) => pathname === item.href);
  return (
    <li
      className="relative flex h-full items-center"
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onHover(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onLeaveFocus();
      }}
    >
      <button
        type="button"
        data-dept-trigger={index}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key !== "ArrowDown") return;
          e.preventDefault();
          onArrowDown();
        }}
        className={cn(
          "relative inline-flex min-h-11 items-center gap-1 rounded-md px-2.5 text-[0.95rem] font-bold transition-colors",
          "after:absolute after:inset-x-2.5 after:-bottom-[0.9rem] after:h-[3px] after:rounded-full after:bg-brand-magenta-600 after:transition-transform after:duration-200 after:content-['']",
          season
            ? cn("font-extrabold text-brand-magenta-700 hover:text-brand-magenta-600", open ? "bg-brand-magenta-50 after:scale-x-100" : "after:scale-x-0")
            : open || active ? "text-brand-blue-700 after:scale-x-100" : "text-brand-blue-900 after:scale-x-0 hover:text-brand-blue-700",
          open && !season && "bg-brand-blue-50",
        )}
      >
        <span className="xl:hidden">{group.breve ?? group.titolo}</span>
        <span className="hidden xl:inline">{group.titolo}</span>
        <Icon name="chevron" size={16} className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div
          id={panelId}
          data-dept-panel={index}
          className={cn(
            "nav-pop absolute top-full z-10 mt-px w-[34rem] overflow-hidden rounded-b-[var(--radius-xl)] border border-t-0 border-brand-blue-100 bg-white shadow-lift",
            alignRight ? "right-0" : "left-0",
          )}
        >
          <div className="grid grid-cols-[minmax(0,1fr)_12rem]">
            <div className="p-5">
              <p className="border-b-2 border-brand-blue-100 pb-2 text-[0.8125rem] font-extrabold uppercase tracking-wider text-brand-blue-700">{group.titolo}</p>
              <ul className="mt-2">
                {group.items.map((item) => (
                  <li key={`${item.href}|${item.label}`}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={item.href === pathname ? "page" : undefined}
                      className={cn(
                        "group/link -mx-2 flex min-h-11 items-center justify-between gap-3 rounded-md px-2 py-1.5 text-base font-bold leading-snug hover:bg-brand-blue-50 hover:text-brand-blue-700",
                        item.href === pathname ? "bg-brand-blue-50 text-brand-blue-700" : "text-brand-blue-900",
                      )}
                    >
                      {item.label}
                      <Icon name="arrow-right" size={16} className="-translate-x-1 opacity-0 transition group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={allHref} onClick={onNavigate} className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-extrabold text-brand-magenta-700 underline-offset-4 hover:underline">
                {allLabel}
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
            <SmartImage
              src={group.immagine.src}
              alt=""
              label={group.titolo}
              sizes="192px"
              position={group.immagine.position}
              rounded="rounded-none"
              className="h-full min-h-56"
              imgClassName="group-hover:scale-100"
            />
          </div>
        </div>
      )}
    </li>
  );
}
