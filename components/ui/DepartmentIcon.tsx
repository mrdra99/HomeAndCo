import Image from "next/image";

const DEPARTMENTS = {
  "casa-e-cucina": "cucina",
  "biancheria-e-arredo": "tessile",
  "pulizia-e-cura-persona": "pulizia",
  "animali": "animali",
  "giardinaggio": "giardino",
  "hobby-cartoleria-auto": "hobby",
} as const;

const DRAWINGS = new Set(["cucina", "tessile", "pulizia", "animali", "giardino", "hobby"]);

/** Decorative, locally served drawings; the adjoining text names the department. */
export function DepartmentIcon({ name, size = 36, className = "" }: { name: string; size?: number; className?: string }) {
  const drawing = DEPARTMENTS[name as keyof typeof DEPARTMENTS] ?? name;
  if (!DRAWINGS.has(drawing)) return null;
  return <Image src={`/brand/departments/${drawing}.svg`} alt="" aria-hidden="true" width={size} height={size} unoptimized className={`shrink-0 ${className}`} />;
}
