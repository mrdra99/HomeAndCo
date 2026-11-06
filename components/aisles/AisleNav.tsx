import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { cn } from "@/lib/utils";

export type AisleNavItem = { slug: string; label: string };

/** Tutti i reparti sempre a portata: chip scorribili su mobile, a capo da lg. Il reparto corrente e' evidenziato. */
export function AisleNav({ items, current, label }: { items: AisleNavItem[]; current: string; label: string }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label={label} className="border-b border-brand-blue-100 bg-white">
      <Container size="wide">
        <ul className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-2.5 sm:mx-0 sm:px-0 lg:flex-wrap lg:overflow-visible">
          {items.map((a) => {
            const on = a.slug === current;
            return (
              <li key={a.slug} className="shrink-0">
                <Link
                  href={`/corridoi/${a.slug}/`}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-md border-2 px-2.5 text-sm font-bold",
                    on ? "border-brand-blue-600 bg-brand-blue-600 text-white" : "border-brand-blue-100 bg-white text-brand-blue-900 hover:border-brand-blue-600",
                  )}
                >
                  <span className="rounded bg-white p-0.5">
                    <DepartmentIcon name={a.slug} size={22} />
                  </span>
                  {a.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}
