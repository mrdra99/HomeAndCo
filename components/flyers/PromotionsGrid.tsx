"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section, type SectionTone } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { PromotionCard } from "./PromotionCard";
import type { Promotion } from "@/lib/content/schemas";
import { useToday } from "@/lib/date-store";
import { toIsoDate } from "@/lib/campaigns";

type Props = { promotions: Promotion[]; buildDate: string; tone?: SectionTone; eyebrow?: string; title: string; subtitle?: string; inverted?: boolean };

/** Griglia di promozioni con reveal a stagger. Non renderizza nulla se la lista e' vuota. */
export function PromotionsGrid({ promotions, buildDate, tone = "cream", eyebrow, title, subtitle, inverted }: Props) {
  const today = toIsoDate(useToday(buildDate));
  const current = promotions.filter((promo) => (!promo.validoDal || promo.validoDal <= today) && (!promo.validoAl || promo.validoAl >= today));
  if (current.length === 0) return null;
  return (
    <Section tone={tone} rounded={tone === "blue"} className={tone === "blue" ? "mx-3 sm:mx-6" : undefined}>
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} inverted={inverted} />
      <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {current.map((p) => (
          <StaggerItem key={p.id} className="h-full">
            <PromotionCard promo={p} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
