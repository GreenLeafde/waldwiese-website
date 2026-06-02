import Link from "next/link";
import { ConsentSettingsLink } from "@/components/consent-settings-link";
import { CONTACT, LEGAL_NAV, SITE } from "@/lib/site";

/**
 * Minimaler Kolophon-Footer.
 *
 * Adresse, Telefon, Öffnungszeiten stehen bereits in der Kontakt-Section
 * direkt oberhalb — hier nur Legal, Instagram und Copyright. Schließt
 * nahtlos an die Waldgrün-Kontakt-Section an (kein Farbsprung).
 */
export function SiteFooter() {
  return (
    <footer className="bg-waldgruen text-mehlcreme/70 border-t border-mehlcreme/10">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5 text-[0.78rem] tracking-[0.06em]">
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
    </footer>
  );
}
