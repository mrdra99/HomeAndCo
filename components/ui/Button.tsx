import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-magenta-600 text-white hover:bg-brand-magenta-700 shadow-soft",
  secondary: "bg-brand-blue-600 text-white hover:bg-brand-blue-700 shadow-soft",
  ghost: "bg-transparent text-brand-blue-700 hover:bg-brand-blue-50",
  outline: "border-2 border-current bg-transparent text-brand-blue-700 hover:bg-brand-blue-50",
};
const SIZES: Record<Size, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-8 text-lg",
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

/** Pulsante pill. Con `href` interno e' un Link Next; con http/mailto/tel un <a>; senza href un <button>. */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", iconLeft, iconRight, className, children, ...rest } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-none",
    "transition-[background-color,transform,box-shadow] duration-200 active:scale-[0.97]",
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
    if (/^(https?:|mailto:|tel:)/.test(href)) {
      const isHttp = href.startsWith("http");
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
