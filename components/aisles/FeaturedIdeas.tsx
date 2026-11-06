import { SectionTitle } from "@/components/sections/SectionTitle";
import { IdeaCard, type IdeaItem } from "./IdeaCard";

type FeaturedIdeasProps = {
  items: IdeaItem[];
  title: string;
  subtitle?: string;
};

/** Griglia responsive (1/2/3 colonne) di IdeaCard. Pensata anche per i prodotti dello shop. */
export function FeaturedIdeas({ items, title, subtitle }: FeaturedIdeasProps) {
  if (items.length === 0) return null;
  return (
    <div>
      <SectionTitle note={subtitle}>{title}</SectionTitle>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {items.map((item) => (
          <li key={item.titolo}>
            <IdeaCard item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
