import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { HoverLift } from "@/components/motion/HoverLift";
import type { ImageRef } from "@/lib/content/schemas";

/**
 * Modello generico di card "idea/prodotto". Oggi arriva da Aisle.inEvidenza;
 * domani basta mappare un Product dello shop: { titolo: p.name, descrizione: p.shortDescription,
 * immagine: {src: p.imageUrl, alt: p.name}, badge: p.badge, href: `/shop/prodotto/${p.slug}/` }.
 */
export type IdeaItem = {
  titolo: string;
  descrizione?: string;
  immagine: ImageRef;
  badge?: string;
  badgeTone?: "accent";
  href?: string;
};

/** Card con foto, badge sticker, titolo e testo. Cliccabile in tutta l'area se c'e' `href`. */
export function IdeaCard({ item }: { item: IdeaItem }) {
  return (
    <HoverLift className="h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-soft transition-shadow duration-300 group-hover:shadow-lift focus-within:shadow-lift">
        <div className="relative">
          <SmartImage
            src={item.immagine.src}
            alt={item.immagine.alt}
            fit={item.immagine.fit}
            position={item.immagine.position}
            imgClassName={item.immagine.fit === "contain" ? "bg-white p-7" : undefined}
            label={item.immagine.label ?? item.titolo}
            ratio="4/3"
            rounded="rounded-none"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          {item.badge && (
            <Badge tone={item.badgeTone ?? "magenta"} rotate={-4} className="absolute left-3 top-3">
              {item.badge}
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="text-xl text-brand-blue-900">
            {item.href ? (
              <Link href={item.href} className="after:absolute after:inset-0 after:content-['']">
                {item.titolo}
              </Link>
            ) : (
              item.titolo
            )}
          </h3>
          {item.descrizione && <p className="text-muted">{item.descrizione}</p>}
          {item.href && (
            <span aria-hidden className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold text-brand-magenta-700">
              Scopri <Icon name="arrow-right" size={18} />
            </span>
          )}
        </div>
      </article>
    </HoverLift>
  );
}
