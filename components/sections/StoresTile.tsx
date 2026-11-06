"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { HeaderCopy, HomeCopy, Store } from "@/lib/content/schemas";
import { storePath } from "@/lib/stores";
import { cn } from "@/lib/utils";
import { StoreStatus } from "./StoreStatus";

type Props = { stores: Store[]; copy: HomeCopy["tabellone"]["negozi"]; statusCopy: HeaderCopy["negozio"]; className?: string };

/** Riquadro "Negozi" del tabellone: i tre negozi con aperto/chiuso adesso. */
export function StoresTile({ stores, copy, statusCopy, className }: Props) {
  return (
    <div className={cn("on-dark flex flex-col rounded-[var(--radius-xl)] bg-brand-blue-900 p-4 text-white sm:p-5", className)}>
      <h2 className="!text-base !font-black uppercase tracking-wide text-white">{copy.titolo}</h2>
      <ul className="mt-2 divide-y divide-white/20">
        {stores.map((store) => (
          <li key={store.id}>
            <Link href={storePath(store)} className="flex min-h-14 items-center justify-between gap-3 py-2 hover:text-white/80">
              <span className="min-w-0">
                <span className="block text-lg font-extrabold leading-tight">{store.citta}</span>
                <StoreStatus store={store} copy={statusCopy} neutralPrefix={copy.apertoNeutro} tone="light" />
              </span>
              <Icon name="arrow-right" size={20} className="shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
      <Button href="/dove-siamo/" variant="light" size="sm" className="mt-3 self-start lg:mt-auto">
        {copy.cta}
      </Button>
    </div>
  );
}
