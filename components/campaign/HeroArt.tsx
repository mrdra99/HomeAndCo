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
const CREAM = "var(--color-cream)";
const SAND = "var(--color-sand)";

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

function HalloweenArt() {
  return (
    <>
      <rect width="400" height="500" fill="var(--accent)" />
      <circle cx="300" cy="110" r="64" fill={CREAM} opacity=".92" />
      <circle cx="322" cy="96" r="58" fill="var(--accent)" />
      {/* foglie */}
      <path d="M40 80 C70 40 120 50 130 90 C100 110 60 110 40 80Z" fill={BLUE_L} opacity=".5" />
      <path d="M310 380 C350 330 400 350 400 400 C370 430 330 420 310 380Z" fill={BLUE_L} opacity=".4" />
      {/* zucca */}
      <ellipse cx="130" cy="330" rx="88" ry="78" fill={CREAM} />
      <ellipse cx="85" cy="330" rx="46" ry="76" fill={SAND} />
      <ellipse cx="175" cy="330" rx="46" ry="76" fill={SAND} />
      <ellipse cx="130" cy="330" rx="34" ry="78" fill={CREAM} />
      <rect x="122" y="240" width="16" height="30" rx="6" fill={BLUE} />
      <path d="M138 250 q26-24 44-6" fill="none" stroke={BLUE} strokeWidth="6" strokeLinecap="round" />
      <path d="M92 312 l22 14 -26 6Z M168 312 l-22 14 26 6Z" fill="var(--accent)" />
      <path d="M96 362 q34 32 68 0 q-14 10-34 8 q-20 2-34-8Z" fill="var(--accent)" />
      {/* piccolo fantasma */}
      <path d="M260 450 V330 a45 45 0 0 1 90 0 V450 l-15-14 -15 14 -15-14 -15 14 -15-14Z" fill={CREAM} />
      <circle cx="288" cy="338" r="7" fill="var(--accent)" />
      <circle cx="322" cy="338" r="7" fill="var(--accent)" />
      <ellipse cx="305" cy="364" rx="7" ry="9" fill="var(--accent)" />
      {/* pipistrello */}
      <path d="M150 140 q20-30 50-8 q30-22 50 8 q-18-6-30 6 q-8-10-20 0 q-12-10-20 0 q-12-12-30-6Z" fill={MAG_L} opacity=".85" />
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
