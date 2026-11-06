import { Button } from "@/components/ui/Button";
import type { HomeCopy } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

type Props = { copy: HomeCopy["volantino"]; className?: string };

/**
 * Riquadro «Volantino» del tabellone quando NON c'e' un volantino in corso o in arrivo: riquadro neutro con bordo blu,
 * senza copertina (mai quella di un volantino concluso). Con un volantino lo mostra il blocco grande (FlyerHero).
 */
export function FlyerTile({ copy, className }: Props) {
  return (
    <div className={cn("flex flex-col rounded-[var(--radius-xl)] border-2 border-brand-blue-600 bg-white p-4 text-brand-blue-900 sm:p-5", className)}>
      <h2 className="!text-base !font-black uppercase tracking-wide text-brand-blue-900">{copy.titolo}</h2>
      <p className="mt-2 max-w-sm text-base text-ink">{copy.vuoto.testo}</p>
      <Button href="/offerte/#archivio" variant="outline" size="sm" className="mt-3 self-start lg:mt-auto">
        {copy.vuoto.cta}
      </Button>
    </div>
  );
}
