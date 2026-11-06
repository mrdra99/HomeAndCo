"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import type { Flyer, HomeCopy } from "@/lib/content/schemas";
import { homeFlyer } from "@/lib/flyers";
import { useToday } from "@/lib/date-store";

type Props = {
  flyers: Flyer[];
  buildDate: string;
  copy: HomeCopy["volantino"];
};

/**
 * Striscia sottile con il rimando ai volantini precedenti. Il volantino in corso o in arrivo e' gia' nel blocco
 * grande del tabellone (PromoBoard): qui non si ripete. Senza volantino dice che non ce n'e' uno in corso.
 */
export function FlyerBand({ flyers, buildDate, copy }: Props) {
  const today = useToday(buildDate);
  const hasFlyer = homeFlyer(flyers, today) !== null;
  const text = hasFlyer ? copy.archivio : null;
  return (
    <section id="volantino" aria-label={copy.titolo} className="border-y border-brand-blue-100 bg-brand-blue-50">
      <Container size="wide">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-1.5">
          <p className="text-base text-brand-blue-900">
            <span className="font-extrabold">{copy.titolo}</span> · {text ? text.fascia : copy.vuoto.fascia}
          </p>
          <Link href="/offerte/#archivio" className="inline-flex min-h-11 items-center gap-1.5 font-extrabold text-brand-blue-700 underline-offset-4 hover:underline">
            {text ? text.cta : copy.vuoto.ctaFascia}
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
