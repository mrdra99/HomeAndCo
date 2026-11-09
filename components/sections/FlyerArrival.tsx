"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useConsent } from "@/components/consent/ConsentProvider";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Flyer, HomeCopy, Store } from "@/lib/content/schemas";
import { useToday } from "@/lib/date-store";
import { flyerStoreNames, formatDateRangeIt, homeFlyer } from "@/lib/flyers";

type Props = { flyers: Flyer[]; buildDate: string; stores: Store[]; copy: HomeCopy["volantino"] };

/** Arrivo automatico a ogni apertura della home, dopo la scelta cookie. Nessun modale. */
export function FlyerArrival({ flyers, buildDate, stores, copy }: Props) {
  const today = useToday(buildDate);
  const { ready, decided, preferencesOpen } = useConsent();
  const [visibleKey, setVisibleKey] = useState<string | null>(null);
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);
  const found = homeFlyer(flyers, today);
  const flyer = found?.flyer;
  const key = flyer ? `${flyer.id}:${flyer.validoDal}:${flyer.validoAl}:${found.status}` : null;
  const allowed = ready && decided && !preferencesOpen;

  useEffect(() => {
    if (!key || !allowed || dismissedKey === key) return;
    const timer = window.setTimeout(() => {
      setVisibleKey(key);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [key, allowed, dismissedKey]);

  if (!flyer || !key || visibleKey !== key || dismissedKey === key || !allowed) return null;
  const names = flyerStoreNames(flyer, stores);
  const close = () => setDismissedKey(key);
  const title = found?.status === "latest" ? copy.statoUltimo : found?.status === "upcoming" ? copy.statoAnteprima : copy.arrivo.titolo;

  return (
    <aside aria-label={title} className="flyer-arrival on-dark fixed bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.75rem)] right-3 z-[60] w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border border-white/30 bg-brand-blue-900 p-4 text-white shadow-[0_12px_48px_rgb(0_0_0/0.28)] lg:bottom-6 lg:right-6"
      onKeyDown={(e) => { if (e.key === "Escape") close(); }}>
      <svg aria-hidden="true" viewBox="0 0 64 64" className="flyer-plane pointer-events-none absolute -top-9 right-10 size-14 text-brand-magenta-600" fill="currentColor"><path d="M4 28 59 5 41 60 28 38 4 28Z"/><path d="m28 38 31-33" stroke="white" strokeWidth="2" fill="none"/></svg>
      <button type="button" onClick={close} aria-label={copy.arrivo.chiudi} className="absolute right-1 top-1 flex size-11 items-center justify-center rounded-md hover:bg-white/10"><Icon name="close" size={20} /></button>
      <div className="flex items-center gap-4 pr-3">
        <Link href="/offerte/" onClick={close} aria-label={copy.ctaAttivo} className="flyer-paper relative block w-24 shrink-0 rotate-[-7deg] rounded-sm bg-white shadow-lg">
          <SmartImage src={flyer.copertina.src} alt={flyer.copertina.alt} label={flyer.titolo} ratio="210/297" sizes="96px" rounded="rounded-sm" />
        </Link>
        <div className="min-w-0 pt-3">
          <p className="text-xs font-bold text-white/80">{title}</p>
          <h2 className="mt-1 !text-xl leading-tight text-white">{flyer.titolo}</h2>
          <p className="mt-2 text-xs">{formatDateRangeIt(flyer.validoDal, flyer.validoAl)}</p>
          <p className="mt-1 text-xs text-white/80">{names ? copy.soloNegozi.replace("{negozi}", names) : copy.tuttiINegozi}</p>
          <Link href="/offerte/" onClick={close} className="mt-3 inline-flex min-h-11 items-center rounded-md bg-brand-magenta-600 px-3 text-sm font-bold text-white hover:bg-brand-magenta-700">
            {found?.status === "upcoming" ? copy.ctaAnteprima : copy.ctaAttivo}
          </Link>
        </div>
      </div>
    </aside>
  );
}
