import { LoyaltyCardMockup } from "@/components/loyalty/LoyaltyCardMockup";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Button } from "@/components/ui/Button";
import { Icon, isIconName } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { LoyaltyProgram } from "@/lib/content/schemas";

export function LoyaltyBlock({ loyalty }: { loyalty: LoyaltyProgram }) {
  return (
    <Section tone="blue" rounded className="mx-3 sm:mx-6" containerSize="wide" id="carta-fedelta">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <SectionHeading
              inverted
              eyebrow="Carta fedeltà"
              title={loyalty.nome}
              subtitle={loyalty.intro}
            />
          </Reveal>
          <Stagger className="mt-8 space-y-4">
            {loyalty.vantaggi.slice(0, 3).map((v) => (
              <StaggerItem key={v.titolo}>
                <div className="flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                    <Icon name={isIconName(v.icona) ? v.icona : "check"} size={26} />
                  </span>
                  <div>
                    <h3 className="text-xl text-white">{v.titolo}</h3>
                    <p className="text-white/85">{v.testo}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/carta-fedelta/" size="lg" iconRight={<Icon name="arrow-right" size={20} />}>
              Scopri la carta
            </Button>
            <Button
              href="/carta-fedelta/#come-richiederla"
              size="lg"
              variant="outline"
              className="!text-white hover:!bg-white/10"
            >
              Chiedila in cassa
            </Button>
          </div>
        </div>
        <Reveal delay={0.1}>
          <LoyaltyCardMockup nome={loyalty.nome} />
        </Reveal>
      </div>
    </Section>
  );
}
