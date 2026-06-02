import Link from "next/link";
import { ConsentSettingsLink } from "@/components/consent-settings-link";
import { CONTACT, FOOTER_NAV, LEGAL_NAV, SITE } from "@/lib/site";

/**
 * Footer mit Sitemap-Navigation (alle Seiten, gruppiert) + Kolophon-Zeile.
 * Schließt nahtlos an die Waldgrün-Kontakt-Section an (kein Farbsprung).
 */
export function SiteFooter() {
  return (
    <footer className="bg-waldgruen text-mehlcreme/70 border-t border-mehlcreme/10">
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
