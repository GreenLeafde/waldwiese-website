/**
 * Kleines Label über einer Überschrift (CI 10/2026: Versalien, Terracotta,
 * ohne Striche). Verwendung: <Eyebrow>Pflichtangaben</Eyebrow>
 */
export function Eyebrow({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  variant?: "default" | "centered" | "no-rules";
  align?: "left" | "center";
}) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.16em] text-akzent ${align === "center" ? "text-center" : ""}`}>
      {children}
    </p>
  );
}
