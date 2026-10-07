import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { content } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy policy",
  description: "Informativa sul trattamento dei dati personali di Home & Co. (HCO SRL) ai sensi del Regolamento UE 2016/679.",
  path: "/privacy-policy/",
});

export default async function PrivacyPolicyPage() {
  const { societa } = await content.getSettings();
  return (
    <LegalPage title="Privacy policy" updated="ottobre 2026 (bozza)">
      <p>
        Questa informativa descrive come vengono trattati i dati personali degli utenti che visitano il sito
        home-co.it, ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR).
      </p>

      <h2>Titolare del trattamento</h2>
      <p>
        {societa.ragioneSociale}, {societa.indirizzo}, P.IVA {societa.piva}. Email di contatto:{" "}
        <a href={`mailto:${societa.email}`}>{societa.email}</a>.
      </p>

      <h2>Dati trattati e finalità</h2>
      <ul>
        <li>Dati di navigazione (indirizzo IP, browser, pagine visitate): funzionamento e sicurezza del sito.</li>
        <li>Dati forniti tramite il modulo contatti (nome, email, messaggio): rispondere alle richieste.</li>
        <li>Dati raccolti tramite cookie statistici e di marketing, solo con il tuo consenso: analisi aggregata e comunicazione.</li>
      </ul>

      <h2>Base giuridica</h2>
      <ul>
        <li>Esecuzione di misure precontrattuali o richieste dell&apos;interessato (art. 6.1.b GDPR) per il modulo contatti.</li>
        <li>Legittimo interesse (art. 6.1.f) per la sicurezza e il funzionamento del sito.</li>
        <li>Consenso (art. 6.1.a) per i cookie non tecnici.</li>
      </ul>

      <h2>Conservazione</h2>
      <p>
        I messaggi inviati dal modulo sono conservati per il tempo necessario a rispondere e, in ogni caso, non oltre 24
        mesi. I dati dei cookie seguono le durate indicate nella cookie policy. (provvisorio)
      </p>

      <h2>Destinatari</h2>
      <p>
        I dati possono essere trattati da fornitori che erogano servizi di hosting, posta elettronica e analisi, nominati
        responsabili del trattamento. I dati non sono diffusi. (provvisorio: elenco fornitori da completare)
      </p>

      <h2>Diritti dell&apos;interessato</h2>
      <p>
        Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione scrivendo a{" "}
        <a href={`mailto:${societa.email}`}>{societa.email}</a>. Hai inoltre diritto di proporre reclamo al Garante per la
        protezione dei dati personali (garanteprivacy.it).
      </p>

      <h2>Modifiche</h2>
      <p>Questa informativa può essere aggiornata; la data dell&apos;ultima revisione è indicata in alto.</p>
    </LegalPage>
  );
}
