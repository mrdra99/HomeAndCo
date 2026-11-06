import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import SiteLayout from "./(site)/layout";

export const metadata: Metadata = {
  title: "Pagina non trovata",
  robots: { index: false, follow: false },
};

/** 404 in italiano, dentro la stessa testata e lo stesso piede del sito. */
export default function NotFound() {
  return (
    <SiteLayout>
      <section className="bg-white py-10 sm:py-16">
        <Container size="wide">
          <p className="text-sm font-extrabold uppercase tracking-wide text-brand-magenta-700">Errore 404</p>
          <h1 className="mt-2 border-l-[6px] border-brand-magenta-600 pl-3 text-brand-blue-900">Pagina non trovata</h1>
          <p className="mt-4 max-w-xl text-lg text-ink">
            L’indirizzo che hai aperto non esiste, oppure la pagina è stata spostata. Da qui puoi andare ai reparti, al volantino o agli orari dei negozi.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/" size="lg">Torna alla home</Button>
            <Button href="/#corridoi" size="lg" variant="secondary">Vedi i reparti</Button>
            <Button href="/offerte/" size="lg" variant="outline">Volantino</Button>
            <Button href="/dove-siamo/" size="lg" variant="outline">Negozi e orari</Button>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
