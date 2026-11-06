"use client";

import { SectionTitle } from "@/components/sections/SectionTitle";
import { Container } from "@/components/ui/Container";
import { PromotionCard } from "./PromotionCard";
import type { Promotion } from "@/lib/content/schemas";
import { useToday } from "@/lib/date-store";
import { toIsoDate } from "@/lib/campaigns";

type Props = { promotions: Promotion[]; buildDate: string; title: string; subtitle?: string; className?: string };

/** Griglia di promozioni attive oggi. Non renderizza nulla se non ce ne sono. */
export function PromotionsGrid({ promotions, buildDate, title, subtitle, className }: Props) {
  const today = toIsoDate(useToday(buildDate));
  const current = promotions.filter((promo) => (!promo.validoDal || promo.validoDal <= today) && (!promo.validoAl || promo.validoAl >= today));
  if (current.length === 0) return null;
  return (
    <section aria-label={title} className={className ?? "bg-sand py-7 sm:py-10"}>
      <Container size="wide">
        <SectionTitle note={subtitle}>{title}</SectionTitle>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {current.map((p) => (
            <li key={p.id}>
              <PromotionCard promo={p} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
