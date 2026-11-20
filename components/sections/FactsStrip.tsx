import { Container } from "@/components/ui/Container";
import { Icon, isIconName } from "@/components/ui/Icon";
import type { HomeCopy } from "@/lib/content/schemas";

/**
 * Fascia fatti: fatti verificati con icona. Mobile: due colonne con tutti i fatti.
 * Desktop: una riga con i soli fatti `desktop` (oggi tre), piu' ariosa e con testo piu' grande.
 */
export function FactsStrip({ facts, label }: { facts: HomeCopy["fatti"]; label: string }) {
  return (
    <section aria-label={label} className="border-y border-brand-blue-100 bg-brand-blue-50">
      <Container size="wide" className="px-0 sm:px-8">
        <ul className="grid grid-cols-2 lg:grid-cols-3">
          {facts.map((fact, i) => (
            <li
              key={fact.titolo}
              className={`flex items-center gap-3 px-4 py-3 sm:px-5 lg:gap-4 lg:px-6 lg:py-7 xl:gap-5 xl:px-8 ${i % 2 === 1 ? "border-l border-brand-blue-100" : ""} ${i > 1 ? "border-t border-brand-blue-100 lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-brand-blue-100" : ""} ${fact.desktop ? "" : "lg:hidden"}`}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand-blue-600 text-white lg:size-16 lg:rounded-[var(--radius-lg)]">
                <Icon name={isIconName(fact.icona) ? fact.icona : "check"} size={24} className="lg:size-8" />
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-sm font-extrabold text-brand-blue-900 sm:text-base lg:text-xl lg:font-black xl:text-[1.375rem]">{fact.titolo}</span>
                <span className="block text-xs text-muted sm:text-sm lg:mt-1 lg:text-base">{fact.testo}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
