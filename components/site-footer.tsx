import Link from "next/link";
import { ConsentSettingsLink } from "@/components/consent-settings-link";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { CONTACT, FOOTER_NAV, LEGAL_NAV, SITE } from "@/lib/site";

/**
 * Footer mit Newsletter-Anmeldeband (oben) + Sitemap-Navigation + Kolophon.
 * Schließt nahtlos an die Waldgrün-Kontakt-Section an (kein Farbsprung).
 */
export function SiteFooter() {
  return (
    <footer className="bg-waldgruen text-mehlcreme/70 border-t border-mehlcreme/10">
      {/* NEWSLETTER-BAND */}
      <div className="border-b border-mehlcreme/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-mehlcreme/[0.06] ring-1 ring-mehlcreme/15 px-7 py-10 md:px-12 md:py-12">
            {/* Botanik-Akzent */}
            <svg
              aria-hidden="true"
              viewBox="0 0 200 200"
              className="pointer-events-none absolute -right-8 -top-10 h-52 w-52 text-tonwarm/20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M100 180 C100 120 100 70 100 30" />
              <path d="M100 150 C70 140 55 120 52 92 C82 96 98 118 100 150 Z" />
              <path d="M100 124 C130 116 146 96 150 70 C120 72 102 94 100 124 Z" />
              <path d="M100 96 C74 90 60 72 58 48 C84 52 98 72 100 96 Z" />
            </svg>

            <div className="relative grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
              <div>
                <p className="eyebrow no-line text-tonwarm">Newsletter</p>
                <h2 className="mt-4 font-display text-3xl md:text-4xl font-normal leading-tight text-mehlcreme">
                  Sei beim Frühstücks-Start dabei.
                </h2>
                <p className="mt-4 max-w-md text-mehlcreme/70 leading-relaxed">
                  Kein Spam — nur eine Mail, wenn&apos;s wirklich was gibt:
                  Frühstücks-Start, neue Karte, besondere Abende auf der Terrasse.
                </p>
              </div>
              <div>
                <NewsletterSignup theme="dark" buttonLabel="Anmelden" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SITEMAP */}
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-14 md:pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {FOOTER_NAV.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[0.65rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-mehlcreme/80 hover:text-tonwarm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* KOLOPHON */}
      <div className="border-t border-mehlcreme/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5 text-[0.78rem] tracking-[0.06em]">
          <p className="font-display italic text-mehlcreme/85 text-base">
            {SITE.name} · {CONTACT.city}
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-tonwarm transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-tonwarm transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <ConsentSettingsLink className="hover:text-tonwarm transition-colors" />
            </li>
          </ul>

          <p className="text-mehlcreme/45">
            © {new Date().getFullYear()} {SITE.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
