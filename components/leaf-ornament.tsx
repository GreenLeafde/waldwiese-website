type LeafOrnamentProps = {
  variant: "leaves-berries" | "berries-stem";
  className?: string;
};

/**
 * Hand-illustrationsartige Zweige wie auf der Brunch-Karte 2026.
 * Bewusst skizzenhaft gehalten, nicht zu perfekt — Bauernhof-Charakter.
 *
 * - "leaves-berries": vertikaler Zweig mit Blattpaaren und kleinen orangen Beeren
 *                     (passend an die linke Bildseite)
 * - "berries-stem":   feiner Zweig mit drei Beeren-Trauben und zwei Blättern
 *                     (passend an die rechte Bildseite)
 */
export function LeafOrnament({ variant, className = "" }: LeafOrnamentProps) {
  if (variant === "leaves-berries") {
    return (
      <svg
        viewBox="0 0 60 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className={className}
      >
        {/* Stiel */}
        <path
          d="M30 10 C 30 50, 32 100, 31 150 C 30 200, 32 240, 31 270"
          stroke="var(--color-mehlcreme)"
          strokeOpacity="0.45"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* Blätter — abwechselnd links/rechts */}
        <g fill="var(--color-waldgruen-dark)" opacity="0.95">
          <ellipse cx="14" cy="38" rx="9" ry="5" transform="rotate(-30 14 38)" />
          <ellipse cx="46" cy="62" rx="9" ry="5" transform="rotate(30 46 62)" />
          <ellipse cx="14" cy="90" rx="9" ry="5" transform="rotate(-30 14 90)" />
          <ellipse cx="46" cy="115" rx="9" ry="5" transform="rotate(30 46 115)" />
          <ellipse cx="14" cy="148" rx="9" ry="5" transform="rotate(-30 14 148)" />
          <ellipse cx="46" cy="178" rx="9" ry="5" transform="rotate(30 46 178)" />
          <ellipse cx="14" cy="212" rx="9" ry="5" transform="rotate(-30 14 212)" />
          <ellipse cx="46" cy="244" rx="9" ry="5" transform="rotate(30 46 244)" />
        </g>
        {/* Beeren — wenige orangene Akzentpunkte */}
        <g fill="var(--color-tonwarm)">
          <circle cx="42" cy="50" r="3" />
          <circle cx="20" cy="128" r="3" />
          <circle cx="42" cy="195" r="3" />
          <circle cx="18" cy="255" r="2.5" />
        </g>
      </svg>
    );
  }

  // berries-stem variant — rechter Zweig
  return (
    <svg
      viewBox="0 0 80 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      {/* Hauptstiel */}
      <path
        d="M40 10 C 38 60, 42 120, 40 180 C 39 220, 41 250, 40 270"
        stroke="var(--color-mehlcreme)"
        strokeOpacity="0.45"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Verzweigungen */}
      <path
        d="M40 60 q 12 -6 22 -22"
        stroke="var(--color-mehlcreme)"
        strokeOpacity="0.45"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M40 150 q -14 -8 -26 -28"
        stroke="var(--color-mehlcreme)"
        strokeOpacity="0.45"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M40 240 q 14 -10 26 -24"
        stroke="var(--color-mehlcreme)"
        strokeOpacity="0.45"
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* Beeren-Trauben (drei Beeren je Traube) */}
      <g fill="var(--color-tonwarm)">
        {/* Oben rechts */}
        <circle cx="60" cy="35" r="3.5" />
        <circle cx="68" cy="40" r="3.5" />
        <circle cx="64" cy="48" r="3.5" />
        {/* Mitte links */}
        <circle cx="16" cy="118" r="3" />
        <circle cx="22" cy="124" r="3" />
        <circle cx="16" cy="130" r="3" />
        {/* Unten rechts */}
        <circle cx="60" cy="216" r="3.5" />
        <circle cx="68" cy="220" r="3.5" />
        <circle cx="64" cy="227" r="3.5" />
      </g>

      {/* Ein paar Blätter zum Stiel */}
      <g fill="var(--color-waldgruen-dark)" opacity="0.9">
        <ellipse cx="52" cy="90" rx="8" ry="4.5" transform="rotate(40 52 90)" />
        <ellipse cx="28" cy="190" rx="8" ry="4.5" transform="rotate(-35 28 190)" />
        <ellipse cx="52" cy="260" rx="7" ry="4" transform="rotate(45 52 260)" />
      </g>
    </svg>
  );
}
