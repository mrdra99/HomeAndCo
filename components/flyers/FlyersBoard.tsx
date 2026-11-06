"use client";

import { useEffect, useRef, useState } from "react";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Notice } from "@/components/ui/Notice";
import { SmartImage } from "@/components/ui/SmartImage";
import { archivedFlyers, currentFlyers, formatDateIt, formatDateRangeIt, isFlyerUpcoming, upcomingFlyers } from "@/lib/flyers";
import { useToday } from "@/lib/date-store";
import { scrollBehavior } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Flyer, PagesCopy } from "@/lib/content/schemas";
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
  copy: PagesCopy["offerte"];
};

type StoresCopy = PagesCopy["offerte"]["negozi"];

function storesLabel(f: Flyer, names: Record<string, string>, t: StoresCopy): string {
  if (f.negozi === "tutti") return t.tutti;
  const list = f.negozi.map((id) => names[id] ?? id);
  return list.length === 1
    ? t.uno.replace("{negozi}", list[0])
    : t.alcuni.replace("{negozi}", `${list.slice(0, -1).join(", ")} e ${list[list.length - 1]}`);
}

/** Date di validita' in italiano; per i fogli senza date stampate, il periodo scritto nel contenuto. */
function datesLabel(f: Flyer): string {
  const text = f.validoDal && f.validoAl ? formatDateRangeIt(f.validoDal, f.validoAl) : (f.periodo ?? "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Pagina Offerte. Il server la renderizza con la lista calcolata in build; al mount rifiltra con la data
 * reale: i volantini scaduti passano in archivio. Un volantino concluso non e' mai presentato come attuale:
 * dall'archivio si puo' aprire nel lettore, sempre con l'etichetta "concluso" e le sue date.
 */
export function FlyersBoard({ flyers, buildDate, storeNames, social, whatsappHref, copy }: FlyersBoardProps) {
  const today = useToday(buildDate);
  const current = currentFlyers(flyers, today);
  const upcoming = upcomingFlyers(flyers, today);
  const available = [...current, ...upcoming];
  const archived = archivedFlyers(flyers, today);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const viewing = archived.find((f) => f.id === viewingId) ?? null;
  const selected = viewing ?? available.find((f) => f.id === selectedId) ?? available[0] ?? null;
  const ended = Boolean(viewing);
  const preview = Boolean(selected && !ended && isFlyerUpcoming(selected, today));

  useEffect(() => {
    if (viewingId) panelRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }, [viewingId]);

  const eyebrow = ended ? copy.archivio.concluso : preview ? copy.anteprima : copy.inCorso;

  return (
    <>
      {selected ? (
        <section aria-label={eyebrow} className="bg-white py-6 sm:py-9">
          <Container size="wide">
            {available.length > 1 && !ended && (
              <div role="tablist" aria-label={copy.schede} className="hide-scrollbar -mx-5 mb-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
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
                        "min-h-11 shrink-0 rounded-md border-2 px-4 font-bold transition-colors",
                        on ? "border-brand-magenta-600 bg-brand-magenta-600 text-white" : "border-brand-blue-100 bg-white text-brand-blue-800 hover:border-brand-blue-600",
                      )}
                    >
                      {f.titolo}
                      {isFlyerUpcoming(f, today) ? ` · ${copy.etichettaAnteprima}` : ""}
                    </button>
                  );
                })}
              </div>
            )}

            <div
              ref={panelRef}
              id="volantino-attivo"
              role={available.length > 1 && !ended ? "tabpanel" : undefined}
              aria-labelledby={available.length > 1 && !ended ? `tab-${selected.id}` : undefined}
              key={selected.id}
              className="grid scroll-mt-28 gap-5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12"
            >
              <a href="#sfoglia" aria-label={`${copy.sfoglia}: ${selected.titolo}`} className="group relative mx-auto block w-44 sm:w-full">
                <SmartImage
                  src={selected.copertina.src}
                  alt={selected.copertina.alt || `Copertina del volantino ${selected.titolo}`}
                  label={selected.copertina.label ?? `Copertina volantino ${selected.titolo}`}
                  ratio="210/297"
                  priority
                  sizes="(min-width: 1024px) 288px, (min-width: 640px) 224px, 176px"
                  rounded="rounded-md"
                  className={cn("ring-2", ended ? "opacity-85 ring-brand-blue-100" : "ring-brand-magenta-600")}
                  imgClassName="group-hover:scale-100"
                />
              </a>
              <div>
                <p
                  className={cn(
                    "inline-block rounded-md px-2.5 py-1 text-sm font-extrabold uppercase tracking-wide",
                    ended ? "bg-brand-blue-900 text-white" : "bg-brand-magenta-600 text-white",
                  )}
                >
                  {eyebrow}
                </p>
                <h2 className="mt-3 border-l-[6px] border-brand-magenta-600 pl-3 text-brand-blue-900">{selected.titolo}</h2>
                <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-sand px-3 py-2 text-lg font-extrabold text-brand-blue-900">
                  <Icon name="calendar" size={22} className="text-brand-magenta-700" />
                  <span>{datesLabel(selected)}</span>
                </p>
                <p className="mt-3 flex items-center gap-2 font-semibold text-brand-blue-800">
                  <Icon name="map-pin" size={20} className="shrink-0 text-brand-magenta-700" />
                  {storesLabel(selected, storeNames, ended ? copy.negoziConclusi : copy.negozi)}
                </p>
                <p className="mt-3 max-w-xl text-base text-ink">
                  {ended
                    ? copy.visore.concluso.replace("{date}", datesLabel(selected))
                    : preview
                      ? copy.testoAnteprima.replace("{data}", formatDateIt(selected.validoDal))
                      : copy.testoInCorso}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {selected.pagine.length > 0 && (
                    <Button href="#sfoglia" size="lg" variant={ended ? "secondary" : "primary"} iconRight={<Icon name="arrow-right" size={20} className="rotate-90" />}>
                      {copy.sfoglia}
                    </Button>
                  )}
                  {selected.pdf && (
                    <Button href={selected.pdf} download variant="outline" size="lg" iconLeft={<Icon name="download" size={20} />}>
                      {copy.scaricaPdf}
                      {selected.pdfDimensione ? ` (${selected.pdfDimensione})` : ""}
                    </Button>
                  )}
                  {ended && (
                    <Button variant="ghost" size="lg" onClick={() => setViewingId(null)}>
                      {copy.visore.chiudi}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Container>

          {selected.pagine.length > 0 && (
            <div id="sfoglia" className="mt-7 scroll-mt-28 bg-sand py-6 sm:py-9">
              <Container size="wide">
                <SectionTitle note={copy.visore.istruzioni}>{copy.visore.titolo}</SectionTitle>
                <FlyerViewer key={selected.id} pages={selected.pagine} title={selected.titolo} copy={copy.visore} />
              </Container>
            </div>
          )}
        </section>
      ) : (
        <section aria-label={copy.nessuno.titolo} className="bg-white py-6 sm:py-9">
          <Container size="wide">
            <Notice title={copy.nessuno.titolo} className="max-w-3xl">
              <p>{copy.nessuno.testo}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="font-bold">{copy.nessuno.social}</span>
                <Button href={social.instagram} variant="secondary" size="sm" iconLeft={<Icon name="instagram" size={18} />}>
                  Instagram
                </Button>
                <Button href={social.facebook} variant="secondary" size="sm" iconLeft={<Icon name="facebook" size={18} />}>
                  Facebook
                </Button>
                {whatsappHref && (
                  <Button href={whatsappHref} variant="secondary" size="sm" iconLeft={<Icon name="whatsapp" size={18} />}>
                    WhatsApp
                  </Button>
                )}
              </div>
            </Notice>
          </Container>
        </section>
      )}

      {archived.length > 0 && (
        <section id="archivio" aria-labelledby="archivio-title" className="scroll-mt-28 bg-white py-7 sm:py-10">
          <Container size="wide">
            <SectionTitle id="archivio-title" note={copy.archivio.nota}>{copy.archivio.titolo}</SectionTitle>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {archived.map((f) => (
                <li key={f.id}>
                  <article className="grid h-full grid-cols-[6rem_minmax(0,1fr)] gap-4 rounded-[var(--radius-lg)] border-2 border-brand-blue-100 bg-white p-3">
                    <SmartImage
                      src={f.copertina.src}
                      alt={f.copertina.alt || `Copertina del volantino ${f.titolo}`}
                      label={f.copertina.label ?? `Copertina ${f.titolo}`}
                      ratio="210/297"
                      rounded="rounded-md"
                      className="self-start opacity-85 ring-1 ring-brand-blue-100"
                      sizes="96px"
                    />
                    <div className="flex min-w-0 flex-col">
                      <p className="w-fit rounded-md bg-brand-blue-900 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-white">{copy.archivio.concluso}</p>
                      <h3 className="mt-1.5 !text-lg leading-tight text-brand-blue-900">{f.titolo}</h3>
                      <p className="mt-1 text-sm font-semibold text-ink">{datesLabel(f)}</p>
                      <p className="text-sm text-muted">{storesLabel(f, storeNames, copy.negoziConclusi)}</p>
                      <div className="mt-auto flex flex-wrap gap-x-4 pt-2">
                        {f.pagine.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setViewingId(f.id)}
                            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-extrabold text-brand-blue-700 underline-offset-4 hover:underline"
                          >
                            {copy.archivio.sfoglia}
                            <Icon name="arrow-right" size={16} />
                          </button>
                        )}
                        {f.pdf && (
                          <a href={f.pdf} download className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-brand-blue-700 underline-offset-4 hover:underline">
                            <Icon name="download" size={16} /> {copy.scaricaPdf}
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
