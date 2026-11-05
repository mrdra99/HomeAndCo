"use client";

import { StoreMap } from "./StoreMap";
import { SmartImage } from "@/components/ui/SmartImage";
import { useOpenStatus } from "./useOpenStatus";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import type { Store } from "@/lib/content/schemas";
import {
  directionsUrl,
  formatAddress,
  formatOpeningHours,
  hasOpeningHours,
  telHref,
} from "@/lib/stores";

type StoreCardProps = { store: Store };

/**
 * Scheda sede riusabile. La mappa OpenStreetMap si carica solo su richiesta.
 */
export function StoreCard({ store }: StoreCardProps) {
  const status = useOpenStatus(store);
  const hours = formatOpeningHours(store);
  const tel = telHref(store.telefono);

  return (
    <Card flush className="flex h-full flex-col" as="article" aria-labelledby={`store-${store.id}`}>
      {store.immagine.src ? <SmartImage src={store.immagine.src} alt={store.immagine.alt} label={store.nome} ratio="16/9" sizes="(min-width: 1024px) 33vw, 100vw" rounded="rounded-none" /> : <StoreMap store={store} />}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 id={`store-${store.id}`} className="text-brand-blue-900">
            {store.citta}
          </h3>
          {status !== "unknown" && (
            <Badge tone={status === "open" ? "blue" : "sand"} className="shrink-0">
              {status === "open" ? "Aperto ora" : "Chiuso"}
            </Badge>
          )}
        </div>

        <p className="mt-2 flex gap-2 text-muted">
          <Icon name="map-pin" size={20} className="mt-0.5 shrink-0 text-brand-magenta-700" />
          <span>{formatAddress(store)}</span>
        </p>

        {store.particolarita.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {store.particolarita.map((p) => (
              <li
                key={p}
                className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-sm font-medium text-brand-blue-900"
              >
                <Icon name="check" size={14} />
                {p}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 text-sm">
          <p className="mb-1 flex items-center gap-2 font-semibold text-brand-blue-900">
            <Icon name="clock" size={18} /> Orari
          </p>
          {hasOpeningHours(store) ? (
            <>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-muted">
                {hours.map((r) => (
                  <div key={r.giorno} className="contents">
                    <dt className="capitalize">{r.etichetta}</dt>
                    <dd>{r.testo}</dd>
                  </div>
                ))}
              </dl>
              {store.noteOrari && <p className="mt-1 text-muted">{store.noteOrari}</p>}
            </>
          ) : (
            <p className="text-muted">Orari in aggiornamento</p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <Button href={directionsUrl(store)} size="sm" iconRight={<Icon name="external" size={16} />}>
            Indicazioni
          </Button>
          {tel && (
            <Button href={tel} size="sm" variant="outline" iconLeft={<Icon name="phone" size={16} />}>
              Chiama
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
