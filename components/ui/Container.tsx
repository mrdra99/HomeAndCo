import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** "wide" per layout ampi (bento), "narrow" per testi. */
  size?: "narrow" | "default" | "wide";
};

const SIZES = { narrow: "max-w-3xl", default: "max-w-6xl", wide: "max-w-7xl" } as const;

export function Container({ as: Tag = "div", size = "default", className, ...rest }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full px-5 sm:px-8", SIZES[size], className)} {...rest} />;
}
