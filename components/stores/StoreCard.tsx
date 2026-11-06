"use client";

import { StoreStatus } from "@/components/sections/StoreStatus";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { whatsappHref } from "@/components/layout/WhatsAppButton";
import type { HeaderCopy, PagesCopy, Store } from "@/lib/content/schemas";
import { directionsUrl, formatAddress, formatOpeningHours, hasOpeningHours, hoursSummary, telHref } from "@/lib/stores";
import { cn } from "@/lib/utils";
import { StoreMap } from "./StoreMap";

export type StoreCardCopy = { orari: string; indicazioni: string; mappa: string };

type Props = {
  store: Store;
  copy: StoreCardCopy;
  statusCopy: HeaderCopy["negozio"];
  /** Testo mostrato fino al mount, al posto dello stato aperto/chiuso. */
  neutralPrefix: string;
  /**
   * Presente solo in /dove-siamo/: scheda estesa con particolarita', servizi, orari in tabella,
   * mappa interattiva e contatti. Assente (home): scheda compatta, senza contenuti di terze parti.
   */
  detail?: {
    copy: PagesCopy["doveSiamo"];
    whatsapp: { numero: string | null; messaggio: string };
    selected: boolean;
    /** Imposta questo negozio come "Il tuo negozio" (stessa scelta della testata). */
    onSelect: () => void;
  };
};

/**
 * Scheda negozio condivisa da home e /dove-siamo/: stesso titolo, stato dal vivo, indirizzo, orari, indicazioni.
 * Home: scheda compatta uguale per tutti (nome, stato, indirizzo, orari, due pulsanti), senza foto ne' mappa.
 * /dove-siamo/: foto (se c'e') + mappa OpenStreetMap con ripiego sotto.
 */
export function StoreCard({ store, copy, statusCopy, neutralPrefix, detail }: Props) {
  const { uniform, rows } = hoursSummary(store);
  const hours = detail ? formatOpeningHours(store) : [];
  const tel = telHref(store.telefono);
  const wa = store.whatsapp ?? detail?.whatsapp.numero ?? null;
  const photo = detail && store.immagine.src ? (
    <SmartImage
      src={store.immagine.src}
      alt={store.immagine.alt}
      label={store.nome}
      ratio="16/10"
      sizes="(min-width: 1024px) 40vw, 100vw"
      rounded="rounded-none"
      imgClassName="group-hover:scale-100"
    />
  ) : null;

  return (
    <article
      id={store.id}
      aria-labelledby={`store-${store.id}`}
      className={cn(
        "flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[var(--radius-lg)] border-2 bg-white",
        detail?.selected ? "border-brand-magenta-600" : "border-brand-blue-100",
        detail && "lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
      )}
    >
      {detail ? (
        <div className="flex flex-col">
          {photo}
          <StoreMap store={store} lazy className="min-h-56 flex-1 aspect-auto lg:min-h-64" />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 id={`store-${store.id}`} className="!text-2xl text-brand-blue-900">{store.citta}</h3>
          {detail?.selected && (
            <span className="rounded-md bg-brand-magenta-600 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-white">{detail.copy.tuoNegozio}</span>
          )}
        </div>
        <StoreStatus store={store} copy={statusCopy} neutralPrefix={neutralPrefix} tone="dark" className="mt-1" />
        <p className="mt-3 flex gap-2 text-sm text-ink">
          <Icon name="map-pin" size={18} className="mt-0.5 shrink-0 text-brand-magenta-700" />
          <span>{formatAddress(store)}</span>
        </p>

        {detail ? (
          <>
            <div className="mt-3 text-sm">
              <p className="flex items-center gap-2 font-bold text-brand-blue-900">
                <Icon name="clock" size={18} className="text-brand-magenta-700" /> {detail.copy.orari}
              </p>
              {hasOpeningHours(store) ? (
                <>
                  {uniform ? (
                    <p className="mt-1 font-semibold">{neutralPrefix} {uniform.replace("-", "–")}</p>
                  ) : (
                  <table className="mt-1 w-full max-w-xs text-left">
                    <caption className="sr-only">{detail.copy.orari}: {store.nome}</caption>
                    <tbody>
                      {hours.map((r) => (
                        <tr key={r.giorno} className="border-b border-brand-blue-100 last:border-0">
                          <th scope="row" className="py-1 pr-4 font-semibold capitalize">{r.etichetta}</th>
                          <td className="py-1 text-ink">{r.testo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  )}
                  {store.noteOrari && <p className="mt-1 text-muted">{store.noteOrari}</p>}
                </>
              ) : (
                <p className="mt-1 text-muted">{detail.copy.orariInAggiornamento}</p>
              )}
            </div>
            {store.particolarita.length > 0 && (
              <div className="mt-4">
                <h4 className="text-base font-extrabold text-brand-blue-900">{detail.copy.daSapere}</h4>
                <ul className="mt-1 space-y-1 text-sm">
                  {store.particolarita.map((p) => (
                    <li key={p} className="flex gap-2">
                      <Icon name="check" size={18} className="mt-0.5 shrink-0 text-brand-magenta-700" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {store.servizi.length > 0 && (
              <div className="mt-4">
                <h4 className="text-base font-extrabold text-brand-blue-900">{detail.copy.servizi}</h4>
                <ul className="mt-1 flex flex-wrap gap-2">
                  {store.servizi.map((s) => (
                    <li key={s} className="rounded-md bg-sand px-2.5 py-1 text-sm font-semibold text-brand-blue-900">{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="mt-2 flex gap-2 text-sm text-ink">
            <Icon name="clock" size={18} className="mt-0.5 shrink-0 text-brand-magenta-700" />
            <span>
              <span className="font-bold">{copy.orari}: </span>
              {uniform ? uniform.replace("-", "–") : rows.map((r) => `${r.etichettaBreve} ${r.testo}`).join(" · ")}
              {store.noteOrari && <span className="block text-muted">{store.noteOrari}</span>}
            </span>
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Button href={directionsUrl(store)} variant="secondary" size="sm" iconRight={<Icon name="external" size={16} />}>
            {copy.indicazioni}
          </Button>
          {!detail && (
            <Button href={`/dove-siamo/#${store.id}`} variant="outline" size="sm">
              {copy.mappa}
            </Button>
          )}
          {detail && (
            <Button
              variant={detail.selected ? "ghost" : "outline"}
              size="sm"
              onClick={detail.onSelect}
              aria-pressed={detail.selected}
              iconLeft={<Icon name={detail.selected ? "check" : "store"} size={16} />}
            >
              {detail.selected ? detail.copy.tuoNegozio : detail.copy.impostaNegozio}
            </Button>
          )}
          {detail && tel && (
            <Button href={tel} variant="outline" size="sm" iconLeft={<Icon name="phone" size={16} />}>{detail.copy.chiama}</Button>
          )}
          {detail && wa && (
            <Button href={whatsappHref(wa, detail.whatsapp.messaggio)} variant="outline" size="sm" iconLeft={<Icon name="whatsapp" size={16} />}>
              {detail.copy.whatsapp}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
