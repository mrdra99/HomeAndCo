import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import type { Settings } from "@/lib/content/schemas";
import { CookiePreferencesLink } from "@/components/consent/CookiePreferencesLink";
import { WhatsAppButton } from "./WhatsAppButton";

const linkCls = "inline-flex min-h-11 items-center rounded text-white/85 underline-offset-4 hover:text-white hover:underline";

export function Footer({ settings }: { settings: Settings }) {
  const { societa, social, whatsapp } = settings;
  return (
    <footer className="on-dark grain grain-light relative mt-8 rounded-t-[var(--radius-xl)] bg-brand-blue-900 py-6 text-white sm:py-8">
      <Container size="wide">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <Link href="/" aria-label="Home & Co., vai alla home" className="rounded-lg">
            <Logo variant="white" className="w-36 sm:w-44" />
          </Link>
          <nav aria-label="Informazioni" className="order-3 w-full lg:order-none lg:w-auto">
            <ul className="flex flex-wrap gap-x-5 sm:gap-x-6">
              <li><Link href="/#corridoi" className={linkCls}>Reparti</Link></li>
              <li><Link href="/offerte/" className={linkCls}>Offerte</Link></li>
              <li><Link href="/carta-fedelta/" className={linkCls}>Carta fedeltà</Link></li>
              <li><Link href="/dove-siamo/" className={linkCls}>Negozi</Link></li>
              <li><Link href="/contatti/" className={linkCls}>Contatti</Link></li>
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Home & Co. su Instagram" className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <Icon name="instagram" size={20} />
            </a>
            <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Home & Co. su Facebook" className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <Icon name="facebook" size={20} />
            </a>
          </div>
        </div>

        <address className="mt-3 flex flex-wrap items-center gap-x-6 text-sm not-italic text-white/75">
          <a href={`mailto:${societa.email}`} className={`${linkCls} min-w-0 break-all`}>
            {societa.email}
          </a>
          <span>{societa.indirizzo}</span>
          {whatsapp.numero && <WhatsAppButton numero={whatsapp.numero} messaggio={whatsapp.messaggioPredefinito} />}
        </address>

        <div className="mt-4 flex flex-col gap-x-6 border-t border-white/15 pt-3 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {societa.ragioneSociale} · P.IVA {societa.piva}</p>
          <ul className="flex flex-wrap gap-x-5">
            <li><Link href="/privacy-policy/" className={linkCls}>Privacy</Link></li>
            <li><Link href="/cookie-policy/" className={linkCls}>Cookie</Link></li>
            <li><CookiePreferencesLink className={linkCls} /></li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
