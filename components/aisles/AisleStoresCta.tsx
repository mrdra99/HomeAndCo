import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

function joinIt(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

/** Blocco di chiusura: invita a venire in negozio e rimanda a /dove-siamo/ e /offerte/. */
export function AisleStoresCta({ corridoio, citta }: { corridoio: string; citta: string[] }) {
  return (
    <Section tone="blue" rounded className="mx-3 sm:mx-6">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-white">Trovi tutto questo nei nostri negozi</h2>
        <p className="mt-4 text-lg text-white/85">
          Il reparto {corridoio.toLowerCase()} ti aspetta{citta.length > 0 ? ` a ${joinIt(citta)}` : ""}.
          Passa a toccare con mano, scegli con calma e porta a casa l&apos;idea giusta.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button href="/dove-siamo/" size="lg" className="bg-white text-brand-blue-900 hover:bg-white/90" iconLeft={<Icon name="map-pin" size={20} />}>
            Trova il negozio
          </Button>
          <Button href="/offerte/" size="lg" variant="outline" className="text-white hover:bg-white/10" iconRight={<Icon name="arrow-right" size={20} />}>
            Guarda le offerte
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
