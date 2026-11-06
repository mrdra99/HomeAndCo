import { LoyaltyCard } from "@/components/loyalty/LoyaltyCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { HomeCopy, LoyaltyProgram } from "@/lib/content/schemas";
import { isLoyaltyFilled } from "@/lib/loyalty";

/**
 * Riquadro della carta fedelta' in home. Compare solo con fatti reali in content/loyalty.json; finche'
 * non ci sono non rende nulla (nessuna promessa) e la riga e' tutta di video e reel (vedi app/(site)/page.tsx).
 */
export function LoyaltyBlock({ copy, loyalty }: { copy: HomeCopy["carta"]; loyalty: LoyaltyProgram }) {
  if (!isLoyaltyFilled(loyalty)) return null;
  return (
    <section
      id="carta-fedelta"
      aria-labelledby="carta-title"
      className="on-dark flex h-full flex-col justify-center gap-5 rounded-[var(--radius-xl)] bg-brand-blue-600 p-5 text-white sm:flex-row sm:items-center sm:gap-8 sm:p-7 lg:flex-col lg:items-start lg:justify-center lg:gap-6"
    >
      <LoyaltyCard nome={copy.titolo} className="w-48 sm:w-64 sm:shrink-0 lg:w-60" />
      <div>
        <h2 id="carta-title" className="!text-2xl !font-black text-white">{copy.titolo}</h2>
        <p className="mt-2 max-w-sm text-base text-white/95">{loyalty.intro}</p>
        <Button href="/carta-fedelta/" variant="light" size="md" className="mt-4" iconRight={<Icon name="arrow-right" size={20} />}>
          {copy.cta}
        </Button>
      </div>
    </section>
  );
}
