/**
 * Sichtbarer Hinweis dass an dieser Stelle noch Inhalte folgen.
 * Bewusst auffällig (Tonwarm-Rahmen, kleines „TODO"-Eyebrow), damit beim
 * Durchklicken sofort klar wird wo Input fehlt. Vor Launch entfernen.
 */
export function PlaceholderNotice({
  title = "Inhalt folgt",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <aside
      role="note"
      className="my-8 border-l-4 border-tonwarm bg-tonwarm/10 px-5 py-4 text-sm"
    >
      <p className="text-tonwarm text-xs tracking-[0.18em] uppercase font-medium mb-1">
        Platzhalter · {title}
      </p>
      <div className="text-waldgruen/80 leading-relaxed">{children}</div>
    </aside>
  );
}
