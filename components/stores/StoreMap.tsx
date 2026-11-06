import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Store } from "@/lib/content/schemas";
import { formatAddress, hasConfirmedCoordinates, mapUrl, osmEmbedUrl } from "@/lib/stores";
import { cn } from "@/lib/utils";

type FallbackProps = {
  store: Pick<Store, "citta" | "indirizzo">;
  /** Se presente, l'intero riquadro e' un link (home: porta alla mappa in /dove-siamo/). */
  href?: string;
  cta?: string;
  className?: string;
};

/**
 * Riquadro di ripiego della mappa: pin, citta' e indirizzo su tinta di brand. Sta sotto l'iframe
 * (visibile finche' la mappa non e' caricata o se non si carica) e, nella home, sostituisce la mappa.
 */
export function StoreMapFallback({ store, href, cta, className }: FallbackProps) {
  const body = (
    <>
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-blue-600 text-white">
        <Icon name="map-pin" size={26} />
      </span>
      <span className="text-xl font-black leading-tight text-brand-blue-900">{store.citta}</span>
      <span className="text-sm text-brand-blue-800">{store.indirizzo.via}</span>
      {cta && (
        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-blue-700 group-hover:underline">
          {cta}
          <Icon name="arrow-right" size={16} />
        </span>
      )}
    </>
  );
  const cls = cn(
    "group flex h-full w-full flex-col items-center justify-center gap-1 bg-brand-blue-100/60 p-4 text-center",
    "[background-image:linear-gradient(rgb(15_107_180/0.09)_1px,transparent_1px),linear-gradient(90deg,rgb(15_107_180/0.09)_1px,transparent_1px)] [background-size:28px_28px]",
    className,
  );
  return href ? (
    <Link href={href} className={cls}>{body}</Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/**
 * Mappa del negozio. Con le coordinate confermate dal cliente (`coordinateConfermate`): mappa OpenStreetMap sopra il
 * riquadro di ripiego. Altrimenti nessuna mappa di terzi: un riquadro con citta', indirizzo e «Apri in Google Maps»,
 * che cerca l'indirizzo (mai le coordinate).
 */
export function StoreMap({ store, buttonLabel, className, lazy = false }: { store: Store; buttonLabel: string; className?: string; lazy?: boolean }) {
  if (!hasConfirmedCoordinates(store)) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1 bg-brand-blue-100/60 p-6 text-center",
          "[background-image:linear-gradient(rgb(15_107_180/0.09)_1px,transparent_1px),linear-gradient(90deg,rgb(15_107_180/0.09)_1px,transparent_1px)] [background-size:28px_28px]",
          className,
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-blue-600 text-white">
          <Icon name="map-pin" size={26} />
        </span>
        <span className="mt-1 text-2xl font-black leading-tight text-brand-blue-900">{store.citta}</span>
        <span className="text-base text-brand-blue-800">{formatAddress(store)}</span>
        <Button href={mapUrl(store)} variant="secondary" iconRight={<Icon name="external" size={16} />} className="mt-3">
          {buttonLabel}
        </Button>
      </div>
    );
  }
  return (
    <div className={cn("relative aspect-[16/10] w-full overflow-hidden bg-brand-blue-50", className)}>
      <StoreMapFallback store={store} className="absolute inset-0" />
      <iframe
        title={`Mappa: ${store.nome}, ${formatAddress(store)}`}
        src={osmEmbedUrl(store)}
        loading={lazy ? "lazy" : "eager"}
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
