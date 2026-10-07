import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { IdeaCard, type IdeaItem } from "./IdeaCard";

type FeaturedIdeasProps = {
  items: IdeaItem[];
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

/** Griglia responsive (1/2/4 colonne) di IdeaCard con reveal a stagger. Pensata anche per i prodotti dello shop. */
export function FeaturedIdeas({ items, eyebrow, title, subtitle }: FeaturedIdeasProps) {
  if (items.length === 0) return null;
  return (
    <div>
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <StaggerItem key={item.titolo} className="h-full">
            <IdeaCard item={item} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
