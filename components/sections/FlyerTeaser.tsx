import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Flyer, Settings } from "@/lib/content/schemas";
import { formatDateRangeIt } from "@/lib/flyers";

type FlyerTeaserProps = {
  /** Volantino corrente (il piu' recente valido) oppure undefined. */
  flyer?: Flyer;
  social: Settings["social"];
};

export function FlyerTeaser({ flyer, social }: FlyerTeaserProps) {
  return (
    <Section tone="cream" containerSize="default" className="!py-10 sm:!py-16">
      <Reveal>
        <Card tone="magenta-soft" flush className="grid items-center gap-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-10">
          <div className="relative mx-auto w-full max-w-[15rem] p-6 sm:max-w-none">
            <div className="rotate-[-3deg] overflow-hidden rounded-md shadow-lift">
              <SmartImage
                src={flyer?.copertina.src}
                alt={flyer?.copertina.alt ?? ""}
                ratio="3/4"
                label={flyer ? `Copertina ${flyer.titolo}` : "Copertina del prossimo volantino"}
                sizes="240px"
                rounded="rounded-none"
              />
            </div>
          </div>
          <div className="p-6 pt-0 sm:p-10 sm:pl-0">
            {flyer ? (
              <>
                <Badge tone="magenta" rotate={-3} className="mb-4">
                  {formatDateRangeIt(flyer.validoDal, flyer.validoAl).replace(/^./, (c) => c.toUpperCase())}
                </Badge>
                <h2 className="text-brand-blue-900">{flyer.titolo}</h2>
                <p className="mt-3 max-w-md text-muted">Il volantino del momento, con tutte le offerte nei nostri negozi.</p>
                <Button href="/offerte/" size="lg" className="mt-6" iconRight={<Icon name="arrow-right" size={20} />}>
                  Sfoglia il volantino
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-brand-blue-900">Il prossimo volantino arriva presto</h2>
                <p className="mt-3 max-w-md text-muted">Seguici sui social per non perdere le nuove offerte.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={social.instagram} variant="secondary" iconLeft={<Icon name="instagram" size={20} />}>
                    Instagram
                  </Button>
                  <Button href={social.facebook} variant="outline" iconLeft={<Icon name="facebook" size={20} />}>
                    Facebook
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
