import Link from "next/link";
import { CookiePreferencesLink } from "@/components/consent/CookiePreferencesLink";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import type { NavItem, Settings, Store } from "@/lib/content/schemas";
import { directionsUrl, formatAddress, hoursSummary } from "@/lib/stores";

const linkCls =
  "inline-flex min-h-11 items-center rounded text-white/90 lg:min-h-9 underline-offset-4 hover:text-white hover:underline focus-visible:outline-white";

type FooterProps = {
  settings: Settings;
  stores: Store[];
  /** Voci di content/navigation.json: reparti (/corridoi/...) e link utili. */
  items: NavItem[];
};

/** Footer ricco: reparti, negozi con orari, link utili, social, dati legali. Solo dati ricevuti via props. */
export function Footer({ settings, stores, items }: FooterProps) {
  const copy = settings.piede;
  const reparti = items.filter((i) => i.href.startsWith("/corridoi/"));
  const utili = items.filter((i) => !i.href.startsWith("/corridoi/"));
  const social = [
    { name: "Instagram", href: settings.social.instagram, icon: "instagram" as const },
    { name: "Facebook", href: settings.social.facebook, icon: "facebook" as const },
  ].filter((s) => s.href);
  const headingCls = "mb-2 text-base font-extrabold text-white";

  return (
    <footer className="on-dark mt-10 bg-brand-blue-900 text-sm text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-9 sm:px-8 lg:grid-cols-[1.2fr_1.6fr_1fr] lg:gap-10">
        <section aria-labelledby="footer-reparti">
          <h2 id="footer-reparti" className={headingCls}>{copy.reparti}</h2>
          <ul className="grid grid-cols-1 gap-x-4 min-[420px]:grid-cols-2">
            {reparti.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkCls}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="footer-negozi">
          <h2 id="footer-negozi" className={headingCls}>{copy.negozi}</h2>
          <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {stores.map((store) => {
              const { uniform, rows } = hoursSummary(store);
              return (
                <li key={store.id}>
                  <p className="font-bold text-white">{store.citta}</p>
                  <address className="mt-0.5 not-italic text-white/90">{formatAddress(store)}</address>
                  {uniform ? (
                    <p className="mt-1 text-white/90">{copy.tuttiIGiorni} {uniform.replace("-", "–")}</p>
                  ) : (
                    rows.length > 0 && (
                      <ul className="mt-1 text-white/90">
                        {rows.map((r) => (
                          <li key={r.giorno}>{r.etichettaBreve} {r.testo.replaceAll("-", "–")}</li>
                        ))}
                      </ul>
                    )
                  )}
                  <a
                    href={directionsUrl(store)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkCls} mt-1 gap-1.5 font-bold text-white`}
                  >
                    {copy.indicazioni}
                    <Icon name="external" size={14} />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="grid content-start gap-8 sm:grid-cols-2 lg:grid-cols-1">
          <nav aria-labelledby="footer-utili">
            <h2 id="footer-utili" className={headingCls}>{copy.linkUtili}</h2>
            <ul>
              {utili.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkCls}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <section aria-labelledby="footer-social">
            <h2 id="footer-social" className={headingCls}>{copy.social}</h2>
            <ul className="flex flex-wrap gap-x-5">
              {social.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={`${linkCls} gap-2`}>
                    <Icon name={s.icon} size={18} />
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 text-xs sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-28" variant="white" />
            <p className="text-white/90">
              © {new Date().getFullYear()} {settings.societa.ragioneSociale} · {copy.partitaIva} {settings.societa.piva}
              <br />
              {settings.societa.indirizzo} · {settings.societa.email}
            </p>
          </div>
          <nav aria-label={copy.legale}>
            <ul className="flex flex-wrap gap-x-5">
              <li><Link href="/privacy-policy/" className={linkCls}>{copy.privacy}</Link></li>
              <li><Link href="/cookie-policy/" className={linkCls}>{copy.cookie}</Link></li>
              <li><CookiePreferencesLink className={linkCls}>{copy.preferenzeCookie}</CookiePreferencesLink></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
