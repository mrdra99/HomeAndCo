"use client";

import Link from "next/link";
import { StoreCard } from "@/components/stores/StoreCard";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import type { HeaderCopy, HomeCopy, Store } from "@/lib/content/schemas";
import { SectionTitle } from "./SectionTitle";

type Props = { stores: Store[]; copy: HomeCopy["negozi"]; statusCopy: HeaderCopy["negozio"]; neutralPrefix: string };

/** "Dove siamo" (#dove-siamo): tre schede con stato adesso, indirizzo, orari, indicazioni, foto o riquadro con pin (nessuna mappa di terzi in home). */
export function StoresSection({ stores, copy, statusCopy, neutralPrefix }: Props) {
  return (
    <section id="dove-siamo" aria-labelledby="dove-siamo-title" className="bg-white py-7 sm:py-10">
      <Container size="wide">
        <SectionTitle id="dove-siamo-title" note={copy.descrizione}>{copy.titolo}</SectionTitle>
        <ul className="grid gap-3 md:grid-cols-3 md:gap-4">
          {stores.map((store) => (
            <li key={store.id} className="h-full">
              <StoreCard
                store={store}
                copy={{ orari: copy.orari, indicazioni: copy.indicazioni, mappa: copy.mappa }}
                statusCopy={statusCopy}
                neutralPrefix={neutralPrefix}
              />
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link href="/dove-siamo/" className="inline-flex min-h-11 items-center gap-2 font-extrabold text-brand-blue-700 underline-offset-4 hover:underline">
            {copy.tutti}
            <Icon name="arrow-right" size={18} />
          </Link>
        </p>
      </Container>
    </section>
  );
}
