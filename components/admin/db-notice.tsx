/**
 * Wird in den Backend-Seiten angezeigt, solange die Datenbank nicht erreichbar
 * ist (z. B. auf Vercel, bevor Turso eingerichtet wurde). Verhindert den 500.
 */
export function DbNotice() {
  return (
    <div className="rounded-2xl ring-1 ring-tonwarm/30 bg-tonwarm/5 px-6 py-8 max-w-2xl">
      <p className="text-[0.7rem] tracking-[0.22em] uppercase text-tonwarm font-medium">
        Datenbank noch nicht verbunden
      </p>
      <h2 className="mt-3 text-2xl font-display font-normal text-waldgruen">
        Fast fertig — die Datenbank fehlt noch
      </h2>
      <p className="mt-3 text-waldgruen/70 leading-relaxed">
        Login &amp; Website laufen, aber Kontakte und Auswertungen brauchen eine
        Datenbank. So richtest du sie ein (einmalig, ein paar Minuten):
      </p>
      <ol className="mt-4 space-y-2 text-sm text-waldgruen/80 list-decimal list-inside">
        <li>
          Im Vercel-Dashboard das Projekt{" "}
          <span className="font-medium text-waldgruen">project-1w621</span> öffnen
        </li>
        <li>
          Tab <span className="font-medium text-waldgruen">Storage</span> →{" "}
          <span className="font-medium text-waldgruen">Create Database</span> →{" "}
          <span className="font-medium text-waldgruen">Turso</span>
        </li>
        <li>Gratis-Plan, Region Frankfurt/EU, bestätigen</li>
        <li>
          Vercel setzt die Zugangsdaten automatisch — danach einmal neu deployen
        </li>
      </ol>
    </div>
  );
}
