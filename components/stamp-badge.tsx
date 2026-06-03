/**
 * Gezackter „Stempel" wie die Hinweis-Siegel auf der Brunch-Karte 2026
 * (z. B. die Kaffee-Hinweise) — Sternform-Rund mit feinem Innenring,
 * weiß/mehlcreme auf Grün oder waldgrün auf Hell.
 *
 *   <StampBadge tone="light"><span className="…">ab</span>06.07.</StampBadge>
 *
 * Der Inhalt sitzt mittig; Drehung gibt den handgestempelten Look.
 */
type StampBadgeProps = {
  children: React.ReactNode;
  tone?: "light" | "dark";
  /** Drehung in Grad — leicht schief wirkt handgestempelt. */
  rotate?: number;
  className?: string;
};

export function StampBadge({
  children,
  tone = "light",
  rotate = -7,
  className = "",
}: StampBadgeProps) {
  const color =
    tone === "light" ? "var(--color-mehlcreme)" : "var(--color-waldgruen)";

  // Zackenkranz: abwechselnd äußerer/innerer Radius rund um den Mittelpunkt.
  const teeth = 30;
  const outer = 49;
  const inner = 43;
  const polygon = Array.from({ length: teeth * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / teeth) * i - Math.PI / 2;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");

  // Äußere Hülle trägt Position/Größe/Drehung des Aufrufers (z. B. `absolute
  // top-24 right-6 w-28 h-28`). Die innere Hülle ist IMMER `relative` und damit
  // der Positionierungskontext für das absolute SVG — so kollidiert nichts mit
  // einem evtl. übergebenen `absolute`.
  return (
    <div
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <div className="relative grid place-items-center w-full h-full">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          <polygon
            points={polygon}
            stroke={color}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle
            cx="50"
            cy="50"
            r="37"
            stroke={color}
            strokeWidth="0.8"
            strokeOpacity="0.55"
          />
        </svg>
        <div
          className="relative z-10 px-3 text-center leading-[1.05]"
          style={{ color }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
