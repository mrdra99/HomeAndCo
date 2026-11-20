"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { HeroArt } from "@/components/campaign/HeroArt";
import { useActiveCampaign } from "@/components/campaign/useActiveCampaign";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { campaignPeriod, toIsoDate } from "@/lib/campaigns";
import type { Campaign, HomeCopy, ImageRef } from "@/lib/content/schemas";
import { useToday } from "@/lib/date-store";
import { formatDateRangeIt } from "@/lib/flyers";
import { REDUCED_MOTION_QUERY, useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const INTERVAL = 7000;

type Props = {
  campaigns: Campaign[];
  buildCampaignId: string;
  buildDate: string;
  copy: HomeCopy["banner"];
  /** h1 quando il banner apre la pagina; h2 se il titolo principale e' altrove (volantino in primo piano). */
  headingLevel: "h1" | "h2";
};

type Slide = {
  key: string;
  immagine: ImageRef;
  /** Illustrazione di ripiego della campagna quando manca la foto. */
  tema?: string;
  titolo?: string;
  testo?: string;
  etichetta?: string | null;
  credito?: string;
  cta?: { label: string; href: string };
  ctaSecondaria?: { label: string; href: string };
  link?: string;
};

/**
 * Banner della home da bordo a bordo, solo desktop (rapporto 3:1, come le grafiche richieste: 3840 x 1280 px).
 * Prima slide: la campagna attiva per data (la sua grafica `bannerDesktop` o, in mancanza, la foto con titolo sopra);
 * poi le slide di content/home.json → banner. Dissolvenza tra le slide, cambio ogni 7 s; si ferma al passaggio del
 * mouse, al focus, con il pulsante di pausa e, con movimento ridotto, non parte da solo. Sotto 1024 px resta CampaignHero.
 */
export function HomeBanner({ campaigns, buildCampaignId, buildDate, copy, headingLevel }: Props) {
  const campaign = useActiveCampaign(campaigns, buildCampaignId);
  const period = campaignPeriod(campaign, toIsoDate(useToday(buildDate)));
  const reduced = useMediaQuery(REDUCED_MOTION_QUERY);

  const campaignSlide: Slide = campaign.bannerDesktop
    ? { key: `campagna-${campaign.id}`, immagine: campaign.bannerDesktop, link: campaign.cta.href }
    : {
        key: `campagna-${campaign.id}`,
        immagine: campaign.immagineHero,
        tema: campaign.tema,
        titolo: campaign.titolo,
        etichetta: period.inizio && period.fine ? formatDateRangeIt(period.inizio, period.fine) : campaign.etichetta,
        credito: campaign.immagineHero.credito,
        cta: campaign.cta,
        ctaSecondaria: campaign.ctaSecondaria,
      };
  const slides: Slide[] = [
    campaignSlide,
    ...copy.slide.map((s, i) => ({ key: `slide-${i}`, immagine: s.immagine, titolo: s.titolo, testo: s.testo, etichetta: s.etichetta, cta: s.cta, link: s.link })),
  ];
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Pausa solo per chi naviga da tastiera dentro il banner: col mouse lo scorrimento non si ferma mai da solo
  // (prima si fermava al passaggio del mouse e, dopo un clic su una freccia, restava fermo col focus sulla freccia).
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLElement>(null);
  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  // Fermo quando il banner e' fuori dallo schermo o la scheda non e' visibile.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && !document.hidden), { threshold: 0.2 });
    io.observe(el);
    const onVisibility = () => setVisible(!document.hidden && el.getBoundingClientRect().bottom > 0);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const running = count > 1 && !paused && !keyboardFocus && !reduced && visible;
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(id);
  }, [running, index, go]);

  const Heading = headingLevel;

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={copy.aria}
      data-home-banner
      className="on-dark relative hidden aspect-[3/1] w-full overflow-hidden bg-brand-blue-900 text-white lg:block"
      onFocus={(e) => setKeyboardFocus((e.target as HTMLElement).matches(":focus-visible"))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setKeyboardFocus(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        const media = slide.immagine.src || !slide.tema ? (
          <SmartImage
            src={slide.immagine.src}
            alt={slide.titolo ? "" : slide.immagine.alt}
            label={slide.immagine.label ?? "Grafica del banner"}
            sizes="100vw"
            position={slide.immagine.position}
            rounded="rounded-none"
            className="h-full"
            imgClassName={cn(
              "transition-transform duration-[7000ms] ease-out group-hover:scale-100 motion-reduce:transition-none",
              active ? "scale-[1.06] motion-reduce:scale-100" : "scale-100",
            )}
          />
        ) : (
          <HeroArt tema={slide.tema} className="h-full w-full" />
        );
        return (
          <div
            key={slide.key}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
            aria-hidden={!active}
            inert={!active}
            className={cn("absolute inset-0 transition-opacity duration-700 ease-out", active ? "z-10 opacity-100" : "z-0 opacity-0")}
          >
            {slide.titolo ? (
              <>
                <div className="absolute inset-0 -z-20">{media}</div>
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(3_15_27/0.86),rgb(3_15_27/0.5)_38%,rgb(3_15_27/0.05)_72%)]" />
                {slide.credito && <span className="absolute bottom-3 right-4 rounded bg-brand-blue-900/90 px-2 py-0.5 text-[11px] text-white/90">{slide.credito}</span>}
                {/* Rientro sinistro: mai meno di 6 rem, cosi' la freccia laterale non tocca il titolo; da 1440 px allineato al logo. */}
                <div className="flex h-full w-full items-center pr-24 [padding-left:max(6.5rem,calc((100vw-80rem)/2+2rem))]">
                  <div key={active ? `on-${index}` : "off"} className={cn("max-w-[56rem]", active && "banner-in")}>
                    {slide.etichetta && <span className="inline-block rounded-md bg-brand-magenta-600 px-3.5 py-2 text-base font-extrabold uppercase tracking-wide xl:text-lg">{slide.etichetta}</span>}
                    <BannerTitle as={i === 0 ? Heading : "h2"} big={i === 0}>{slide.titolo}</BannerTitle>
                    {slide.testo && <p className="mt-4 max-w-[38rem] text-xl leading-snug text-white/90 xl:text-2xl">{slide.testo}</p>}
                    {(slide.cta || slide.ctaSecondaria) && (
                      <div className="mt-7 flex flex-wrap gap-3">
                        {slide.cta && <Button href={slide.cta.href} variant="primary" size="lg">{slide.cta.label}</Button>}
                        {slide.ctaSecondaria && <Button href={slide.ctaSecondaria.href} variant="light" size="lg">{slide.ctaSecondaria.label}</Button>}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : slide.link ? (
              <Link href={slide.link} aria-label={slide.immagine.alt || copy.aria} className="block h-full">
                {media}
              </Link>
            ) : (
              media
            )}
          </div>
        );
      })}

      {count > 1 && (
        <>
          {/* Frecce ai lati, a meta' altezza; pallini e pausa in basso al centro. */}
          <ArrowButton side="left" label={copy.precedente} onClick={() => go(index - 1)} />
          <ArrowButton side="right" label={copy.successivo} onClick={() => go(index + 1)} />
          <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.key}
                type="button"
                aria-label={copy.vaiAllaSlide.replace("{n}", String(i + 1))}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
                className="group/dot flex h-11 items-center px-1"
              >
                <span className={cn("block h-2.5 overflow-hidden rounded-full bg-white/45 transition-all duration-300 group-hover/dot:bg-white/70", i === index ? "w-12" : "w-2.5")}>
                  {i === index && (
                    <span
                      key={`${index}-${running}`}
                      className={cn("block h-full rounded-full bg-white", running ? "banner-progress" : "w-full")}
                      style={running ? { animationDuration: `${INTERVAL}ms` } : undefined}
                    />
                  )}
                </span>
              </button>
            ))}
            <button
              type="button"
              aria-label={paused || reduced ? copy.riprendi : copy.pausa}
              aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
              className="ml-2 flex size-11 items-center justify-center rounded-full bg-brand-blue-900/70 text-white backdrop-blur hover:bg-brand-blue-900"
            >
              {paused || reduced ? <PlayGlyph /> : <PauseGlyph />}
            </button>
          </div>
        </>
      )}
    </section>
  );
}

/** Il titolo della campagna (prima slide) e' il piu' grande della pagina; le altre slide restano un gradino sotto. */
function BannerTitle({ as: Tag, big, children }: { as: "h1" | "h2"; big: boolean; children: ReactNode }) {
  return (
    <Tag
      className={cn(
        "mt-5 !font-black !leading-[0.92] !tracking-[-0.035em] text-white [text-shadow:0_4px_32px_rgb(0_0_0/0.35)]",
        big ? "!text-[clamp(3.75rem,6.2vw,7.75rem)]" : "!text-[clamp(3rem,4.4vw,5.25rem)]",
      )}
    >
      {children}
    </Tag>
  );
}

function ArrowButton({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-20 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-blue-900 shadow-lift hover:bg-white",
        side === "left" ? "left-6" : "right-6",
      )}
    >
      <Icon name="arrow-right" size={26} className={side === "left" ? "rotate-180" : undefined} />
    </button>
  );
}

function PauseGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}
