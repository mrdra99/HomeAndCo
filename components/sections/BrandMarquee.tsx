import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import type { Brand } from "@/lib/content/schemas";

function BrandItem({ brand }: { brand: Brand }) {
  const inner = brand.logo.src ? (
    <Image src={brand.logo.src} alt={brand.nome} width={140} height={56} unoptimized={brand.logo.src.endsWith(".svg")} className="h-12 w-auto object-contain" />
  ) : (
    <span className="whitespace-nowrap font-display text-lg text-brand-blue-800">{brand.nome}</span>
  );
  const box = "flex h-16 min-w-36 items-center justify-center rounded-2xl bg-white px-6 shadow-soft";
  return brand.url ? (
    <a href={brand.url} target="_blank" rel="noopener noreferrer" className={box}>
      {inner}
    </a>
  ) : (
    <div className={box}>{inner}</div>
  );
}

/**
 * Striscia lenta dei brand (CSS puro). La lista visibile agli screen reader e' una sola:
 * la copia duplicata che chiude il loop e' aria-hidden e non focalizzabile (inert).
 */
export function BrandMarquee({ brands }: { brands: Brand[] }) {
  brands = brands.filter((brand) => !brand.provvisorio);
  if (brands.length === 0) return null;
  return (
    <section aria-label="Brand" className="bg-cream py-14 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            as="h2"
            align="center"
            eyebrow="Marchi"
            title="I brand che trovi da noi"
          />
        </Reveal>
      </Container>
      <div className="marquee marquee-mask mt-10 overflow-hidden py-2">
        <div className="marquee-track flex">
          <ul className="flex shrink-0 items-center gap-6 pr-6">
            {brands.map((b) => (
              <li key={b.id}>
                <BrandItem brand={b} />
              </li>
            ))}
          </ul>
          <ul aria-hidden inert className="flex shrink-0 items-center gap-6 pr-6">
            {brands.map((b) => (
              <li key={b.id}>
                <BrandItem brand={b} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
