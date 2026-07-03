import Link from "next/link";
import { verifyUnsubscribeToken } from "@/lib/newsletter-token";

export const metadata = {
  title: "Newsletter abmelden",
  robots: { index: false, follow: false },
  alternates: { canonical: "/newsletter/abmelden" },
};

const UNSUB_REASONS = [
  "Zu viele E-Mails",
  "Inhalte sind für mich nicht relevant",
  "Ich habe mich nie angemeldet",
  "Sonstiges",
];

/**
 * Abmelde-Bestätigung ("Abfrage"): Der Abmeldelink aus der Mail landet hier
 * statt sofort auszutragen. Erst der Klick auf „Ja, abmelden" sendet einen POST
 * an /api/newsletter/abmelden, der dann wirklich austrägt.
 */
export default async function AbmeldenPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; c?: string }>;
}) {
  const { token, c } = await searchParams;
  const valid = token ? verifyUnsubscribeToken(token) : null;
  const formAction =
    `/api/newsletter/abmelden?token=${encodeURIComponent(token ?? "")}` +
    (c ? `&c=${encodeURIComponent(c)}` : "");

  return (
    <section className="relative isolate bg-waldgruen text-mehlcreme min-h-svh flex items-center">
      <div className="mx-auto max-w-xl px-6 md:px-10 py-32 text-center">
        <p className="eyebrow no-line justify-center text-tonwarm">Newsletter</p>

        {valid ? (
          <>
            <h1 className="mt-7 text-4xl md:text-5xl font-display font-normal leading-tight text-mehlcreme">
              Wirklich abmelden?
            </h1>
            <p className="mt-7 text-lg text-mehlcreme/80 leading-relaxed">
              Sollen wir{" "}
              <strong className="text-mehlcreme">{valid.email}</strong> vom
              Wald-&amp;-Wiese-Newsletter abmelden? Du bekommst dann keine Mails
              mehr von uns — anmelden kannst du dich natürlich jederzeit wieder.
            </p>

            <form
              action={formAction}
              method="post"
              className="mt-9 mx-auto max-w-md text-left"
            >
              <input type="hidden" name="confirm" value="1" />

              <fieldset className="rounded-2xl bg-mehlcreme/[0.06] ring-1 ring-mehlcreme/15 p-5">
                <legend className="px-2 text-sm text-mehlcreme/70">
                  Magst du uns kurz sagen, warum? (freiwillig)
                </legend>
                <div className="space-y-2.5">
                  {UNSUB_REASONS.map((r) => (
                    <label
                      key={r}
                      className="flex items-center gap-3 text-mehlcreme/85 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r}
                        className="h-4 w-4 accent-tonwarm"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  name="reasonText"
                  maxLength={300}
                  placeholder="Noch etwas, das wir wissen sollten? (optional)"
                  className="mt-4 w-full rounded-full border border-mehlcreme/25 bg-mehlcreme/10 px-5 py-2.5 text-sm text-mehlcreme placeholder-mehlcreme/40 outline-none transition focus:border-tonwarm focus:ring-2 focus:ring-tonwarm/30"
                />
              </fieldset>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
                >
                  Ja, abmelden
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 border border-mehlcreme/30 text-mehlcreme hover:bg-mehlcreme/10 px-7 py-3.5 rounded-full font-medium transition-colors"
                >
                  Nein, dabei bleiben
                </Link>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="mt-7 text-4xl md:text-5xl font-display font-normal leading-tight text-mehlcreme">
              Link ungültig.
            </h1>
            <p className="mt-7 text-lg text-mehlcreme/80 leading-relaxed">
              Dieser Abmeldelink ist leider ungültig oder unvollständig. Schreib
              uns kurz, dann tragen wir dich von Hand aus.
            </p>
            <div className="mt-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
              >
                Zur Startseite <span aria-hidden>→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
