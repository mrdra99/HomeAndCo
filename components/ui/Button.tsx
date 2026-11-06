import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "light";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  /** Chiamata commerciale (offerte, volantino): magenta pieno. */
  primary: "bg-brand-magenta-600 text-white hover:bg-brand-magenta-700",
  /** Orientamento (negozi, indicazioni, informazioni): blu pieno. */
  secondary: "bg-brand-blue-600 text-white hover:bg-brand-blue-700",
  ghost: "bg-transparent text-brand-blue-700 hover:bg-brand-blue-50",
  outline: "border-2 border-current bg-transparent text-brand-blue-700 hover:bg-brand-blue-50",
  /** Su fondi pieni blu o magenta. */
  light: "bg-white text-brand-blue-900 hover:bg-brand-blue-50",
};
const SIZES: Record<Size, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-6 text-lg",
};

type Common = {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  children: ReactNode;
};
type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common | "href">;
type AsButton = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common>;
export type ButtonProps = AsLink | AsButton;

/** Next handles page routes; files, downloads and anchors use native browser navigation. */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", iconLeft, iconRight, className, children, ...rest } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md py-2.5 text-center font-bold leading-snug",
    "transition-colors duration-150",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
  const content = (
    <>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </>
  );

  if (typeof rest.href === "string") {
    const { href, ...anchor } = rest as Omit<AsLink, keyof Common>;
    const external = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href);
    const file = anchor.download !== undefined || /^\/(?:uploads|brand|_images)\//.test(href) || /\.pdf(?:[?#]|$)/i.test(href);
    if (external || file || href.startsWith("#")) {
      const isHttp = /^(?:https?:|\/\/)/i.test(href);
      return (
        <a
          href={href}
          className={classes}
          {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...anchor}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        {content}
      </Link>
    );
  }
  const { type = "button", ...button } = rest as Omit<AsButton, keyof Common>;
  return (
    <button type={type} className={classes} {...button}>
      {content}
    </button>
  );
}
