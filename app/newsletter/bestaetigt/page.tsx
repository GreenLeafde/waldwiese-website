import Link from "next/link";
import { BREAKFAST_LAUNCH, CONTACT } from "@/lib/site";

export const metadata = {
  title: "Anmeldung bestätigt",
  description: "Deine Anmeldung für den Frühstücks-Start bei Wald & Wiese.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/newsletter/bestaetigt" },
};

export default async function NewsletterBestaetigtPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const invalid = status === "ungueltig";

  return (
    <section className="relative isolate bg-waldgruen text-mehlcreme min-h-svh flex items-center overflow-hidden">
      <div className="mx-auto max-w-2xl px-6 md:px-10 py-32 text-center reveal">
        <p className="eyebrow no-line justify-center text-tonwarm">
          Frühstücks-Launch
        </p>
        {invalid ? (
          <>
            <h1 className="mt-7 text-4xl md:text-6xl font-display font-normal leading-[1.0] tracking-tight text-mehlcreme">
              Dieser Link ist{" "}
              <span className="accent">abgelaufen.</span>
            </h1>
            <p className="mt-8 text-lg text-mehlcreme/80 leading-relaxed">
              Kein Problem — der Bestätigungslink war ungültig oder schon zu
              alt. Trag dich einfach nochmal ein, dann schicken wir dir einen
              frischen.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-5">
              <Link
                href="/fruehstuecks-sommelier"
                className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
              >
                Nochmal eintragen <span aria-hidden>→</span>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-7 text-4xl md:text-6xl font-display font-normal leading-[1.0] tracking-tight text-mehlcreme">
              Du bist{" "}
              <span className="accent">dabei.</span>
            </h1>
            <p className="mt-8 text-lg text-mehlcreme/80 leading-relaxed">
              Danke fürs Bestätigen. Wenn&apos;s am{" "}
              <span className="italic text-tonwarm">
                {BREAKFAST_LAUNCH.dateLong}
              </span>{" "}
              losgeht, bist du eine der Ersten, die es erfährt — mit der
              kompletten Frühstückskarte.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-5">
              <Link
                href="/fruehstueck"
                className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
              >
                Zur Frühstücksseite <span aria-hidden>→</span>
              </Link>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-mehlcreme font-medium border-b border-mehlcreme/30 hover:border-tonwarm hover:text-tonwarm pb-1 transition-colors"
              >
                Folg uns auf Instagram
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
