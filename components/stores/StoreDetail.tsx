"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { whatsappHref } from "@/components/layout/WhatsAppButton";
import type { Store } from "@/lib/content/schemas";
import { directionsUrl, formatAddress, formatOpeningHours, hasOpeningHours, telHref } from "@/lib/stores";
import { StoreMap } from "./StoreMap";
import { useOpenStatus } from "./useOpenStatus";

type StoreDetailProps = {
  store: Store;
  /** WhatsApp globale di fallback se la sede non ha un numero proprio. */
  whatsapp: { numero: string | null; messaggio: string };
};

/** Scheda sede ESTESA per /dove-siamo/: foto, particolarita, servizi, orari in tabella, mappa, azioni. */
export function StoreDetail({ store, whatsapp }: StoreDetailProps) {
  const status = useOpenStatus(store);
  const hours = formatOpeningHours(store);
  const tel = telHref(store.telefono);
  const wa = store.whatsapp ?? whatsapp.numero;
  const titleId = `titolo-${store.id}`;

  return (
    <article
      id={store.id}
      aria-labelledby={titleId}
      className="grid scroll-mt-28 gap-0 overflow-hidden rounded-lg bg-white shadow-soft lg:grid-cols-2"
    >
      <div className="flex flex-col">
        <SmartImage
          src={store.immagine.src}
          alt={store.immagine.alt}
          label={`Foto negozio ${store.citta}`}
          ratio="16/10"
          sizes="(min-width: 1024px) 50vw, 100vw"
          rounded="rounded-none"
        />
        <StoreMap store={store} className="min-h-64 flex-1" />
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id={titleId} className="text-brand-blue-900">
            {store.citta}
          </h2>
          {status !== "unknown" && (
            <Badge tone={status === "open" ? "blue" : "sand"}>{status === "open" ? "Aperto ora" : "Chiuso"}</Badge>
          )}
        </div>
        <p className="mt-2 flex gap-2 text-lg text-muted">
          <Icon name="map-pin" size={22} className="mt-0.5 shrink-0 text-brand-magenta-700" />
          <span>{formatAddress(store)}</span>
        </p>

        {store.particolarita.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl text-brand-blue-900">Da sapere</h3>
            <ul className="mt-3 space-y-2">
              {store.particolarita.map((p) => (
                <li key={p} className="flex gap-2">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-brand-magenta-700" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {store.servizi.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl text-brand-blue-900">Servizi</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {store.servizi.map((s) => (
                <li key={s} className="rounded-full bg-sand px-3 py-1 text-sm font-medium text-brand-blue-900">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <h3 className="flex items-center gap-2 text-xl text-brand-blue-900">
            <Icon name="clock" size={22} /> Orari
          </h3>
          {hasOpeningHours(store) ? (
            <>
              <table className="mt-3 w-full max-w-sm text-left text-sm">
                <caption className="sr-only">Orari di apertura di {store.nome}</caption>
                <tbody>
                  {hours.map((r) => (
                    <tr key={r.giorno} className="border-b border-sand last:border-0">
                      <th scope="row" className="py-1.5 pr-4 font-semibold capitalize">
                        {r.etichetta}
                      </th>
                      <td className="py-1.5 text-muted">{r.testo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {store.noteOrari && <p className="mt-2 text-sm text-muted">{store.noteOrari}</p>}
            </>
          ) : (
            <p className="mt-2 text-muted">Orari in aggiornamento</p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          <Button href={directionsUrl(store)} iconRight={<Icon name="external" size={18} />}>
            Indicazioni
          </Button>
          {tel && (
            <Button href={tel} variant="outline" iconLeft={<Icon name="phone" size={18} />}>
              Chiama
            </Button>
          )}
          {wa && (
            <Button
              href={whatsappHref(wa, whatsapp.messaggio)}
              variant="secondary"
              iconLeft={<Icon name="whatsapp" size={18} />}
            >
              WhatsApp
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
