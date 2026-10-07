import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { PromotionCard } from "./PromotionCard";
import type { Promotion } from "@/lib/content/schemas";

type Props = { promotions: Promotion[]; eyebrow?: string; title: string; subtitle?: string; inverted?: boolean };

/** Griglia di promozioni con reveal a stagger. Non renderizza nulla se la lista e' vuota. */
export function PromotionsGrid({ promotions, eyebrow, title, subtitle, inverted }: Props) {
  if (promotions.length === 0) return null;
  return (
    <div>
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} inverted={inverted} />
      <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((p) => (
          <StaggerItem key={p.id} className="h-full">
            <PromotionCard promo={p} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
