/**
 * Feste Kaufleiste am unteren Bildschirmrand — nur mobil. Auf dem Handy
 * scrollt der Kaufknopf sonst schnell aus dem Blick; so bleibt er immer eine
 * Daumenbreite entfernt. Am Desktop reichen die Knöpfe im Seiteninhalt.
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
      <div aria-hidden className="h-20 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-waldgruen/10 bg-mehlcreme/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          {note && (
            <p className="flex-1 text-xs leading-snug text-waldgruen/70">
              {note}
            </p>
          )}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${note ? "" : "flex-1 justify-center "}inline-flex items-center gap-2 rounded-full bg-tonwarm px-6 py-3 font-medium text-white transition-colors hover:bg-tonwarm-dark`}
          >
            {label} <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </>
  );
}
