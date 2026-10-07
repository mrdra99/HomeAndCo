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
 * Mappa OpenStreetMap senza chiavi API. Desktop: iframe lazy. Mobile: anteprima statica
 * che carica l'iframe solo al tocco (performance).
 */
export function StoreMap({ store, className }: { store: Store; className?: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className={cn("relative aspect-[16/10] w-full overflow-hidden bg-brand-blue-50", className)}>
      <div className="hidden h-full md:block">
        <MapEmbed store={store} />
      </div>
      <div className="h-full md:hidden">
        {on ? (
          <MapEmbed store={store} />
        ) : (
          <button
            type="button"
            onClick={() => setOn(true)}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand-blue-800 [background-image:repeating-linear-gradient(135deg,transparent_0_14px,rgb(11_108_176/0.08)_14px_28px)]"
          >
            <Icon name="map-pin" size={36} className="text-brand-magenta-600" />
            <span className="font-semibold">Tocca per caricare la mappa</span>
            <span className="text-sm text-muted">{formatAddress(store)}</span>
          </button>
        )}
      </div>
    </div>
  );
}
