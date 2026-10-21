/**
 * Linien-Icons für „Was es bei uns gibt" (Redesign 10/2026): eine Strichstärke,
 * runde Enden, currentColor — passen zur Jost-Schrift und zum Logo.
 */
const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Kaffeetasse mit Dampf — Brunch. */
export function IconBrunch({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M10 20h22v9a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9v-9Z" />
      <path d="M32 23h3a4 4 0 0 1 0 8h-3" />
      <path d="M8 42h28" />
      <path d="M16 9c-1.5 2 1.5 3.5 0 6M22 8c-1.5 2 1.5 3.5 0 6M28 9c-1.5 2 1.5 3.5 0 6" />
    </svg>
  );
}

/** Gabel und Messer — Abendessen. */
export function IconAbend({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M15 6v12a4 4 0 0 0 4 4v20" />
      <path d="M11 6v10a4 4 0 0 0 4 4M23 6v10a4 4 0 0 1-4 4" />
      <path d="M19 6v10" />
      <path d="M34 42V6c-4 3-6 9-6 15 0 3 2 5 6 5" />
    </svg>
  );
}

/** Kalenderblatt mit Stern — Events & Feiern. */
export function IconEvents({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <rect x="8" y="10" width="32" height="30" rx="4" />
      <path d="M8 18h32M16 6v8M32 6v8" />
      <path d="m24 23 2.2 4.4 4.8.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8-3.5-3.4 4.8-.7L24 23Z" />
    </svg>
  );
}
