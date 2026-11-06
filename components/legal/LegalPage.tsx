import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Notice } from "@/components/ui/Notice";
import { content } from "@/lib/content";

type LegalPageProps = { title: string; path: string; updated: string; children: ReactNode };

/** Struttura comune delle pagine legali: intestazione compatta con percorso, avviso informativo, testo a colonna di lettura. */
export async function LegalPage({ title, path, updated, children }: LegalPageProps) {
  const pages = await content.getPagesCopy();
  return (
    <>
      <PageHeader
        breadcrumbLabel={pages.breadcrumb.aria}
        breadcrumb={[
          { label: pages.breadcrumb.home, href: "/" },
          { label: title, href: path },
        ]}
        title={title}
        lead={pages.legale.aggiornamento.replace("{data}", updated)}
      />
      <Container size="narrow" className="py-6 sm:py-9">
        <Notice>{pages.legale.avviso}</Notice>
        <div className="mt-6 space-y-4 text-ink [&_a]:font-semibold [&_a]:text-brand-blue-700 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:text-brand-blue-900 [&_li]:ml-5 [&_li]:list-disc">
          {children}
        </div>
      </Container>
    </>
  );
}
