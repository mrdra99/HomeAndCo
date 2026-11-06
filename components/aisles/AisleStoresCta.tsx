import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import type { PagesCopy } from "@/lib/content/schemas";

function joinIt(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

/** Chiusura del reparto: dove sono i negozi e il volantino. Fascia blu a tutta larghezza, una riga. */
export function AisleStoresCta({ citta, reparto, copy }: { citta: string[]; reparto: string; copy: PagesCopy["corridoi"]["chiusura"] }) {
  return (
    <section aria-labelledby="reparto-negozi" className="on-dark bg-brand-blue-600 py-6 text-white sm:py-8">
      <Container size="wide">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="reparto-negozi" className="!text-2xl !font-black text-white">{copy.titolo.replace("{reparto}", reparto)}</h2>
            <p className="mt-1 max-w-xl text-white/95">{copy.testo.replace("{citta}", joinIt(citta))}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/dove-siamo/" variant="light" iconLeft={<Icon name="map-pin" size={20} />}>{copy.negozi}</Button>
            <Button href="/offerte/" variant="outline" className="border-white text-white hover:bg-white/10" iconRight={<Icon name="arrow-right" size={20} />}>
              {copy.volantino}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
