"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { Sticker, Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { toIsoDate } from "@/lib/campaigns";
import { archivedFlyers, currentFlyers, formatDateRangeIt } from "@/lib/flyers";
import { cn } from "@/lib/utils";
import type { Flyer } from "@/lib/content/schemas";
import { FlyerViewer } from "./FlyerViewer";

type FlyersBoardProps = {
  /** TUTTI i volantini (anche scaduti): la classificazione avviene qui, in build e poi nel client. */
  flyers: Flyer[];
  /** Data (YYYY-MM-DD) della build: stato iniziale identico lato server e primo render client. */
  buildDate: string;
  /** id negozio -> nome da mostrare (es. "Prato"). */
  storeNames: Record<string, string>;
  social: { instagram: string; facebook: string };
  /** Link wa.me completo, o null se il numero non e' ancora configurato. */
  whatsappHref: string | null;
};

const subscribe = (cb: () => void) => {
  // ricontrolla ogni minuto (un volantino puo' scadere a pagina aperta)
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};

/** Data odierna reale solo dopo l'idratazione; in build/SSR usa buildDate (niente mismatch). */
function useToday(buildDate: string): Date {
  const iso = useSyncExternalStore(subscribe, () => toIsoDate(new Date()), () => buildDate);
  return new Date(`${iso}T12:00:00Z`);
}

function storesLabel(f: Flyer, names: Record<string, string>): string {
  if (f.negozi === "tutti") return "Vale in tutti i negozi";
  const list = f.negozi.map((id) => names[id] ?? id);
  return list.length === 1 ? `Vale nel negozio di ${list[0]}` : `Vale a ${list.slice(0, -1).join(", ")} e ${list[list.length - 1]}`;
}

/**
 * Sezione volantini della pagina Offerte. Il server la renderizza con la lista calcolata in build;
 * al mount rifiltra con la data reale: i volantini scaduti passano in archivio (senza ricaricare nulla).
 */
export function FlyersBoard({ flyers, buildDate, storeNames, social, whatsappHref }: FlyersBoardProps) {
  const today = useToday(buildDate);
  const current = currentFlyers(flyers, today);
  const archived = archivedFlyers(flyers, today);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = current.find((f) => f.id === selectedId) ?? current[0];

  return (
    <>
      {selected ? (
        <>
          <Section tone="cream" className="pt-4 sm:pt-8">
            {current.length > 1 && (
              <div role="tablist" aria-label="Volantini in corso" className="hide-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 py-2 sm:mx-0 sm:px-0">
                {current.map((f) => {
                  const on = f.id === selected.id;
                  return (
                    <button
                      key={f.id}
                      id={`tab-${f.id}`}
                      role="tab"
                      type="button"
                      aria-selected={on}
                      aria-controls="volantino-attivo"
                      tabIndex={on ? 0 : -1}
                      onClick={() => setSelectedId(f.id)}
                      onKeyDown={(e) => {
                        const i = current.findIndex((x) => x.id === f.id);
                        const n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
                        if (n === null) return;
                        e.preventDefault();
                        const next = current[(n + current.length) % current.length];
                        setSelectedId(next.id);
                        document.getElementById(`tab-${next.id}`)?.focus();
                      }}
                      className={cn(
                        "min-h-12 shrink-0 rounded-full px-5 font-semibold transition-colors",
                        on ? "bg-brand-blue-600 text-white shadow-soft" : "bg-white text-brand-blue-800 hover:bg-brand-blue-50",
                      )}
                    >
                      {f.titolo}
                    </button>
                  );
                })}
              </div>
            )}

            <div
              id="volantino-attivo"
              role={current.length > 1 ? "tabpanel" : undefined}
              aria-labelledby={current.length > 1 ? `tab-${selected.id}` : undefined}
              key={selected.id}
              className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
            >
              <Reveal className="order-2 lg:order-1">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-magenta-700">Il volantino in corso</p>
                <h2 className="mt-3 text-brand-blue-900">{selected.titolo}</h2>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Sticker tone="accent" rotate={-3}>
                    {formatDateRangeIt(selected.validoDal, selected.validoAl)}
                  </Sticker>
                  <span className="inline-flex items-center gap-2 font-semibold text-brand-blue-800">
                    <Icon name="map-pin" size={20} className="text-brand-magenta-700" />
                    {storesLabel(selected, storeNames)}
                  </span>
                </div>
                <p className="mt-5 max-w-lg text-lg text-muted">
                  Prezzi speciali e tante idee per la casa: sfoglialo qui con calma oppure scaricalo e portalo con te in negozio.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {selected.pagine.length > 0 && (
                    <Button href="#sfoglia" size="lg" iconRight={<Icon name="arrow-right" size={20} className="rotate-90" />}>
                      Sfoglia
                    </Button>
                  )}
                  {selected.pdf && (
                    <Button href={selected.pdf} download variant="outline" size="lg" iconLeft={<Icon name="download" size={20} />}>
                      Scarica PDF
                    </Button>
                  )}
                </div>
              </Reveal>
              <Reveal delay={0.08} className="order-1 lg:order-2">
                <SmartImage
                  src={selected.copertina.src}
                  alt={selected.copertina.alt || `Copertina del volantino ${selected.titolo}`}
                  label={selected.copertina.label ?? `Copertina volantino ${selected.titolo}`}
                  ratio="4/5"
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  rounded="rounded-t-[999px] rounded-b-[var(--radius-xl)]"
                  className="mx-auto max-w-md shadow-lift"
                />
              </Reveal>
            </div>
          </Section>

          {selected.pagine.length > 0 && (
            <Section tone="sand" rounded className="mx-3 sm:mx-6" id="sfoglia">
              <SectionHeading
                align="center"
                eyebrow="Sfoglia"
                title="Pagina dopo pagina"
                subtitle="Scorri con le frecce, con la tastiera o trascinando con il dito. Tocca Ingrandisci per vedere i dettagli."
              />
              <div className="mt-10">
                <FlyerViewer key={selected.id} pages={selected.pagine} title={selected.titolo} />
              </div>
            </Section>
          )}
        </>
      ) : (
        <Section tone="cream" className="pt-4 sm:pt-8">
          <Reveal>
            <Card tone="magenta-soft" className="mx-auto max-w-3xl text-center">
              <Badge tone="blue" rotate={3} className="mb-5">Presto in arrivo</Badge>
              <h2 className="text-brand-blue-900">Il nuovo volantino sta arrivando</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
                Stiamo preparando le prossime offerte. Seguici sui social o scrivici su WhatsApp: sarai tra i primi a scoprirle.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                {whatsappHref && (
                  <Button href={whatsappHref} size="lg" iconLeft={<Icon name="whatsapp" size={20} />}>
                    Scrivici su WhatsApp
                  </Button>
                )}
                <Button href={social.instagram} variant="secondary" size="lg" iconLeft={<Icon name="instagram" size={20} />}>
                  Instagram
                </Button>
                <Button href={social.facebook} variant="outline" size="lg" iconLeft={<Icon name="facebook" size={20} />}>
                  Facebook
                </Button>
              </div>
            </Card>
          </Reveal>
        </Section>
      )}

      {archived.length > 0 && (
        <Section tone="cream" className="pt-4 sm:pt-8">
          <SectionHeading eyebrow="Archivio" title="Volantini precedenti" as="h2" />
          <Stagger className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {archived.map((f) => (
              <StaggerItem key={f.id}>
                <article className="relative h-full overflow-hidden rounded-lg bg-white shadow-soft">
                  <div className="relative">
                    <SmartImage
                      src={f.copertina.src}
                      alt={f.copertina.alt || `Copertina del volantino ${f.titolo}`}
                      label={f.copertina.label ?? `Copertina ${f.titolo}`}
                      ratio="4/5"
                      rounded="rounded-none"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      imgClassName="grayscale-[0.6]"
                    />
                    <Badge tone="sand" rotate={-3} className="absolute left-2 top-2 !text-sm">
                      Scaduto
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base leading-tight text-brand-blue-900 sm:text-lg">{f.titolo}</h3>
                    <p className="mt-1 text-sm text-muted">{formatDateRangeIt(f.validoDal, f.validoAl)}</p>
                    {f.pdf && (
                      <a href={f.pdf} download className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-blue-700 underline-offset-4 hover:underline">
                        <Icon name="download" size={16} /> Scarica PDF
                      </a>
                    )}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}
    </>
  );
}
