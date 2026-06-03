/**
 * Kleiner botanischer Zweig als Sektions-Trenner — angelehnt an die
 * Illustrationen auf der Brunch-Karte (Blätter in Waldgrün, Beeren in Tonwarm).
 */
export function LeafDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`} aria-hidden>
      <svg
        width="148"
        height="26"
        viewBox="0 0 148 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* feiner Stiel */}
        <path
          d="M14 13 H134"
          stroke="var(--color-waldgruen)"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Blätter — symmetrisch um die Mitte */}
        <g fill="var(--color-waldgruen-dark)" opacity="0.9">
          <ellipse cx="58" cy="8" rx="8" ry="3.6" transform="rotate(-22 58 8)" />
          <ellipse cx="48" cy="17" rx="7" ry="3.2" transform="rotate(20 48 17)" />
          <ellipse cx="90" cy="8" rx="8" ry="3.6" transform="rotate(22 90 8)" />
          <ellipse cx="100" cy="17" rx="7" ry="3.2" transform="rotate(-20 100 17)" />
        </g>
        {/* Beeren — Tonwarm-Akzent in der Mitte */}
        <g fill="var(--color-tonwarm)">
          <circle cx="70" cy="13" r="2.4" />
          <circle cx="78" cy="13" r="2.4" />
          <circle cx="74" cy="7.5" r="2.2" />
        </g>
      </svg>
    </div>
  );
}
