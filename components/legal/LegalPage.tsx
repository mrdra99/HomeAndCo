import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Struttura comune delle pagine legali, con banner "testo provvisorio". */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main id="contenuto">
      <Section tone="cream" containerSize="narrow">
        <div
          role="note"
          className="mb-8 rounded-md border-2 border-brand-magenta-600 bg-brand-magenta-50 p-4 font-semibold text-brand-magenta-800"
        >
          Testo provvisorio: da far validare a un consulente legale o generare con Iubenda prima della pubblicazione.
        </div>
        <SectionHeading as="h1" title={title} subtitle={`Ultimo aggiornamento: ${updated}`} />
        <div className="mt-10 space-y-4 text-ink [&_a]:font-semibold [&_a]:text-brand-blue-700 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:text-brand-blue-900 [&_li]:ml-5 [&_li]:list-disc">
          {children}
        </div>
      </Section>
    </main>
  );
}
