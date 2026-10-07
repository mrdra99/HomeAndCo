import Link from "next/link";
import { Sticker } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { HoverLift } from "@/components/motion/HoverLift";
import { formatDateRangeIt } from "@/lib/flyers";
import type { Promotion } from "@/lib/content/schemas";

/** Card promozione: foto, testo, date (se presenti) e link opzionale su tutta l'area. */
export function PromotionCard({ promo }: { promo: Promotion }) {
  const dates = promo.validoDal && promo.validoAl ? formatDateRangeIt(promo.validoDal, promo.validoAl) : null;
  return (
    <HoverLift className="h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-soft transition-shadow duration-300 group-hover:shadow-lift focus-within:shadow-lift">
        <div className="relative">
          <SmartImage
            src={promo.immagine.src}
            alt={promo.immagine.alt}
            label={promo.immagine.label ?? promo.titolo}
            ratio="16/10"
            rounded="rounded-none"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          {dates && (
            <Sticker tone="accent" rotate={-3} className="absolute left-3 top-3 !text-sm">
              {dates}
            </Sticker>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
          <h3 className="text-xl text-brand-blue-900">
            {promo.link ? (
              <Link href={promo.link} className="after:absolute after:inset-0 after:content-['']">
                {promo.titolo}
              </Link>
            ) : (
              promo.titolo
            )}
          </h3>
          <p className="text-muted">{promo.testo}</p>
          {promo.link && (
            <span aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold text-brand-magenta-700">
              Scopri di più <Icon name="arrow-right" size={18} />
            </span>
          )}
        </div>
      </article>
    </HoverLift>
  );
}
