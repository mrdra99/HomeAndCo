"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Sticker, Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { useToday } from "@/lib/date-store";
import { archivedFlyers, currentFlyers, upcomingFlyers, isFlyerUpcoming, formatDateIt, formatDateRangeIt } from "@/lib/flyers";
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
  const upcoming = upcomingFlyers(flyers, today);
  const examples = flyers.filter((f) => f.esempioAttivo && !current.includes(f) && !upcoming.includes(f));
  const available = [...current, ...upcoming, ...examples];
  const archived = archivedFlyers(flyers, today);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = available.find((f) => f.id === selectedId) ?? available[0];
  const preview = Boolean(selected && isFlyerUpcoming(selected, today));
  const example = Boolean(selected && examples.includes(selected));

  return (
    <>
      {selected ? (
        <>
          <Section tone="cream" className="pt-4 sm:pt-8">
            {available.length > 1 && (
              <div role="tablist" aria-label="Volantini in corso, anteprime ed esempi" className="hide-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 py-2 sm:mx-0 sm:px-0">
                {available.map((f) => {
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
                        const i = available.findIndex((x) => x.id === f.id);
                        const n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
                        if (n === null) return;
                        e.preventDefault();
                        const next = available[(n + available.length) % available.length];
                        setSelectedId(next.id);
                        document.getElementById(`tab-${next.id}`)?.focus();
                      }}
                      className={cn(
                        "min-h-12 shrink-0 rounded-full px-5 font-semibold transition-colors",
                        on ? "bg-brand-blue-600 text-white shadow-soft" : "bg-white text-brand-blue-800 hover:bg-brand-blue-50",
                      )}
                    >
                      {f.titolo}{examples.includes(f) ? " · Esempio" : isFlyerUpcoming(f, today) ? " · Anteprima" : ""}
                    </button>
                  );
                })}
              </div>
            )}

            <div
              id="volantino-attivo"
              role={available.length > 1 ? "tabpanel" : undefined}
              aria-labelledby={available.length > 1 ? `tab-${selected.id}` : undefined}
              key={selected.id}
              className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
            >
              <Reveal className="order-2 lg:order-1">
                <p className="text-sm font-bold text-brand-magenta-700">{example ? "Esempio di offerte attive" : preview ? "Il prossimo volantino, in anteprima" : "Il volantino in corso"}</p>
                <h2 className="mt-3 text-brand-blue-900">{selected.titolo}</h2>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Sticker tone="accent" rotate={-3}>
                    {formatDateRangeIt(selected.validoDal, selected.validoAl)}
                  </Sticker>
                  <span className="inline-flex items-center gap-2 font-semibold text-brand-blue-800">
                    <Icon name="map-pin" size={20} className="text-brand-magenta-700" />
                    {preview ? storesLabel(selected, storeNames).replace(/^Vale/, "Valido") : storesLabel(selected, storeNames)}
                  </span>
                </div>
                <p className="mt-5 max-w-lg text-lg text-muted">
                  {example
                    ? "Catalogo di ottobre mostrato come esempio. Le date originali sono concluse: prezzi e promozioni non sono attualmente validi."
                    : preview
                    ? `Le offerte iniziano il ${formatDateIt(selected.validoDal)}. Intanto puoi sfogliare il catalogo e preparare la tua lista.`
                    : "Sfoglia il catalogo e controlla le offerte del negozio indicato. Puoi anche scaricare il PDF e portarlo con te."}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {selected.pagine.length > 0 && (
                    <Button href="#sfoglia" size="lg" iconRight={<Icon name="arrow-right" size={20} className="rotate-90" />}>
                      Sfoglia
                    </Button>
                  )}
                  {selected.pdf && (
                    <Button href={selected.pdf} download variant="outline" size="lg" iconLeft={<Icon name="download" size={20} />}>
                      Scarica PDF{selected.pdfDimensione ? ` (${selected.pdfDimensione})` : ""}
                    </Button>
                  )}
                </div>
              </Reveal>
              <Reveal delay={0.08} className="order-1 lg:order-2">
                {example && <p className="mb-3 border-l-2 border-brand-magenta-600 bg-white px-4 py-3 text-sm font-semibold text-brand-blue-900">Esempio dimostrativo · offerte di ottobre concluse</p>}
                {preview && (
                  <p className="mb-3 rounded-xl bg-brand-blue-50 px-4 py-3 text-sm font-semibold text-brand-blue-900 lg:hidden">
                    Anteprima: offerte dal {formatDateIt(selected.validoDal)}. {storesLabel(selected, storeNames).replace(/^Vale/, "Valido")}.
                  </p>
                )}
                <a href="#sfoglia" aria-label={`Sfoglia ${selected.titolo}`} className="group relative mx-auto block max-w-md rounded-2xl">
                  <SmartImage
                    src={selected.copertina.src}
                    alt={selected.copertina.alt || `Copertina del volantino ${selected.titolo}`}
                    label={selected.copertina.label ?? `Copertina volantino ${selected.titolo}`}
                    ratio="62352/87024"
                    fit="contain"
                    priority
                    sizes="(min-width: 512px) 448px, calc(100vw - 40px)"
                    rounded="rounded-2xl"
                    className="mx-auto max-w-md shadow-lift"
                  />
                  <span aria-hidden="true" className="absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/95 px-4 text-sm font-bold text-brand-blue-800 shadow-soft">
                    Sfoglia <Icon name="arrow-right" size={18} className="rotate-90" />
                  </span>
                </a>
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
              <h2 className="text-brand-blue-900">Al momento non ci sono volantini in corso.</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
                Per le promozioni del negozio, chiedi in cassa o seguici sui social.
                {archived.length > 0 && " Qui sotto trovi le edizioni precedenti, con le date e i negozi a cui si riferiscono."}
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
        <Section tone="cream" id="archivio" className="pt-4 sm:pt-8">
          <SectionHeading eyebrow="Archivio" title="Volantini precedenti" as="h2" />
          <Stagger className="mt-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {archived.map((f) => (
              <StaggerItem key={f.id}>
                <article className="relative grid h-full grid-cols-[96px_minmax(0,1fr)] overflow-hidden rounded-lg bg-white shadow-soft min-[420px]:flex min-[420px]:flex-col">
                  <div className="relative">
                    <SmartImage
                      src={f.copertina.src}
                      alt={f.copertina.alt || `Copertina del volantino ${f.titolo}`}
                      label={f.copertina.label ?? `Copertina ${f.titolo}`}
                      ratio="210/297"
                      fit="contain"
                      rounded="rounded-none"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, (min-width: 420px) 50vw, 96px"
                    />
                    <Badge tone="sand" rotate={-3} className="absolute left-2 top-2 hidden !text-xs min-[420px]:inline-flex sm:!text-sm">
                      Offerte concluse
                    </Badge>
                  </div>
                  <div className="min-w-0 p-4">
                    <p className="mb-2 text-xs font-semibold text-muted min-[420px]:hidden">Offerte concluse</p>
                    <h3 className="text-base leading-tight text-brand-blue-900 sm:text-lg">{f.titolo}</h3>
                    <p className="mt-1 text-sm text-muted">{f.periodo ?? formatDateRangeIt(f.validoDal, f.validoAl)}</p>
                    <p className="mt-1 text-sm text-muted">{storesLabel(f, storeNames).replace(/^Vale/, "Valido")}</p>
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
