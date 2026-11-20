import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import type { ImageRef } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

type MobileHeroProps = {
  titolo: string;
  descrizione: string;
  /** Foto del reparto (almeno 1086 px) o della pagina: mai mostrata oltre la meta' della sua larghezza. */
  immagine: ImageRef;
  breadcrumb: BreadcrumbItem[];
  breadcrumbLabel: string;
  actions?: ReactNode;
  /** Piu' bassa: per le pagine dove il contenuto principale (es. il volantino) deve arrivare presto sullo schermo. */
  compact?: boolean;
};

/**
 * Testata sotto 1024 px di reparti e volantino: la versione da telefono di WideHero (stessi colori, stesso titolo sfumato).
 * Sotto 544 px: foto a tutta larghezza con velatura blu dal basso e testo sopra (al massimo 543 px CSS: la foto piu'
 * piccola dei reparti e' larga 1086 px). Da 544 a 1023 px: fondo blu, testo a sinistra e foto in un riquadro di 20 rem.
 * Entrata breve (app/globals.css → .mobile-hero-*): bande magenta e blu, foto che si assesta, titolo che si rivela;
 * niente con movimento ridotto. Il percorso porta i dati strutturati (Breadcrumb).
 */
export function MobileHero({ titolo, descrizione, immagine, breadcrumb, breadcrumbLabel, actions, compact }: MobileHeroProps) {
  return (
    <header className="mobile-hero on-dark relative isolate overflow-hidden bg-brand-blue-900 text-white lg:hidden">
      <span aria-hidden="true" className="mobile-hero-wipe mobile-hero-wipe-1" />
      <span aria-hidden="true" className="mobile-hero-wipe mobile-hero-wipe-2" />
      <Container
        size="wide"
        className={cn(
          "flex flex-col pb-6 pt-1 min-[544px]:grid min-[544px]:min-h-0 min-[544px]:grid-cols-[minmax(0,1fr)_20rem] min-[544px]:items-center min-[544px]:gap-8 min-[544px]:pb-8",
          compact ? "min-h-[clamp(15rem,40svh,19rem)]" : "min-h-[clamp(24rem,62svh,30rem)]",
        )}
      >
        {/* Telefono: foto dietro tutta la testata. Tablet: riquadro a destra (seconda colonna). */}
        <div className="mobile-hero-photo absolute inset-0 -z-20 min-[544px]:relative min-[544px]:inset-auto min-[544px]:z-auto min-[544px]:col-start-2 min-[544px]:row-start-1 min-[544px]:aspect-video min-[544px]:overflow-hidden min-[544px]:rounded-[var(--radius-lg)] min-[544px]:shadow-[0_18px_40px_-16px_rgb(0_0_0/0.6)] min-[544px]:ring-2 min-[544px]:ring-white/25">
          <SmartImage
            src={immagine.src}
            alt={immagine.alt}
            label={`Foto ${titolo}`}
            priority
            sizes="(min-width: 544px) 320px, 100vw"
            position={immagine.position}
            rounded="rounded-none"
            className="h-full"
            imgClassName="group-hover:scale-100"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(3_15_27/0.94)_0%,rgb(3_15_27/0.72)_42%,rgb(3_15_27/0.2)_100%)] min-[544px]:hidden" />

        <div className="flex min-w-0 flex-1 flex-col min-[544px]:col-start-1 min-[544px]:row-start-1">
          <Breadcrumb items={breadcrumb} label={breadcrumbLabel} onDark />
          <div className="mt-auto pt-6 min-[544px]:pt-4">
            <span aria-hidden="true" className="mobile-hero-bar block h-1.5 w-16 rounded-full bg-[linear-gradient(90deg,#d11559,#0f6bb4)]" />
            <h1 className="mobile-hero-title hero-title-gradient mt-3 pb-1 !text-[clamp(2.25rem,10vw,3.25rem)] !font-black !leading-[0.98] !tracking-[-0.03em]">{titolo}</h1>
            <p className="mobile-hero-fade mt-2 max-w-xl text-base leading-snug text-white/90">{descrizione}</p>
            {actions && <div className="mobile-hero-fade mobile-hero-fade-late mt-5 flex flex-wrap gap-2">{actions}</div>}
          </div>
        </div>
      </Container>
    </header>
  );
}
