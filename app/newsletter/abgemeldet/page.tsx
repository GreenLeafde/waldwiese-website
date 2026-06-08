import Link from "next/link";

export const metadata = {
  title: "Abgemeldet",
  robots: { index: false, follow: false },
  alternates: { canonical: "/newsletter/abgemeldet" },
};

export default async function AbgemeldetPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const ok = status !== "ungueltig";

  return (
    <section className="relative isolate bg-waldgruen text-mehlcreme min-h-svh flex items-center">
      <div className="mx-auto max-w-xl px-6 md:px-10 py-32 text-center">
        <p className="eyebrow no-line justify-center text-tonwarm">Newsletter</p>
        <h1 className="mt-7 text-4xl md:text-5xl font-display font-normal leading-tight text-mehlcreme">
          {ok ? "Du bist abgemeldet." : "Link ungültig."}
        </h1>
        <p className="mt-7 text-lg text-mehlcreme/80 leading-relaxed">
          {ok
            ? "Schade, dass du gehst — aber kein Problem. Du bekommst von uns keine Newsletter mehr."
            : "Dieser Abmeldelink ist leider ungültig. Schreib uns kurz, dann tragen wir dich von Hand aus."}
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
          >
            Zur Startseite <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
