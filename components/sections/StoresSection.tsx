import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { StoreCard } from "@/components/stores/StoreCard";
import type { Store } from "@/lib/content/schemas";

/** "Dove siamo" (#dove-siamo): sfondo sand con bordo superiore curvo che sfuma dal cream. */
export function StoresSection({ stores }: { stores: Store[] }) {
  return (
    <section id="dove-siamo" aria-labelledby="dove-siamo-title" className="relative mt-16 bg-sand pb-20 pt-6 sm:pb-28">
      <svg
        aria-hidden
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 h-10 w-full -translate-y-[calc(100%-1px)] text-sand sm:h-16"
      >
        <path d="M0 64 V40 C 240 0 480 0 720 24 C 960 48 1200 48 1440 8 V64 Z" fill="currentColor" />
      </svg>
      <Container size="wide">
        <Reveal>
          <SectionHeading
            as="h2"
            eyebrow="Dove siamo"
            title={
              <span id="dove-siamo-title">
                Vieni a <span className="underline-hand">trovarci</span>
              </span>
            }
            subtitle="Tre negozi in Toscana, sempre pieni di idee per la tua casa."
          />
        </Reveal>
        <Stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((s) => (
            <StaggerItem key={s.id}>
              <StoreCard store={s} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
