/**
 * Kleines „— LABEL —"-Element wie auf den Flyern.
 * Verwendung: <Eyebrow>Was uns ausmacht</Eyebrow>
 */
export function Eyebrow({
  children,
  variant = "default",
  align = "left",
}: {
  children: React.ReactNode;
  variant?: "default" | "centered" | "no-rules";
  align?: "left" | "center";
}) {
  const cls =
    variant === "centered"
      ? "eyebrow"
      : variant === "no-rules"
      ? "eyebrow no-before no-after"
      : "eyebrow no-before";
  const alignWrapper =
    align === "center" ? "flex justify-center" : "flex justify-start";
  return (
    <div className={alignWrapper}>
      <span className={cls}>{children}</span>
    </div>
  );
}
