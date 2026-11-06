import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = { label: string; href: string };

type BreadcrumbProps = { items: BreadcrumbItem[]; label: string; className?: string };

/** Percorso con dati strutturati. L'ultima voce e' la pagina corrente (non cliccabile). */
export function Breadcrumb({ items, label, className }: BreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.label, item: absoluteUrl(b.href) })),
  };
  return (
    <nav aria-label={label} className={className}>
      <JsonLd data={jsonLd} />
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
        {items.map((b, i) => {
          const last = i === items.length - 1;
          return (
            <li key={b.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="font-bold text-brand-blue-900">{b.label}</span>
              ) : (
                <Link href={b.href} className="inline-flex min-h-11 items-center font-semibold text-brand-blue-700 underline-offset-4 hover:underline">
                  {b.label}
                </Link>
              )}
              {!last && <span aria-hidden="true">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type PageHeaderProps = {
  breadcrumb: BreadcrumbItem[];
  breadcrumbLabel: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Azioni a destra (da md), sotto il testo su mobile. */
  actions?: ReactNode;
  /** Elemento a destra del titolo (foto del reparto). */
  aside?: ReactNode;
  className?: string;
};

/**
 * Intestazione compatta delle pagine interne: percorso, titolo da cartello (barra magenta a sinistra),
 * una riga di introduzione. Mai un hero: sta in 120-180 px.
 */
export function PageHeader({ breadcrumb, breadcrumbLabel, title, lead, actions, aside, className }: PageHeaderProps) {
  return (
    <header className={cn("border-b border-brand-blue-100 bg-sand", className)}>
      <Container size="wide" className="pb-4 pt-1 sm:pb-6">
        <Breadcrumb items={breadcrumb} label={breadcrumbLabel} />
        <div className={cn("mt-1 grid gap-4", aside ? "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10" : "md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8")}>
          <div>
            <h1 className="border-l-[6px] border-brand-magenta-600 pl-3 text-brand-blue-900 [font-size:clamp(1.75rem,1.4rem+1.6vw,2.5rem)]">{title}</h1>
            {lead && <p className="mt-3 max-w-2xl text-base text-ink sm:text-lg">{lead}</p>}
          </div>
          {aside}
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </Container>
    </header>
  );
}
