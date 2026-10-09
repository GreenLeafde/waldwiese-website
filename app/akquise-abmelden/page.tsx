import Link from "next/link";
import { CONTACT } from "@/lib/site";

export const metadata = {
  title: "Keine weitere Nachricht",
  robots: { index: false, follow: false },
  alternates: { canonical: "/akquise-abmelden" },
};

/**
 * Ergebnis der Abmeldung aus einer Akquise-Mail. Gesperrt wird schon beim
 * Klick auf den Link (/api/akquise/abmelden), hier steht nur, ob es geklappt
 * hat. Sie-Form: hier landen Firmenkontakte, keine Gaeste.
 */
export default async function AkquiseAbmeldenPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const ok = status === "ok";

  return (
    <section className="relative isolate bg-waldgruen text-mehlcreme min-h-svh flex items-center">
      <div className="mx-auto max-w-xl px-6 md:px-10 py-32 text-center">
        <p className="eyebrow no-line justify-center text-tonwarm">Wald &amp; Wiese</p>
        <h1 className="mt-7 text-4xl md:text-5xl font-display font-normal leading-tight text-mehlcreme">
          {ok ? "Erledigt." : "Das hat nicht geklappt."}
        </h1>
        <p className="mt-7 text-lg text-mehlcreme/80 leading-relaxed">
          {ok
            ? "Wir haben Sie aus unserer Liste genommen und schreiben Sie nicht wieder an. Entschuldigen Sie die Störung."
            : `Bitte antworten Sie kurz auf unsere Mail oder schreiben Sie an ${CONTACT.email}. Dann nehmen wir Sie von Hand heraus.`}
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
          >
            Zur Website <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
