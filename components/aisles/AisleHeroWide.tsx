import Link from "next/link";
import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/layout/PageHeader";
import { SmartImage } from "@/components/ui/SmartImage";
import type { ImageRef } from "@/lib/content/schemas";

type AisleHeroWideProps = {
  titolo: string;
  descrizione: string;
  /** Foto larga del reparto (almeno 2880 px: mostrata a tutta larghezza, fino a 1440 px CSS sui 2x). */
  immagine: ImageRef;
  breadcrumb: BreadcrumbItem[];
  breadcrumbLabel: string;
  actions?: ReactNode;
};

/**
 * Testata del reparto solo desktop (feedback del 19/11): foto da bordo a bordo alta circa meta' schermo, titolo grande
 * in orizzontale sopra una velatura blu. Il percorso e' visivo: i dati strutturati del breadcrumb li scrive gia' AisleHero,
 * che resta la testata sotto 1024 px.
 */
export function AisleHeroWide({ titolo, descrizione, immagine, breadcrumb, breadcrumbLabel, actions }: AisleHeroWideProps) {
  // Entrata (app/globals.css → .aisle-hero-*): due bande magenta e blu attraversano la testata e scoprono la foto,
  // che si assesta con uno zoom; il titolo si rivela da sinistra mentre il colore lo attraversa. Solo CSS, una volta
  // per pagina (la pagina monta il componente con key = slug), niente con movimento ridotto.
  return (
    <header className="aisle-hero on-dark relative isolate hidden h-[clamp(26rem,54vh,40rem)] overflow-hidden bg-brand-blue-900 text-white lg:block">
      <span aria-hidden="true" className="aisle-hero-wipe aisle-hero-wipe-1" />
      <span aria-hidden="true" className="aisle-hero-wipe aisle-hero-wipe-2" />
      <div className="aisle-hero-photo absolute inset-0 -z-20">
        <SmartImage
          src={immagine.src}
          alt={immagine.alt}
          label={`Foto reparto ${titolo}`}
          sizes="100vw"
          // Niente priority: un'immagine in caricamento lazy dentro un contenitore nascosto non viene scaricata,
          // cosi' sotto 1024 px la foto larga non costa nulla.
          position={immagine.position}
          rounded="rounded-none"
          className="h-full"
          imgClassName="group-hover:scale-100"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(3_15_27/0.88)_0%,rgb(3_15_27/0.62)_40%,rgb(3_15_27/0.12)_78%),linear-gradient(0deg,rgb(3_15_27/0.55),transparent_45%)]" />
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-8 pb-12 pt-3">
        <nav aria-label={breadcrumbLabel}>
          <ol className="flex flex-wrap items-center gap-x-2 text-sm text-white/80">
            {breadcrumb.map((b, i) => {
              const last = i === breadcrumb.length - 1;
              return (
                <li key={b.href} className="flex items-center gap-2">
                  {last ? (
                    <span aria-current="page" className="font-bold text-white">{b.label}</span>
                  ) : (
                    <Link href={b.href} className="inline-flex min-h-11 items-center font-semibold text-white underline-offset-4 hover:underline">
                      {b.label}
                    </Link>
                  )}
                  {!last && <span aria-hidden="true">›</span>}
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="mt-auto max-w-[60rem]">
          <span aria-hidden="true" className="aisle-hero-bar block h-2 w-24 rounded-full bg-[linear-gradient(90deg,#d11559,#0f6bb4)]" />
          <h1 className="aisle-hero-title mt-5 pb-2 !text-[clamp(3.25rem,5.6vw,6rem)] !font-black !leading-[0.98]">{titolo}</h1>
          <p className="aisle-hero-fade mt-3 max-w-[40rem] text-xl leading-snug text-white/90">{descrizione}</p>
          {actions && <div className="aisle-hero-fade aisle-hero-fade-late mt-7 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
