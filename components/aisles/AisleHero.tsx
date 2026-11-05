import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo";
import type { ImageRef } from "@/lib/content/schemas";
import { AisleArt } from "./AisleArt";
import { Button } from "@/components/ui/Button";

export type BreadcrumbItem = { label: string; href: string };

type AisleHeroProps = {
  titolo: string;
  descrizione: string;
  immagine: ImageRef;
  dettaglio?: ImageRef;
  /** Nome icona dal dato del corridoio (se sconosciuto non viene mostrata). */
  icona?: string;
  /** Colore del corridoio (usato solo come tinta tenue dietro l'icona). */
  colore?: string;
  /** Percorso: l'ultimo elemento e' la pagina corrente (non cliccabile). */
  breadcrumb: BreadcrumbItem[];
};

/** Hero del corridoio: breadcrumb + JSON-LD, titolo display, descrizione e foto ad arco. */
export function AisleHero({ titolo, descrizione, immagine, dettaglio, icona, colore, breadcrumb }: AisleHeroProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: absoluteUrl(b.href),
    })),
  };
  return (
    <section className="pb-12 pt-8 sm:pb-20 sm:pt-12">
      <JsonLd data={jsonLd} />
      <Container>
        <nav aria-label="Percorso di navigazione" className="mb-8">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-0 text-sm text-muted">
            {breadcrumb.map((b, i) => {
              const last = i === breadcrumb.length - 1;
              return (
                <li key={b.href} className="flex items-center gap-2">
                  {last ? (
                    <span aria-current="page" className="font-semibold text-brand-blue-900">
                      {b.label}
                    </span>
                  ) : (
                    <Link href={b.href} className="-my-2 inline-flex min-h-11 items-center underline-offset-4 hover:text-brand-blue-700 hover:underline">
                      {b.label}
                    </Link>
                  )}
                  {!last && <span aria-hidden>›</span>}
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            {icona && (
              <span
                className="mb-6 inline-flex size-16 items-center justify-center rounded-full text-brand-blue-900"
                style={{ background: `color-mix(in srgb, ${colore ?? "#0B6CB0"} 16%, white)` }}
              >
                <DepartmentIcon name={icona} size={52} />
              </span>
            )}
            <h1 className="text-brand-blue-900">{titolo}</h1>
            <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">{descrizione}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/dove-siamo/">Vieni a scegliere in negozio</Button>
              <Button href="#scaffali" variant="outline">Esplora il reparto</Button>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            {immagine.src ? (
            <div className="relative pb-16 sm:pb-20">
            <SmartImage
              src={immagine.src}
              alt={immagine.alt}
              label={`Foto corridoio ${titolo}`}
              ratio="4/3"
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              rounded="rounded-[var(--radius-xl)]"
              className="shadow-lift"
            />
            {dettaglio?.src && <SmartImage src={dettaglio.src} alt={dettaglio.alt} label="Un dettaglio del reparto" ratio="3/2" sizes="(min-width: 1024px) 260px, 45vw" rounded="rounded-2xl" className="absolute -bottom-1 right-4 !w-[48%] border-4 border-white shadow-lift sm:right-6" />}
            </div>
            ) : (
              <AisleArt icon={icona ?? "cucina"} className="w-full rounded-[var(--radius-xl)]" />
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
