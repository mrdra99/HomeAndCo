import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import type { Brand } from "@/lib/content/schemas";

/** Velocita' costante della striscia, in px al secondo (lenta). */
const SPEED_PX_S = 36;
/** Larghezza media stimata di un logo con il suo spazio (card + gap), in px. */
const ITEM_PX = 176;
/** Ogni meta' della striscia deve coprire almeno questa larghezza (schermi larghi). */
const MIN_HALF_PX = 2400;

function BrandItem({ brand }: { brand: Brand }) {
  const inner = brand.logo.src ? (
    <Image
      src={brand.logo.src}
      alt={brand.nome}
      width={160}
      height={64}
      unoptimized={brand.logo.src.endsWith(".svg")}
      className="h-10 w-auto max-w-32 object-contain sm:h-12 sm:max-w-40"
    />
  ) : (
    <span className="whitespace-nowrap font-display text-base text-brand-blue-800 sm:text-lg">{brand.nome}</span>
  );
  const box =
    "flex h-14 min-w-28 items-center justify-center rounded-2xl bg-white px-4 shadow-soft sm:h-16 sm:min-w-36 sm:px-6";
  return brand.url ? (
    <a
      href={brand.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${box} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-600`}
    >
      {inner}
    </a>
  ) : (
    <div className={box}>{inner}</div>
  );
}

function BrandList({ brands, hidden }: { brands: Brand[]; hidden?: boolean }) {
  return (
    <ul
      {...(hidden ? { "aria-hidden": true, inert: true } : {})}
      className="marquee-list flex shrink-0 items-center gap-4 pr-4 sm:gap-6 sm:pr-6"
    >
      {brands.map((b) => (
        <li key={b.id}>
          <BrandItem brand={b} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Banner dei brand che ruota di continuo (solo CSS, transform su GPU).
 *
 * Direzione "in senso orario", come un rullo visto dall'alto: la faccia davanti scorre da destra
 * verso sinistra (marquee classica).
 * Loop perfetto: la traccia ha due meta' identiche e trasla di -50%. Ogni meta' ripete la lista
 * quanto basta a superare ~2400 px, cosi' con pochi loghi non resta un buco. La durata e' calcolata
 * dal numero di elementi (`--marquee-duration`) per una velocita' costante di circa 36 px/s.
 * Accessibilita': solo la prima lista e' esposta agli screen reader, tutte le copie sono
 * aria-hidden e inert. Con prefers-reduced-motion resta una riga scorrevole a mano, senza copie.
 * `includeDraft` mostra anche i marchi provvisori (solo per la demo del design system).
 */
export function BrandMarquee({ brands: all, includeDraft = false }: { brands: Brand[]; includeDraft?: boolean }) {
  const brands = includeDraft ? all : all.filter((brand) => !brand.provvisorio);
  if (brands.length === 0) return null;
  const repeats = Math.max(1, Math.ceil(MIN_HALF_PX / (brands.length * ITEM_PX)));
  const duration = Math.round((brands.length * repeats * ITEM_PX) / SPEED_PX_S);
  const copies = Array.from({ length: repeats }, (_, i) => i);
  return (
    <section aria-label="Brand" className="overflow-x-clip bg-cream py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading as="h2" align="center" eyebrow="Marchi" title="I brand che trovi da noi" />
        </Reveal>
      </Container>
      <div className="marquee marquee-mask mt-8 max-w-full overflow-hidden py-2 sm:mt-10">
        <div className="marquee-track flex" style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
          <div className="marquee-half flex shrink-0">
            {copies.map((i) => (
              <BrandList key={i} brands={brands} hidden={i > 0} />
            ))}
          </div>
          <div className="marquee-half flex shrink-0" aria-hidden inert>
            {copies.map((i) => (
              <BrandList key={i} brands={brands} hidden />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
