import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Settings } from "@/lib/content/schemas";
import { CookiePreferencesLink } from "@/components/consent/CookiePreferencesLink";

const linkCls = "inline-flex min-h-11 items-center rounded text-white underline-offset-4 hover:text-white focus-visible:outline-white hover:underline";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="mx-3 mb-[1cm] mt-8 rounded-2xl bg-brand-blue-600 py-3 text-xs text-white sm:mx-6 sm:rounded-3xl">
      <Container size="wide" className="flex flex-col gap-x-8 gap-y-1 lg:flex-row lg:items-center lg:justify-between">
        <p className="py-2 text-white">© {new Date().getFullYear()} {settings.societa.ragioneSociale} · P.IVA {settings.societa.piva}</p>
        <nav aria-label="Informazioni e privacy">
          <ul className="flex flex-wrap gap-x-5">
            <li><Link href="/dove-siamo/" className={linkCls}>Negozi</Link></li>
            <li><Link href="/contatti/" className={linkCls}>Contatti</Link></li>
            <li><a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className={linkCls}>Instagram</a></li>
            <li><Link href="/privacy-policy/" className={linkCls}>Privacy</Link></li>
            <li><Link href="/cookie-policy/" className={linkCls}>Cookie</Link></li>
            <li><CookiePreferencesLink className={linkCls} /></li>
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
