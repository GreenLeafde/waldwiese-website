/**
 * Runde Marke mit kurzem Text (z. B. „Rezept" auf den Rezeptkarten). Früher
 * ein gezackter Stempel; die CI 10/2026 hält es schlicht: Kreis mit feiner
 * Linie, Schrift in Jost.
 */
type StampBadgeProps = {
  children: React.ReactNode;
  tone?: "light" | "dark";
  /** Gefüllt in Terracotta mit weißer Schrift (gut lesbar auf Foto). */
  solid?: boolean;
  rotate?: number;
  className?: string;
};

export function StampBadge({
  children,
  tone = "light",
  solid = false,
  className = "",
}: StampBadgeProps) {
  const look = solid
    ? "bg-akzent text-white"
    : tone === "light"
      ? "text-creme shadow-[inset_0_0_0_1.5px_currentColor]"
      : "text-tanne shadow-[inset_0_0_0_1.5px_currentColor]";
  return (
    <span
      className={`inline-flex aspect-square items-center justify-center rounded-full p-3 text-center font-display text-sm leading-tight ${look} ${className}`}
    >
      <span className="flex flex-col items-center">{children}</span>
    </span>
  );
}
