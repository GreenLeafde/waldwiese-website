import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsletter, getNewsletterStats } from "@/lib/newsletters";
import {
  emailDocument,
  wrapEmail,
  type HeaderStyle,
} from "@/lib/newsletter-shell";
import { dbReachable } from "@/lib/db";
import { SITE } from "@/lib/site";
import { DbNotice } from "@/components/admin/db-notice";
import { NewsletterPreview } from "@/components/admin/newsletter-preview";

export const metadata = {
  title: "Newsletter-Auswertung",
  robots: { index: false, follow: false },
};

function rate(part: number, whole: number): string {
  if (whole <= 0) return "–";
  return `${Math.round((part / whole) * 100)} %`;
}

export default async function VersandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!(await dbReachable())) {
    return (
      <div>
        <BackLink />
        <div className="mt-6">
          <DbNotice />
        </div>
      </div>
    );
  }

  const newsletter = await getNewsletter(id);
  if (!newsletter) notFound();

  const stats = await getNewsletterStats(id);

  const previewHtml = wrapEmail(newsletter.html, {
    unsubUrl: `${SITE.url}/api/newsletter/abmelden?token=vorschau`,
    header: newsletter.showHeader
      ? {
          title: newsletter.headerTitle ?? undefined,
          tagline: newsletter.headerTagline ?? undefined,
          style: (newsletter.headerStyle as HeaderStyle | null) ?? undefined,
        }
      : false,
    bare: newsletter.bare,
  });

  // Genau das Dokument, das verschickt wurde — inklusive <html>/<head>, damit
  // der kopierte Code anderswo direkt funktioniert.
  const fullHtml = emailDocument(
    previewHtml,
    newsletter.bare ? { bg: "#2e3d2c" } : undefined,
  );

  const cards = [
    { value: String(newsletter.recipientCount), label: "Empfänger", sub: "" },
    { value: String(stats.opens), label: "Öffnungen", sub: rate(stats.opens, newsletter.recipientCount) },
    { value: String(stats.clicks), label: "Klicks", sub: rate(stats.clicks, newsletter.recipientCount) },
    { value: String(stats.reservationClicks), label: "Reservieren-Klicks", sub: "" },
    { value: String(stats.unsubs), label: "Abmeldungen", sub: rate(stats.unsubs, newsletter.recipientCount) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <BackLink />
        <h1 className="mt-3 text-3xl font-display font-normal text-waldgruen">
          {newsletter.subject}
        </h1>
        <p className="mt-2 text-sm text-waldgruen/55">
          Versendet am {newsletter.sentAtLabel} an {newsletter.recipientCount}{" "}
          Empfänger.
        </p>
      </div>

      {/* KPI-Karten */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl bg-white ring-1 ring-waldgruen/10 px-5 py-5"
          >
            <p className="font-display text-3xl text-waldgruen leading-none">
              {c.value}
            </p>
            <p className="mt-1.5 text-sm text-waldgruen/50">{c.label}</p>
            {c.sub && (
              <p className="mt-0.5 text-xs text-waldgruen/35">{c.sub}</p>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-waldgruen/45 leading-relaxed -mt-3">
        Öffnungen werden über ein Zähl-Pixel erfasst (Mehrfach-Öffnungen zählen
        mit; manche Mail-Programme blockieren Bilder, daher eher Richtwert).
        {stats.opens > 0 && stats.firstOpenLabel && (
          <> Zuerst geöffnet: {stats.firstOpenLabel}, zuletzt: {stats.lastOpenLabel}.</>
        )}{" "}
        Echte Tisch-Buchungen laufen über Lightspeed und sind hier nicht messbar
        — gezählt werden Klicks auf den Reservieren-Button.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Geklickte Links */}
        <section>
          <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
            Geklickte Links
          </h2>
          {stats.linkClicks.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-white ring-1 ring-waldgruen/10 px-5 py-8 text-center text-sm text-waldgruen/40">
              Noch keine Klicks erfasst.
            </div>
          ) : (
            <ul className="mt-4 rounded-2xl bg-white ring-1 ring-waldgruen/10 divide-y divide-waldgruen/5 overflow-hidden">
              {stats.linkClicks.map((l) => (
                <li
                  key={l.url}
                  className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
                >
                  <span className="text-waldgruen/80 truncate">
                    {l.url.replace(SITE.url, "") || "/"}
                  </span>
                  <span className="font-display text-waldgruen shrink-0">
                    {l.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Abmelde-Gründe */}
        {stats.reasons.length > 0 && (
          <section>
            <h2 className="text-sm tracking-[0.18em] uppercase text-waldgruen/45 font-medium">
              Abmelde-Gründe
            </h2>
            <ul className="mt-4 rounded-2xl bg-white ring-1 ring-waldgruen/10 divide-y divide-waldgruen/5 overflow-hidden">
              {stats.reasons.map((r) => (
                <li
                  key={r.reason}
                  className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
                >
                  <span className="text-waldgruen/80">{r.reason}</span>
                  <span className="font-display text-waldgruen shrink-0">
                    {r.count}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Vorschau — gerendert oder als HTML-Code zum Kopieren */}
        <NewsletterPreview
          previewHtml={previewHtml}
          fullHtml={fullHtml}
          innerHtml={newsletter.html}
          bare={newsletter.bare}
        />
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin/versand"
      className="text-sm text-waldgruen/55 hover:text-tonwarm transition-colors"
    >
      ← Zurück zur Übersicht
    </Link>
  );
}
