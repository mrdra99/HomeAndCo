import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { CookiePreferencesLink } from "@/components/consent/CookiePreferencesLink";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookie policy",
  description: "Quali cookie usa il sito di Home & Co., a cosa servono e come gestire le tue preferenze.",
  path: "/cookie-policy/",
});

const COOKIES = [
  { nome: "hco-consent (localStorage)", categoria: "Necessario", finalita: "Memorizza le tue scelte sui cookie", durata: "12 mesi (provvisorio)" },
  { nome: "_ga, _ga_* (Google Analytics 4)", categoria: "Statistiche", finalita: "Statistiche aggregate sull'uso del sito", durata: "fino a 13 mesi (provvisorio)" },
  { nome: "_fbp (Meta Pixel)", categoria: "Marketing", finalita: "Misurazione e personalizzazione delle comunicazioni", durata: "3 mesi (provvisorio)" },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie policy" path="/cookie-policy/" updated="ottobre 2026 (bozza)">
      <p>
        Il sito usa cookie e tecnologie simili. I cookie necessari sono sempre attivi; statistiche e marketing si attivano
        solo con il tuo consenso. Oggi nessuno strumento di analisi o marketing è attivo (provvisorio).
      </p>

      <h2>Categorie</h2>
      <ul>
        <li><strong>Necessari:</strong> indispensabili al funzionamento del sito e per ricordare le tue preferenze.</li>
        <li><strong>Statistiche:</strong> ci aiutano a capire come viene usato il sito, in forma aggregata.</li>
        <li><strong>Marketing:</strong> permettono di misurare e migliorare le nostre campagne.</li>
      </ul>

      <h2>Elenco dei cookie</h2>
      <div tabIndex={0} role="region" aria-label="Tabella dei cookie utilizzati" className="overflow-x-auto rounded-md bg-white shadow-soft">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <caption className="sr-only">Elenco dei cookie utilizzati</caption>
          <thead className="bg-brand-blue-50 text-brand-blue-900">
            <tr>
              <th scope="col" className="p-3">Nome</th>
              <th scope="col" className="p-3">Categoria</th>
              <th scope="col" className="p-3">Finalità</th>
              <th scope="col" className="p-3">Durata</th>
            </tr>
          </thead>
          <tbody>
            {COOKIES.map((c) => (
              <tr key={c.nome} className="border-t border-brand-blue-100">
                <th scope="row" className="p-3 font-semibold">{c.nome}</th>
                <td className="p-3">{c.categoria}</td>
                <td className="p-3">{c.finalita}</td>
                <td className="p-3">{c.durata}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Gestisci le tue preferenze</h2>
      <p>Puoi modificare o revocare il consenso in qualsiasi momento.</p>
      <CookiePreferencesLink className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-blue-600 px-6 font-semibold text-white no-underline hover:bg-brand-blue-700">
        Apri le preferenze cookie
      </CookiePreferencesLink>
      <p>
        Puoi anche cancellare i cookie dalle impostazioni del browser. Per altre informazioni sul trattamento dei dati
        leggi l&apos;<Link href="/privacy-policy/">informativa privacy</Link>.
      </p>
    </LegalPage>
  );
}
