type JsonLdProps = { data: unknown };

/** Inietta dati strutturati schema.org (accetta un oggetto o un array). */
export function JsonLd({ data }: JsonLdProps) {
  // "<" escapato per evitare chiusure accidentali del tag script
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
