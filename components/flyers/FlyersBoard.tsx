"use client";

import { useEffect, useRef, useState } from "react";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Notice } from "@/components/ui/Notice";
import { SmartImage } from "@/components/ui/SmartImage";
import { archivedFlyers, currentFlyers, featuredFlyer, formatDateIt, formatDateRangeIt, isFlyerUpcoming, upcomingFlyers } from "@/lib/flyers";
import { useToday } from "@/lib/date-store";
import { scrollBehavior } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Flyer, ImageRef, PagesCopy } from "@/lib/content/schemas";
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
 * Miniature del volantino sotto 1024 px: striscia orizzontale (scorrimento a scatti), la pagina aperta e' cerchiata di
 * magenta e la striscia la tiene sempre in vista quando si gira pagina dal lettore. Copertine piccole (56 px), lazy.
 */
function MobileThumbs({ pages, page, onPage, label, pageLabel, goLabel }: { pages: ImageRef[]; page: number; onPage: (n: number) => void; label: string; pageLabel: string; goLabel: string }) {
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const list = ref.current;
    const item = list?.children[page] as HTMLElement | undefined;
    if (!list || !item) return;
    const left = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: scrollBehavior() });
  }, [page]);
  return (
    <div className="mt-5 lg:hidden">
      <p className="text-xs font-extrabold uppercase tracking-wider text-brand-blue-700">{label}</p>
      <ul ref={ref} aria-label={label} className="hide-scrollbar -mx-5 mt-2 flex snap-x gap-2.5 overflow-x-auto px-5 pb-1 pt-1 sm:-mx-8 sm:px-8">
        {pages.map((p, i) => (
          <li key={p.src ?? i} className="w-14 shrink-0 snap-center">
            <button
              type="button"
              onClick={() => onPage(i)}
              aria-label={goLabel.replace("{n}", String(i + 1))}
              aria-current={i === page ? "true" : undefined}
              className={cn("block w-full overflow-hidden rounded-md bg-white ring-2 transition", i === page ? "ring-brand-magenta-600 shadow-lift" : "ring-brand-blue-100")}
            >
              <SmartImage src={p.src} alt="" label={p.label ?? pageLabel.replace("{n}", String(i + 1))} ratio="210/297" sizes="56px" rounded="rounded-none" imgClassName="group-hover:scale-100" />
              <span className={cn("block py-0.5 text-center text-[0.6875rem] font-bold", i === page ? "bg-brand-magenta-600 text-white" : "text-brand-blue-800")}>{i + 1}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Volantino da sfogliare: in corso, anteprima o ultima edizione ufficiale, sempre con le date originali. */
export function FlyersBoard({ flyers, buildDate, storeNames, social, whatsappHref, copy }: FlyersBoardProps) {
  const today = useToday(buildDate);
  const current = currentFlyers(flyers, today);
  const upcoming = upcomingFlyers(flyers, today);
  const featured = current.length === 0 && upcoming.length === 0 ? featuredFlyer(flyers, today) : null;
  const available = [...current, ...upcoming, ...(featured ? [featured] : [])];
  const archived = archivedFlyers(flyers, today).filter((f) => f.id !== featured?.id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  // Pagina del lettore guidata dalle miniature (desktop); torna alla prima a ogni cambio di volantino.
  const [pageState, setPageState] = useState<{ id: string; n: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const viewing = archived.find((f) => f.id === viewingId) ?? null;
  const selected = viewing ?? available.find((f) => f.id === selectedId) ?? available[0] ?? null;
  const ended = Boolean(viewing);
  const latest = Boolean(!ended && selected && selected.id === featured?.id);
  const preview = Boolean(selected && !ended && isFlyerUpcoming(selected, today));

  useEffect(() => {
    if (viewingId) panelRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }, [viewingId]);

  const eyebrow = ended ? copy.archivio.concluso : latest ? copy.ultimo : preview ? copy.anteprima : copy.inCorso;
  const page = selected && pageState?.id === selected.id ? pageState.n : 0;
  const setPage = (n: number) => selected && setPageState({ id: selected.id, n });

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
              className="grid scroll-mt-4 gap-5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[22rem_minmax(0,1fr)_18rem] lg:items-center lg:gap-12 xl:grid-cols-[24rem_minmax(0,1fr)_20rem]"
            >
              <a href="#sfoglia" aria-label={`${copy.sfoglia}: ${selected.titolo}`} className="group relative mx-auto block w-44 sm:w-full lg:transition-transform lg:duration-500 lg:hover:-rotate-2 lg:hover:scale-[1.02]">
                <SmartImage
                  src={selected.copertina.src}
                  alt={selected.copertina.alt || `Copertina del volantino ${selected.titolo}`}
                  label={selected.copertina.label ?? `Copertina volantino ${selected.titolo}`}
                  ratio="210/297"
                  priority
                  sizes="(min-width: 1280px) 384px, (min-width: 1024px) 352px, (min-width: 640px) 224px, 176px"
                  rounded="rounded-md"
                  className={cn("ring-2 lg:shadow-[0_24px_60px_-18px_rgb(11_42_71/0.45)]", ended ? "opacity-85 ring-brand-blue-100" : "ring-brand-magenta-600")}
                  imgClassName="group-hover:scale-100"
                />
              </a>
              <div>
                <p
                  className={cn(
                    "inline-block rounded-md px-2.5 py-1 text-sm font-extrabold uppercase tracking-wide lg:px-3.5 lg:py-1.5 lg:text-base",
                    ended ? "bg-brand-blue-900 text-white" : "bg-brand-magenta-600 text-white",
                  )}
                >
                  {eyebrow}
                </p>
                <h2 className="mt-3 border-l-[6px] border-brand-magenta-600 pl-3 text-brand-blue-900 lg:mt-4 lg:border-l-8 lg:pl-4 lg:!text-[clamp(2.75rem,3.6vw,4.25rem)] lg:!font-black lg:!leading-[0.98]">{selected.titolo}</h2>
                {/* Sotto 1024 px: «In breve» come su desktop, al posto delle righe di date e negozi (niente doppioni). */}
                {copy.scheda && (
                  <dl className="mt-4 flex items-stretch gap-4 rounded-[var(--radius-lg)] border border-brand-blue-100 bg-sand p-4 lg:hidden">
                    {selected.pagine.length > 0 && (
                      <div className="flex shrink-0 flex-col-reverse justify-center border-r border-brand-blue-100 pr-4 text-center">
                        <dt className="mt-1 text-xs font-semibold text-muted">{copy.scheda.pagine}</dt>
                        <dd className="text-4xl font-black leading-none text-brand-magenta-600">{selected.pagine.length}</dd>
                      </div>
                    )}
                    <div className="flex min-w-0 flex-col justify-center gap-2.5">
                      <div>
                        <dt className="text-xs font-semibold text-muted">{copy.scheda.validita}</dt>
                        <dd className="font-extrabold leading-snug text-brand-blue-900">{datesLabel(selected)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold text-muted">{copy.scheda.negozi}</dt>
                        <dd className="font-extrabold leading-snug text-brand-blue-900">{storesLabel(selected, storeNames, ended ? copy.negoziConclusi : copy.negozi)}</dd>
                      </div>
                    </div>
                  </dl>
                )}
                <p className={cn("mt-4 inline-flex items-center gap-2 rounded-md bg-sand px-3 py-2 text-lg font-extrabold text-brand-blue-900 lg:mt-6 lg:px-4 lg:py-2.5 lg:text-xl", copy.scheda && "max-lg:hidden")}>
                  <Icon name="calendar" size={22} className="text-brand-magenta-700" />
                  <span>{datesLabel(selected)}</span>
                </p>
                <p className={cn("mt-3 flex items-center gap-2 font-semibold text-brand-blue-800", copy.scheda && "max-lg:hidden")}>
                  <Icon name="map-pin" size={20} className="shrink-0 text-brand-magenta-700" />
                  {storesLabel(selected, storeNames, ended ? copy.negoziConclusi : copy.negozi)}
                </p>
                <p className="mt-3 max-w-xl text-base text-ink">
                  {ended
                    ? copy.visore.concluso.replace("{date}", datesLabel(selected))
                    : latest
                      ? copy.testoUltimo
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
              {/* Desktop: scheda con i dati veri dell'edizione (pagine, date, negozi, PDF), nessun dato inventato. */}
              {copy.scheda && (
                <div className="hidden self-stretch rounded-[var(--radius-xl)] border border-brand-blue-100 bg-sand p-7 lg:flex lg:flex-col lg:justify-center">
                  <p className="text-sm font-extrabold uppercase tracking-wider text-brand-blue-700">{copy.scheda.titolo}</p>
                  <dl className="mt-5 flex flex-col gap-5">
                  {selected.pagine.length > 0 && (
                    <div>
                      <dt className="text-sm font-semibold text-muted">{copy.scheda.pagine}</dt>
                      <dd className="text-5xl font-black leading-none text-brand-magenta-600">{selected.pagine.length}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-semibold text-muted">{copy.scheda.validita}</dt>
                    <dd className="text-lg font-extrabold leading-snug text-brand-blue-900">{datesLabel(selected)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-muted">{copy.scheda.negozi}</dt>
                    <dd className="text-lg font-extrabold leading-snug text-brand-blue-900">{storesLabel(selected, storeNames, ended ? copy.negoziConclusi : copy.negozi)}</dd>
                  </div>
                  {selected.pdf && selected.pdfDimensione && (
                    <div>
                      <dt className="text-sm font-semibold text-muted">{copy.scheda.pdf}</dt>
                      <dd className="text-lg font-extrabold leading-snug text-brand-blue-900">{selected.pdfDimensione}</dd>
                    </div>
                  )}
                  </dl>
                </div>
              )}
            </div>
          </Container>

          {selected.pagine.length > 0 && (
            <div id="sfoglia" className="mt-7 scroll-mt-4 bg-sand py-6 sm:py-9 lg:mt-12 lg:py-14">
              {/* Desktop: a sinistra titolo e miniature di tutte le pagine (un clic apre quella pagina), a destra il lettore. */}
              <Container size="wide" className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)] lg:items-start lg:gap-14">
                <div>
                  <SectionTitle note={copy.visore.istruzioni} className="lg:flex-col lg:items-start lg:justify-start lg:gap-3">{copy.visore.titolo}</SectionTitle>
                  {copy.miniature && selected.pagine.length > 1 && (
                    <div className="hidden lg:block">
                      <p className="mt-2 text-sm font-extrabold uppercase tracking-wider text-brand-blue-700">{copy.miniature.titolo}</p>
                      <ul className="mt-3 grid grid-cols-4 gap-4 xl:grid-cols-5">
                        {selected.pagine.map((p, i) => (
                          <li key={p.src ?? i}>
                            <button
                              type="button"
                              onClick={() => setPage(i)}
                              aria-label={copy.miniature!.vaiAllaPagina.replace("{n}", String(i + 1))}
                              aria-current={i === page ? "true" : undefined}
                              className={cn(
                                "group/thumb block w-full overflow-hidden rounded-md bg-white ring-2 transition",
                                i === page ? "ring-brand-magenta-600 shadow-lift" : "ring-brand-blue-100 hover:ring-brand-blue-600",
                              )}
                            >
                              <SmartImage src={p.src} alt="" label={p.label ?? copy.visore.pagina.replace("{n}", String(i + 1))} ratio="210/297" sizes="140px" rounded="rounded-none" imgClassName="group-hover:scale-100" />
                              <span className={cn("block py-1 text-center text-xs font-bold", i === page ? "bg-brand-magenta-600 text-white" : "text-brand-blue-800")}>{i + 1}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <FlyerViewer key={selected.id} pages={selected.pagine} title={selected.titolo} copy={copy.visore} index={page} onIndexChange={setPage} className="lg:sticky lg:top-28" mobileDots={!(copy.miniature && selected.pagine.length > 1)} />
                {/* Sotto 1024 px le miniature stanno sotto il lettore, in una striscia da scorrere col dito, al posto dei pallini. */}
                {copy.miniature && selected.pagine.length > 1 && (
                  <MobileThumbs key={`t-${selected.id}`} pages={selected.pagine} page={page} onPage={setPage} label={copy.miniature.titolo} pageLabel={copy.visore.pagina} goLabel={copy.miniature.vaiAllaPagina} />
                )}
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
        <section id="archivio" aria-labelledby="archivio-title" className="scroll-mt-4 bg-white py-7 sm:py-10">
          <Container size="wide">
            <SectionTitle id="archivio-title" note={copy.archivio.nota}>{copy.archivio.titolo}</SectionTitle>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {archived.map((f) => (
                <li key={f.id}>
                  <article className="grid h-full grid-cols-[6rem_minmax(0,1fr)] gap-4 rounded-[var(--radius-lg)] border-2 border-brand-blue-100 bg-white p-3 lg:grid-cols-[8.5rem_minmax(0,1fr)] lg:gap-5 lg:rounded-[var(--radius-xl)] lg:p-5 lg:transition lg:duration-300 lg:hover:-translate-y-1 lg:hover:border-brand-blue-600 lg:hover:shadow-lift">
                    <SmartImage
                      src={f.copertina.src}
                      alt={f.copertina.alt || `Copertina del volantino ${f.titolo}`}
                      label={f.copertina.label ?? `Copertina ${f.titolo}`}
                      ratio="210/297"
                      rounded="rounded-md"
                      className="self-start opacity-85 ring-1 ring-brand-blue-100"
                      sizes="(min-width: 1024px) 136px, 96px"
                    />
                    <div className="flex min-w-0 flex-col">
                      <p className="w-fit rounded-md bg-brand-blue-900 px-2 py-0.5 text-xs font-extrabold uppercase tracking-wide text-white">{copy.archivio.concluso}</p>
                      <h3 className="mt-1.5 !text-lg leading-tight text-brand-blue-900 lg:mt-2.5 lg:!text-2xl lg:!font-black">{f.titolo}</h3>
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
