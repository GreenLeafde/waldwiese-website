/**
 * Kleines Blatt-Icon für Diät-Hinweise an Gerichten (Brunch-Karte-Look).
 * `filled` = vollflächiges Blatt (vegan), sonst Umriss-Blatt mit Ader
 * (vegetarisch). Farbe kommt über `currentColor` von der Umgebung.
 */
export function LeafMark({
  filled = false,
  className = "",
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        d="M2.8 13.2 C2.8 7.4 7 3 13.2 2.8 C13 8.9 8.6 13.2 2.8 13.2 Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M4.3 11.7 C6.8 9.3 9.2 6.9 11.4 4.6"
        stroke={filled ? "rgba(255,255,255,0.65)" : "currentColor"}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
