/**
 * Grafica di ripiego dell'hero quando la campagna non ha ancora una foto.
 * Illustrazioni originali, solo forme semplici, sempre dentro la palette del brand
 * (il tema stagionale usa l'accento via var(--accent)).
 */
type HeroArtProps = { tema: string; className?: string };

const BLUE = "var(--color-brand-blue-600)";
const BLUE_L = "var(--color-brand-blue-100)";
const MAG = "var(--color-brand-magenta-600)";
const MAG_L = "var(--color-brand-magenta-100)";
const MAG_D = "var(--color-brand-magenta-800)";
const CREAM = "var(--color-cream)";
const SAND = "var(--color-sand)";
const BLUE_D = "var(--color-brand-blue-900)";
const INK = "var(--color-ink)";

function DefaultArt() {
  return (
    <>
      <rect width="400" height="500" fill={BLUE_L} />
      <circle cx="310" cy="120" r="90" fill={MAG_L} />
      <circle cx="80" cy="420" r="120" fill={SAND} />
      {/* mensola */}
      <rect x="40" y="330" width="320" height="14" rx="7" fill={BLUE} />
      {/* lampada */}
      <path d="M95 190 L145 190 L160 250 L80 250 Z" fill={MAG} />
      <rect x="117" y="250" width="6" height="62" rx="3" fill={BLUE} />
      <ellipse cx="120" cy="316" rx="26" ry="8" fill={BLUE} />
      {/* tazza */}
      <rect x="205" y="270" width="64" height="60" rx="14" fill={CREAM} />
      <path d="M269 285 q28 0 28 22 t-28 22" fill="none" stroke={CREAM} strokeWidth="9" strokeLinecap="round" />
      <path d="M225 252 q-8-12 0-22 M245 252 q-8-12 0-22" fill="none" stroke={BLUE} strokeWidth="5" strokeLinecap="round" opacity=".6" />
      {/* vaso con pianta */}
      <path d="M300 330 L310 270 H350 L360 330 Z" fill={MAG} />
      <path d="M330 270 C320 230 300 215 288 218 C292 245 306 262 330 270 Z" fill={BLUE} />
      <path d="M330 270 C332 225 350 205 368 206 C366 238 352 258 330 270 Z" fill={BLUE} opacity=".8" />
      {/* piano inferiore: cuscino e libri */}
      <rect x="60" y="400" width="150" height="46" rx="20" fill={MAG} />
      <rect x="240" y="410" width="110" height="14" rx="4" fill={BLUE} />
      <rect x="250" y="424" width="100" height="14" rx="4" fill={CREAM} />
      <rect x="236" y="438" width="114" height="14" rx="4" fill={MAG} />
    </>
  );
}

/** Ala sinistra di pipistrello centrata sul corpo; la destra è la stessa specchiata. */
const BAT_WING = "M-4 4 C-14-8-34-14-58-8 C-50-2-48 6-52 14 C-44 10-36 12-32 20 C-26 12-18 12-12 18 C-10 12-6 8-4 4Z";

function Bat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={INK}>
      <path d={BAT_WING} />
      <path d={BAT_WING} transform="scale(-1 1)" />
      <ellipse cx="0" cy="8" rx="7" ry="11" />
      <path d="M-6 0 L-5-9 L-1-2Z M6 0 L5-9 L1-2Z" />
    </g>
  );
}

/** Stile del volantino Halloween: fondo bianco, onde magenta, macchia blu, niente arancione. */
function HalloweenArt() {
  const legs = [
    "M-8-4 q-12-8-18-2",
    "M-8 0 q-14-2-20 4",
    "M-8 4 q-12 4-16 12",
    "M-7 8 q-6 8-8 16",
  ];
  return (
    <>
      <rect width="400" height="500" fill="#ffffff" />
      {/* onde magenta agli angoli */}
      <path d="M232 0 H400 V256 C386 274 362 266 354 240 C342 200 354 160 320 128 C290 100 246 72 232 0Z" fill={MAG} />
      <path d="M0 296 C34 326 72 360 82 410 C90 452 124 480 172 500 H0Z" fill={MAG} />
      {/* macchia blu */}
      <path d="M78 220 C92 182 132 170 190 172 C250 174 294 168 320 214 C344 256 332 302 302 332 C270 364 200 368 140 360 C92 354 70 332 66 298 C62 266 66 246 78 220Z" fill={BLUE} />
      {/* zucca magenta con il volto illuminato */}
      <g className="hero-art-float-slow">
        <path d="M166 222 C164 208 170 198 182 194" fill="none" stroke={BLUE_D} strokeWidth="9" strokeLinecap="round" />
        <path d="M178 214 q18-18 36-6 q-14 14-36 6Z" fill={BLUE_L} />
        <ellipse cx="126" cy="276" rx="44" ry="52" fill={MAG_D} />
        <ellipse cx="216" cy="276" rx="44" ry="52" fill={MAG_D} />
        <ellipse cx="148" cy="274" rx="40" ry="56" fill={MAG} />
        <ellipse cx="194" cy="274" rx="40" ry="56" fill={MAG} />
        <ellipse cx="171" cy="272" rx="30" ry="57" fill={MAG_D} opacity=".35" />
        <path d="M130 258 l28 2 -15 20Z M212 258 l-28 2 15 20Z" fill="#fdecf3" />
        <path d="M124 294 q47 40 94 0 l-10 4 -6-8 -11 11 -8-9 -12 11 -12-11 -8 9 -11-11 -6 8Z" fill="#fdecf3" />
      </g>
      {/* fantasma che sbuca dalla macchia */}
      <g className="hero-art-sway">
        <path
          d="M292 372 C296 330 288 290 292 258 C296 222 318 200 340 202 C366 204 380 230 378 262 C376 296 384 330 398 362 C388 368 378 360 372 352 C364 366 352 370 342 360 C334 372 318 376 308 364 C302 372 296 374 292 372Z"
          fill="#ffffff" stroke={BLUE} strokeWidth="3" strokeLinejoin="round"
        />
        <path d="M293 298 C282 292 270 294 270 304 C276 314 288 312 294 310" fill="#ffffff" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="324" cy="260" rx="6" ry="8" fill={INK} />
        <ellipse cx="350" cy="264" rx="6" ry="8" fill={INK} />
        <path d="M328 284 q9 9 18 1" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* pipistrelli */}
      <g className="hero-art-float"><Bat x={296} y={164} s={1.1} /></g>
      <Bat x={108} y={432} s={0.7} />
      {/* ragnetto appeso al filo */}
      <g className="hero-art-bob">
        <line x1="56" y1="-20" x2="56" y2="168" stroke={INK} strokeWidth="1.5" />
        <g transform="translate(56 178)" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round">
          {legs.map((d) => <path key={d} d={d} />)}
          {legs.map((d) => <path key={`r${d}`} d={d} transform="scale(-1 1)" />)}
          <circle cx="0" cy="2" r="9" fill={INK} stroke="none" />
          <circle cx="0" cy="-9" r="5" fill={INK} stroke="none" />
        </g>
      </g>
      {/* scintille */}
      <circle cx="236" cy="148" r="4" fill={BLUE} />
      <circle cx="40" cy="250" r="5" fill={MAG_L} />
      <circle cx="372" cy="420" r="6" fill={BLUE_L} />
      <circle cx="232" cy="400" r="4" fill={MAG} />
    </>
  );
}

function NataleArt() {
  const stars = [
    [90, 90, 1],
    [300, 70, 0.7],
    [330, 200, 1.1],
    [60, 230, 0.6],
  ] as const;
  return (
    <>
      <rect width="400" height="500" fill="var(--accent)" />
      {stars.map(([x, y, s], i) => (
        <path
          key={i}
          transform={`translate(${x} ${y}) scale(${s})`}
          d="M0 -28 L8 -9 L28 -7 L13 7 L18 28 L0 17 L-18 28 L-13 7 L-28 -7 L-8 -9Z"
          fill={CREAM}
        />
      ))}
      {/* ghirlanda */}
      <path d="M-10 160 Q200 300 410 160" fill="none" stroke={BLUE} strokeWidth="10" strokeLinecap="round" />
      {[40, 100, 160, 220, 280, 340].map((x, i) => {
        const y = 160 + 0.5 * 140 * (1 - Math.pow((x - 200) / 210, 2)) * 1.0;
        return <circle key={x} cx={x} cy={y + 18} r="16" fill={i % 2 ? CREAM : MAG_L} />;
      })}
      {/* albero stilizzato */}
      <path d="M200 250 L130 360 H270 Z" fill={BLUE} />
      <path d="M200 310 L110 430 H290 Z" fill={BLUE} opacity=".9" />
      <rect x="188" y="430" width="24" height="36" rx="4" fill={SAND} />
      <circle cx="200" cy="244" r="10" fill={CREAM} />
      <circle cx="170" cy="352" r="8" fill={MAG_L} />
      <circle cx="230" cy="402" r="8" fill={CREAM} />
      <circle cx="170" cy="420" r="8" fill={MAG_L} />
      {/* regalo */}
      <rect x="290" y="400" width="80" height="66" rx="8" fill={CREAM} />
      <rect x="323" y="400" width="14" height="66" fill={MAG} />
      <rect x="290" y="426" width="80" height="14" fill={MAG} />
    </>
  );
}

export function HeroArt({ tema, className }: HeroArtProps) {
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
      className={className}
    >
      {tema === "halloween" ? <HalloweenArt /> : tema === "natale" ? <NataleArt /> : <DefaultArt />}
    </svg>
  );
}
