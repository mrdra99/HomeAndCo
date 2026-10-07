import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import type { Aisle, Settings } from "@/lib/content/schemas";
import { CookiePreferencesLink } from "@/components/consent/CookiePreferencesLink";
import { WhatsAppButton } from "./WhatsAppButton";

type FooterProps = {
  settings: Settings;
  aisles: Pick<Aisle, "slug" | "titoloBreve">[];
};

const linkCls = "rounded text-white/85 underline-offset-4 hover:text-white hover:underline";
const headCls = "mb-4 font-display text-lg text-white";

export function Footer({ settings, aisles }: FooterProps) {
  const { societa, social, whatsapp } = settings;
  return (
    <footer className="on-dark grain grain-light relative mt-8 rounded-t-[var(--radius-xl)] bg-brand-blue-900 pb-8 pt-16 text-white">
      <Container size="wide">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo variant="white" className="text-3xl" />
            <p className="mt-4 max-w-xs font-display text-xl leading-snug text-white/95">{settings.claim}</p>
            <div className="mt-6 flex gap-3">
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Home & Co. su Instagram"
                className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <Icon name="instagram" />
              </a>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Home & Co. su Facebook"
                className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <Icon name="facebook" />
              </a>
            </div>
            <div className="mt-5">
              <WhatsAppButton numero={whatsapp.numero} messaggio={whatsapp.messaggioPredefinito} />
            </div>
          </div>

          <nav aria-label="Corridoi">
            <h2 className={headCls}>Corridoi</h2>
            <ul className="space-y-2.5">
              {aisles.map((a) => (
                <li key={a.slug}>
                  <Link href={`/corridoi/${a.slug}/`} className={linkCls}>
                    {a.titoloBreve}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Informazioni">
            <h2 className={headCls}>Info</h2>
            <ul className="space-y-2.5">
              <li><Link href="/offerte/" className={linkCls}>Offerte e volantini</Link></li>
              <li><Link href="/carta-fedelta/" className={linkCls}>Carta fedeltà</Link></li>
              <li><Link href="/#dove-siamo" className={linkCls}>Dove siamo</Link></li>
              <li><Link href="/contatti/" className={linkCls}>Contatti</Link></li>
            <li><CookiePreferencesLink className={linkCls} /></li>
            </ul>
          </nav>

          <div>
            <h2 className={headCls}>Contatti</h2>
            <address className="space-y-3 not-italic text-white/85">
              <p className="flex gap-3">
                <Icon name="map-pin" className="mt-0.5 shrink-0" size={20} />
                <span>{societa.indirizzo}</span>
              </p>
              <p className="flex gap-3">
                <Icon name="mail" className="mt-0.5 shrink-0" size={20} />
                <a href={`mailto:${societa.email}`} className={linkCls}>{societa.email}</a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-white/75 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {societa.ragioneSociale} · P.IVA {societa.piva} · {societa.indirizzo} ·{" "}
            {societa.email}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/privacy-policy/" className={linkCls}>Privacy</Link></li>
            <li><Link href="/cookie-policy/" className={linkCls}>Cookie</Link></li>
            <li><Link href="/contatti/" className={linkCls}>Contatti</Link></li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
