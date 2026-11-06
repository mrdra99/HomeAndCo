import type { SVGProps } from "react";

const PATHS = {
  whatsapp: (
    <>
      <path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.5L3 21Z" />
      <path d="M9 9.5c.5 2 2.5 4 5 5l1.2-1.2-2-1-.8.8c-.8-.4-1.6-1.2-2-2l.8-.8-1-2L9 9.5Z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8.5c0-.3.2-.5.5-.5H14Z" />,
  "map-pin": (
    <>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  "arrow-right": <path d="M5 12h14m-6-6 6 6-6 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="8" r="0.6" fill="currentColor" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  home: <path d="M4 11 12 4l8 7M6 10v9h12v-9M10 19v-5h4v5" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.500" />
      <rect x="13" y="4" width="7" height="7" rx="1.500" />
      <rect x="4" y="13" width="7" height="7" rx="1.500" />
      <rect x="13" y="13" width="7" height="7" rx="1.500" />
    </>
  ),
  flyer: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5M9 13h7M9 17h7" />
    </>
  ),
  store: (
    <>
      <path d="M4 9 5.500 4h13L20 9M4 9v11h16V9M4 9c0 1.700 1.300 2.500 2.700 2.500S9.300 10.700 9.300 9c0 1.700 1.300 2.500 2.700 2.500s2.700-.8 2.700-2.500c0 1.700 1.300 2.500 2.700 2.500S20 10.700 20 9" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.500" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4m8-4v4" />
    </>
  ),
  download: <path d="M12 4v11m-5-4 5 5 5-5M5 20h14" />,
  external: <path d="M14 4h6v6m0-6-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  cucina: (
    <>
      <path d="M5 10h14v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-7Z" />
      <path d="M3 10h18M9 6c0-1.500 1-1.500 1-3M14 6c0-1.500 1-1.500 1-3" />
    </>
  ),
  tessile: (
    <>
      <path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" />
      <circle cx="7" cy="11" r="1.600" />
    </>
  ),
  pulizia: (
    <>
      <path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800L12 3Z" />
      <path d="M19 16v4M17 18h4" />
    </>
  ),
  animali: (
    <>
      <circle cx="7" cy="10" r="1.800" />
      <circle cx="11" cy="6.500" r="1.800" />
      <circle cx="16" cy="7" r="1.800" />
      <circle cx="19" cy="11" r="1.600" />
      <path d="M12 12c-3 0-5.500 3-5 5.500.5 2 3 1.500 5 1.500s4.500.5 5-1.500c.5-2.500-2-5.500-5-5.500Z" />
    </>
  ),
  giardino: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12C12 7.500 8.500 5 4 5c0 4.500 3 7 8 7Z" />
      <path d="M12 14c0-3.500 2.500-6 8-6 0 4-3 6-8 6Z" />
    </>
  ),
  hobby: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.500 0 2-1 1.500-2.200-.6-1.300.2-2.300 1.500-2.300H17a4 4 0 0 0 4-4C21 6.500 17 3 12 3Z" />
      <circle cx="7.500" cy="11" r="1" />
      <circle cx="10" cy="7" r="1" />
      <circle cx="15" cy="7.500" r="1" />
    </>
  ),
  sconto: (
    <>
      <path d="M19 5 5 19" />
      <circle cx="7" cy="7" r="2.500" />
      <circle cx="17" cy="17" r="2.500" />
    </>
  ),
  punti: <path d="m12 3 2.500 5.500 6 .7-4.500 4.100 1.200 6-5.200-3-5.200 3 1.200-6L3.500 9.200l6-.7L12 3Z" />,
  novita: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="2" />
      <path d="M12 9v11M3 9h18M12 9C10 5 6 6 7 9M12 9c2-4 6-3 5 0" />
    </>
  ),
} as const;

export type IconName = keyof typeof PATHS;

/** True se la stringa (es. dai contenuti) e' il nome di un'icona nota. */
export function isIconName(n: string): n is IconName {
  return n in PATHS;
}

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  /** Se presente l'icona e' esposta agli screen reader, altrimenti e' decorativa. */
  title?: string;
};

/** Set minimo di icone inline (stroke currentColor, 24x24). */
export function Icon({ name, size = 24, title, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
