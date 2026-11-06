import { Container } from "@/components/ui/Container";
import { Icon, isIconName } from "@/components/ui/Icon";
import type { HomeCopy } from "@/lib/content/schemas";

/** Fascia fatti: fatti verificati con icona, in una riga su desktop, due colonne su mobile. */
export function FactsStrip({ facts, label }: { facts: HomeCopy["fatti"]; label: string }) {
  return (
    <section aria-label={label} className="border-y border-brand-blue-100 bg-brand-blue-50">
      <Container size="wide" className="px-0 sm:px-8">
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {facts.map((fact, i) => (
            <li
              key={fact.titolo}
              className={`flex items-center gap-3 px-4 py-3 sm:px-5 lg:py-4 ${i % 2 === 1 ? "border-l border-brand-blue-100" : ""} ${i > 1 ? "border-t border-brand-blue-100 lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-brand-blue-100" : ""}`}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand-blue-600 text-white">
                <Icon name={isIconName(fact.icona) ? fact.icona : "check"} size={24} />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-sm font-extrabold text-brand-blue-900 sm:text-base">{fact.titolo}</span>
                <span className="block text-xs text-muted sm:text-sm">{fact.testo}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
