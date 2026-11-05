import type { Store } from "@/lib/content/schemas";
import { formatAddress, osmEmbedUrl } from "@/lib/stores";
import { cn } from "@/lib/utils";

/** Mappa della sede già visibile all'apertura, senza attivazione manuale. */
export function StoreMap({ store, className }: { store: Store; className?: string }) {
  return (
    <div className={cn("relative aspect-[16/10] w-full overflow-hidden bg-brand-blue-50", className)}>
      <iframe
        title={`Mappa: ${store.nome}, ${formatAddress(store)}`}
        src={osmEmbedUrl(store)}
        loading="eager"
        className="h-full w-full border-0"
      />
    </div>
  );
}
