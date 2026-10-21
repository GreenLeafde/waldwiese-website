/**
 * Feste Kaufleiste am unteren Bildschirmrand — nur mobil — für Seiten mit
 * EINEM klaren Kaufziel (Gutschein kaufen, Tickets). Ersetzt dort die
 * allgemeine Leiste aus site-sticky-bar.tsx (die blendet sich auf diesen
 * Seiten selbst aus). Nacht-Grund, Akzent-Knopf, wie in der CI.
 */
export function StickyCta({
  href,
  label,
  note,
}: {
  href: string;
  label: string;
  /** Kleine Zeile links neben dem Knopf, z. B. „ab 10 € · sofort als PDF". */
  note?: string;
}) {
  return (
    <>
      {/* Platzhalter, damit der Footer nicht unter der Leiste verschwindet. */}
      <div aria-hidden className="h-[72px] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-creme/10 bg-nacht px-4 py-2.5 text-creme md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          {note && (
            <p className="flex-1 text-xs leading-snug text-creme/70">{note}</p>
          )}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${note ? "" : "flex-1 justify-center "}inline-flex h-12 items-center gap-2 rounded-full bg-akzent px-6 font-semibold text-white transition-colors hover:bg-akzent-hover`}
          >
            {label} <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </>
  );
}
