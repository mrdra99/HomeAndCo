"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import type { PagesCopy } from "@/lib/content/schemas";

function joinIt(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

/** Desktop: pulsanti piu' grandi della taglia standard, la fascia chiude la pagina. */
const BIG_BUTTON = "lg:min-h-14 lg:px-6 lg:text-xl";

/**
 * Chiusura del reparto: dove sono i negozi e il volantino. Sotto 1024 px: sfondo sfumato con due bagliori fermi, titolo
 * piu' grande con il nome del reparto sfumato e la sottolineatura fucsia, tutto fermo.
 * Desktop (app/globals.css → .cta-band*): titolo molto piu' grande che si rivela da sinistra quando la fascia entra
 * nello schermo, nome del reparto sfumato nei colori del logo con riflesso e sottolineatura fucsia, sfondo con bagliori
 * che si muovono e il cuore del marchio che ruota piano in trasparenza. Niente animazioni con movimento ridotto.
 */
export function AisleStoresCta({ citta, reparto, copy }: { citta: string[]; reparto: string; copy: PagesCopy["corridoi"]["chiusura"] }) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setInView(true);
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Il nome del reparto dentro il titolo («Cerchi il reparto {reparto}?») e' evidenziato.
  const [before, after = ""] = copy.titolo.split("{reparto}");

  return (
    <section
      ref={ref}
      aria-labelledby="reparto-negozi"
      data-inview={inView || undefined}
      className="cta-band on-dark relative isolate overflow-hidden bg-brand-blue-600 py-9 text-white sm:py-10 lg:py-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className="cta-glow cta-glow-1" />
        <span className="cta-glow cta-glow-2" />
        <span className="cta-glow cta-glow-3" />
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG decorativo del marchio */}
        <img src="/brand/symbol.svg" alt="" className="cta-heart" draggable={false} />
      </div>
      <Container size="wide">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-12">
          <div>
            <h2 id="reparto-negozi" className="cta-title !text-[clamp(1.75rem,8vw,2.5rem)] !font-black !leading-[1.05] text-white lg:!text-[clamp(2.75rem,4.4vw,5.25rem)] lg:!leading-[0.98] lg:!tracking-[-0.03em]">
              {/* Nome del reparto evidenziato (app/globals.css → .cta-reparto), sul telefono come su desktop. */}
              {before}
              <span className="cta-reparto">{reparto}{after}</span>
            </h2>
            <p className="cta-fade mt-1 max-w-xl text-white/95 lg:mt-5 lg:max-w-2xl lg:text-xl">{copy.testo.replace("{citta}", joinIt(citta))}</p>
          </div>
          <div className="cta-fade cta-fade-late flex flex-wrap gap-3 lg:shrink-0 lg:flex-col lg:items-stretch">
            <Button href="/dove-siamo/" variant="light" className={BIG_BUTTON} iconLeft={<Icon name="map-pin" size={20} />}>{copy.negozi}</Button>
            <Button href="/offerte/" variant="outline" className={`border-white text-white hover:bg-white/10 ${BIG_BUTTON}`} iconRight={<Icon name="arrow-right" size={20} />}>
              {copy.volantino}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
