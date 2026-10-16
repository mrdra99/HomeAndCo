"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Store } from "@/lib/content/schemas";
import { formatAddress, osmEmbedUrl } from "@/lib/stores";
import { cn } from "@/lib/utils";

function MapEmbed({ store }: { store: Store }) {
  return (
    <iframe
      title={`Mappa: ${store.nome}, ${formatAddress(store)}`}
      src={osmEmbedUrl(store)}
      loading="lazy"
      className="h-full w-full border-0"
    />
  );
}

/**
 * OpenStreetMap caricato su richiesta: anteprima sempre disponibile su ogni schermo.
 */
export function StoreMap({ store, className }: { store: Store; className?: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className={cn("relative aspect-[16/10] w-full overflow-hidden bg-brand-blue-50", className)}>
        {on ? (
          <MapEmbed store={store} />
        ) : (
          <button
            type="button"
            onClick={() => setOn(true)}
            aria-label={`Carica la mappa di ${store.citta}`}
            className="flex h-full w-full flex-col items-center justify-center gap-3 px-5 text-center text-brand-blue-800 transition-colors hover:bg-brand-blue-100"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-white"><Icon name="map-pin" size={32} className="text-brand-magenta-600" /></span>
            <span className="font-semibold">Carica la mappa</span>
            <span className="text-sm text-muted">{store.citta}</span>
          </button>
        )}
    </div>
  );
}
