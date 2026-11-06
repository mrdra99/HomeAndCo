import { StoreStatus } from "@/components/sections/StoreStatus";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { HeaderCopy, Store } from "@/lib/content/schemas";
import { directionsUrl, formatAddress, hoursSummary, storePath } from "@/lib/stores";

export type StoreCardCopy = { orari: string; indicazioni: string; mappa: string };

type Props = {
  store: Store;
  copy: StoreCardCopy;
  statusCopy: HeaderCopy["negozio"];
  /** Testo mostrato fino al mount, al posto dello stato aperto/chiuso. */
  neutralPrefix: string;
  /** Livello del titolo: h2 sotto il titolo della pagina, h3 sotto il titolo di una sezione. */
  headingLevel?: "h2" | "h3";
};

/**
 * Scheda negozio compatta, uguale per tutti: nome, stato dal vivo, indirizzo, orari, «Indicazioni» e il link
 * alla pagina del negozio. Home e indice /dove-siamo/. L'`id` e' l'ancora storica /dove-siamo/#<id>.
 */
export function StoreCard({ store, copy, statusCopy, neutralPrefix, headingLevel: Heading = "h3" }: Props) {
  const { uniform, rows } = hoursSummary(store);
  return (
    <article
      id={store.id}
      aria-labelledby={`store-${store.id}`}
      className="flex h-full scroll-mt-24 flex-col overflow-hidden rounded-[var(--radius-lg)] border-2 border-brand-blue-100 bg-white"
    >
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Heading id={`store-${store.id}`} className="!text-2xl text-brand-blue-900">{store.citta}</Heading>
        <StoreStatus store={store} copy={statusCopy} neutralPrefix={neutralPrefix} tone="dark" className="mt-1" />
        <p className="mt-3 flex gap-2 text-sm text-ink">
          <Icon name="map-pin" size={18} className="mt-0.5 shrink-0 text-brand-magenta-700" />
          <span>{formatAddress(store)}</span>
        </p>
        <p className="mt-2 flex gap-2 text-sm text-ink">
          <Icon name="clock" size={18} className="mt-0.5 shrink-0 text-brand-magenta-700" />
          <span>
            <span className="font-bold">{copy.orari}: </span>
            {uniform ? uniform.replace("-", "–") : rows.map((r) => `${r.etichettaBreve} ${r.testo}`).join(" · ")}
            {store.noteOrari && <span className="block text-muted">{store.noteOrari}</span>}
          </span>
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Button href={directionsUrl(store)} variant="secondary" size="sm" iconRight={<Icon name="external" size={16} />}>
            {copy.indicazioni}
          </Button>
          <Button href={storePath(store)} variant="outline" size="sm">
            {copy.mappa}
          </Button>
        </div>
      </div>
    </article>
  );
}
