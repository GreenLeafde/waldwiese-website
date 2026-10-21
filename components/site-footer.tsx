import Link from "next/link";
import { ConsentSettingsLink } from "@/components/consent-settings-link";
import { Logo } from "@/components/logo";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { CONTACT, FOOTER_NAV, LEGAL_NAV, SITE } from "@/lib/site";

/**
 * Fußzeile (Redesign 10/2026) auf Nacht-Grund: Newsletter oben, dann Logo,
 * Zeiten getrennt nach Brunch und Abendessen, Kontakt, darunter die
 * Sitemap (interne Links für alle Seiten) und das Kolophon.
 * Keine Kästen, keine Ornamente — nur feine Linien.
 */
export function SiteFooter() {
  return (
    <footer data-tone="dunkel" className="bg-nacht text-creme">
      {/* NEWSLETTER — id="newsletter": der QR-Code auf dem Aufsteller im
          Restaurant führt auf restaurant-waldwiese.de/#newsletter. */}
      <div id="newsletter" className="scroll-mt-24 border-b border-creme/15">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-2 md:items-center md:gap-12 md:px-10 md:py-16">
          <div>
            <p className="eyebrow no-line">Newsletter</p>
            <h2 className="mt-3 font-display text-3xl font-normal leading-tight md:text-4xl">
              Neue Termine zuerst per Mail.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-creme/75">
              Kein Spam. Eine Mail, wenn es wirklich etwas gibt: neue Abende wie
              Magic Dinner oder Krimidinner, neue Karte, Saisonales.
            </p>
          </div>
          <NewsletterSignup theme="dark" buttonLabel="Eintragen" />
        </div>
      </div>

      {/* MARKE + ZEITEN + KONTAKT */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 pb-4 pt-12 text-sm md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-10 md:pt-14">
        <div>
          <Logo variant="light" height={24} />
          <p className="mt-4 leading-relaxed">
            {CONTACT.street}
            <br />
            {CONTACT.postalCode} {CONTACT.city} bei Regensburg
          </p>
        </div>
        <div>
          <b className="mb-2 block font-semibold">Brunch</b>
          <p className="text-creme/75">Montag bis Sonntag<br />8–14 Uhr</p>
        </div>
        <div>
          <b className="mb-2 block font-semibold">Abendessen</b>
          <p className="text-creme/75">Freitag bis Sonntag<br />17–22 Uhr</p>
        </div>
        <div>
          <b className="mb-2 block font-semibold">Kontakt</b>
          <p className="text-creme/75">
            <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-creme">{CONTACT.phone}</a>
            <br />
            <a href={`mailto:${CONTACT.email}`} className="break-all hover:text-creme">{CONTACT.email}</a>
            <br />
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-creme">
              {CONTACT.instagramHandle}
            </a>
          </p>
        </div>
      </div>

      {/* SITEMAP */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-10 md:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-creme/15 pt-10 md:grid-cols-4">
          {FOOTER_NAV.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-akzent">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-creme/75 transition-colors hover:text-creme">
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
      <div className="border-t border-creme/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-[0.78rem] text-creme/60 md:flex-row md:items-center md:justify-between md:px-10">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-creme">{item.label}</Link>
              </li>
            ))}
            <li>
              <ConsentSettingsLink className="transition-colors hover:text-creme" />
            </li>
          </ul>
          <p>© {new Date().getFullYear()} {SITE.legalName}</p>
        </div>
      </div>
    </footer>
  );
}
