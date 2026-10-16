import Link from "next/link";
import { DepartmentIcon } from "@/components/ui/DepartmentIcon";
import { Container } from "@/components/ui/Container";

export type OtherAisle = { slug: string; titolo: string; icona?: string };

/** Chip di navigazione verso gli altri corridoi: scroll orizzontale con snap su mobile, a capo da sm. */
export function OtherAisles({ aisles }: { aisles: OtherAisle[] }) {
  if (aisles.length === 0) return null;
  return (
    <nav aria-labelledby="altri-corridoi" className="py-12 sm:py-16">
      <Container>
        <h2 id="altri-corridoi" className="text-2xl text-brand-blue-900 sm:text-3xl">
          Gli altri reparti
        </h2>
        <ul className="hide-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 py-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {aisles.map((a) => (
            <li key={a.slug} className="shrink-0 snap-start">
              <Link
                href={`/corridoi/${a.slug}/`}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-white px-5 font-semibold text-brand-blue-900 shadow-soft transition-[transform,box-shadow] duration-200 hover:shadow-lift active:scale-[0.97]"
              >
                {a.icona && <DepartmentIcon name={a.icona} size={32} />}
                {a.titolo}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
