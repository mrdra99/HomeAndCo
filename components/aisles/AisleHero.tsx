import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import type { ImageRef } from "@/lib/content/schemas";

type AisleHeroProps = {
  titolo: string;
  descrizione: string;
  immagine: ImageRef;
  breadcrumb: BreadcrumbItem[];
  breadcrumbLabel: string;
  actions?: ReactNode;
};

/**
 * Testata del reparto: percorso, titolo, descrizione, foto. Le foto dei reparti sono larghe
 * 1086 px o piu': la foto non supera mai 480 px (limite nitido 543 px), a qualsiasi larghezza di schermo.
 */
export function AisleHero({ titolo, descrizione, immagine, breadcrumb, breadcrumbLabel, actions }: AisleHeroProps) {
  return (
    <header className="border-b border-brand-blue-100 bg-sand">
      <Container size="wide" className="pb-4 pt-1 sm:pb-6">
        <Breadcrumb items={breadcrumb} label={breadcrumbLabel} />
        <div className="mt-1 grid gap-4 md:grid-cols-[minmax(0,1fr)_20rem] md:items-center md:gap-8 lg:grid-cols-[minmax(0,1fr)_30rem] lg:gap-10">
          <div>
            <h1 className="border-l-[6px] border-brand-magenta-600 pl-3 text-brand-blue-900 [font-size:clamp(1.75rem,1.4rem+1.6vw,2.5rem)]">
              {titolo}
            </h1>
            <p className="mt-3 max-w-xl text-base text-ink sm:text-lg">{descrizione}</p>
            {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
          </div>
          <div className="w-full max-w-[30rem]">
            <SmartImage
              src={immagine.src}
              alt={immagine.alt}
              label={`Foto reparto ${titolo}`}
              ratio="16/9"
              priority
              sizes="(min-width: 1024px) 480px, (min-width: 768px) 320px, min(100vw, 480px)"
              rounded="rounded-[var(--radius-lg)]"
              className="border-2 border-white"
              imgClassName="group-hover:scale-100"
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
