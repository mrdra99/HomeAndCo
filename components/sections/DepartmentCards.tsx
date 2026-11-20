import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import type { HomeCopy } from "@/lib/content/schemas";
import type { DepartmentGroup } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { SectionTitle } from "./SectionTitle";

type Props = { groups: DepartmentGroup[]; copy: HomeCopy["reparti"] };

/**
 * Posto di ogni scheda sulla griglia a 12 colonne da 1024 px: 7 + 5 sulla prima riga, 4 + 4 + 4 sulla seconda.
 * Da 480 a 1023 px due colonne con la prima scheda su tutta la riga (1 + 2 + 2); sotto 480 px una sotto l'altra.
 * L'ordine e' quello di content/navigation.json → gruppi. Cinque gruppi: se cambiano, i posti vanno rivisti.
 */
const SPAN = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];
/** Larghezze delle foto in px CSS (limite in lib/image-rules.ts → DEPARTMENT_CARD_MAX_CSS_WIDTH). */
const SIZES = [
  "(min-width: 1536px) 850px, (min-width: 1024px) 56vw, (min-width: 480px) 100vw, 100vw",
  "(min-width: 1536px) 610px, (min-width: 1024px) 40vw, (min-width: 480px) 50vw, 100vw",
];
const SIZES_SMALL = "(min-width: 1536px) 480px, (min-width: 1024px) 32vw, (min-width: 480px) 50vw, 100vw";

/**
 * «I reparti»: una scheda grande per macro-area (foto, titolo del gruppo, reparti come link di testo su fondo pieno).
 * Ogni reparto resta raggiungibile con un clic. Nessuna icona, nessuna animazione.
 */
export function DepartmentCards({ groups, copy }: Props) {
  return (
    <section id="corridoi" aria-labelledby="reparti-title" className="scroll-mt-24 bg-white lg:bg-transparent py-7 sm:py-10">
      {/* Desktop: sezione piu' larga del resto (fino a 96rem) perche' le schede riempiano lo schermo. */}
      <Container size="wide" className="lg:max-w-[96rem]">
        <SectionTitle id="reparti-title">{copy.titolo}</SectionTitle>
        <ul className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {groups.map((group, i) => (
            <li key={group.titolo} className={cn("flex", i === 0 && "min-[480px]:max-lg:col-span-2", SPAN[i])}>
              <article
                aria-labelledby={`reparti-gruppo-${i}`}
                className="on-dark flex w-full flex-col overflow-hidden rounded-[var(--radius-xl)] bg-brand-blue-900 text-white"
              >
                {/* Desktop: schede piu' alte (feedback del 19/11); la larghezza, e quindi la nitidezza delle foto, non cambia. */}
                <div className={cn("relative min-h-44 flex-1 bg-brand-blue-100", i < 2 ? "lg:min-h-[26rem]" : "lg:min-h-80")}>
                  <SmartImage
                    src={group.immagine.src}
                    alt={group.immagine.alt}
                    label={group.titolo}
                    sizes={SIZES[i] ?? SIZES_SMALL}
                    position={group.immagine.position}
                    rounded="rounded-none"
                    className="absolute inset-0"
                  />
                </div>
                <div className="p-4 sm:p-5 lg:p-6">
                  {/* Desktop: titoli alternati nell'azzurro e nel fucsia del logo (tinte chiare, contrasto in globals.css),
                      cosi' si distinguono dai reparti bianchi sotto. Mobile invariato. */}
                  <h3
                    id={`reparti-gruppo-${i}`}
                    className={cn(
                      "!text-xl !font-black leading-tight text-white lg:!text-[1.75rem]",
                      i % 2 === 0 ? "lg:text-brand-blue-300" : "lg:text-brand-magenta-400",
                    )}
                  >
                    {group.titolo}
                  </h3>
                  <ul className={cn("mt-2 grid gap-x-4", i === 0 && "sm:grid-cols-2")}>
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="-mx-2 flex min-h-11 items-center rounded-md px-2 py-1 text-base font-semibold leading-snug text-white underline-offset-4 hover:bg-white/10 hover:underline lg:text-[1.0625rem]"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
