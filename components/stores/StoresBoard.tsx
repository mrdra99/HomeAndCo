"use client";

import { StoreStatus } from "@/components/sections/StoreStatus";
import { Container } from "@/components/ui/Container";
import type { HeaderCopy, PagesCopy, Store } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";
import { StoreCard, type StoreCardCopy } from "./StoreCard";
import { useSelectedStoreId } from "./useSelectedStore";

type Props = {
  stores: Store[];
  copy: PagesCopy["doveSiamo"];
  cardCopy: StoreCardCopy;
  statusCopy: HeaderCopy["negozio"];
  neutralPrefix: string;
  whatsapp: { numero: string | null; messaggio: string };
};

/**
 * /dove-siamo/: selettore dei negozi con stato dal vivo e, sotto, le schede estese.
 * La scelta e' la stessa di "Il tuo negozio" nella testata (useSelectedStoreId): il negozio salvato e'
 * gia' selezionato, scegliere qui aggiorna anche la testata. Le schede restano tutte nell'HTML (ancore #id).
 */
export function StoresBoard({ stores, copy, cardCopy, statusCopy, neutralPrefix, whatsapp }: Props) {
  const [savedId, select] = useSelectedStoreId();
  const selectedId = stores.some((s) => s.id === savedId) ? savedId : null;

  return (
    <Container size="wide" className="py-5 sm:py-8">
      <div role="group" aria-label={copy.scegli} className="grid gap-2 sm:grid-cols-3 sm:gap-3">
        {stores.map((s) => {
          const on = s.id === selectedId;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => select(s.id)}
              aria-current={on ? "true" : undefined}
              className={cn(
                "flex min-h-14 flex-col justify-center rounded-[var(--radius-md)] border-2 px-4 py-2 hover:border-brand-blue-600",
                on ? "border-brand-magenta-600 bg-brand-magenta-50" : "border-brand-blue-100 bg-white",
              )}
            >
              <span className="flex items-center justify-between gap-2 text-lg font-extrabold leading-tight text-brand-blue-900">
                {s.citta}
                {on && <span className="text-xs font-extrabold uppercase tracking-wide text-brand-magenta-700">{copy.tuoNegozio}</span>}
              </span>
              <StoreStatus store={s} copy={statusCopy} neutralPrefix={neutralPrefix} tone="dark" />
            </a>
          );
        })}
      </div>

      <ul className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
        {stores.map((s) => (
          <li key={s.id}>
            <StoreCard
              store={s}
              copy={cardCopy}
              statusCopy={statusCopy}
              neutralPrefix={neutralPrefix}
              detail={{ copy, whatsapp, selected: s.id === selectedId, onSelect: () => select(s.id) }}
            />
          </li>
        ))}
      </ul>
    </Container>
  );
}
