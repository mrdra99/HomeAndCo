import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Aisle, HomeCopy } from "@/lib/content/schemas";
import { SectionTitle } from "./SectionTitle";

type AisleGridProps = { aisles: Aisle[]; copy: HomeCopy["reparti"] };

/**
 * Due tessere occupano due colonne (la prima e l'ottava) cosi' i 13 reparti riempiono la griglia
 * senza buchi: 14 celle a 2 colonne, 15 a 3 e a 5 colonne. Le foto hanno almeno 1086 px: nessuna
 * tessera le mostra oltre 543 px.
 */
const WIDE = new Set([0, 7]);

export function AisleGrid({ aisles, copy }: AisleGridProps) {
  return (
    <section id="corridoi" aria-labelledby="reparti-title" className="bg-white py-7 sm:py-10">
      <Container size="wide">
        <SectionTitle id="reparti-title" note={copy.descrizione}>{copy.titolo}</SectionTitle>
        <ul className="grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-2 sm:auto-rows-[11rem] sm:grid-cols-3 sm:gap-3 lg:auto-rows-[10.5rem] lg:grid-cols-5">
          {aisles.map((aisle, i) => (
            <li key={aisle.slug} className={i === 0 ? "col-span-2" : WIDE.has(i) ? "sm:col-span-2" : undefined}>
              <Link
                href={`/corridoi/${aisle.slug}/`}
                className="group relative block h-full overflow-hidden rounded-[var(--radius-lg)] bg-brand-blue-900"
              >
                <SmartImage
                  src={aisle.immagine.src}
                  alt=""
                  label={aisle.titoloBreve}
                  position={aisle.immagine.position}
                  sizes={i === 0 ? "(min-width: 1280px) 500px, (min-width: 1024px) 40vw, (min-width: 640px) 66vw, 100vw" : "(min-width: 1280px) 245px, (min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"}
                  rounded="rounded-none"
                  imgClassName="group-hover:scale-100"
                />
                <span className="absolute inset-x-0 bottom-0 flex min-h-11 items-center bg-brand-blue-900 px-3 py-1.5 text-white group-hover:bg-brand-blue-700">
                  <span className="text-sm font-extrabold leading-tight sm:text-base">{aisle.titoloBreve}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
