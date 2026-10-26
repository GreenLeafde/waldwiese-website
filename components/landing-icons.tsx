/**
 * Linien-Icons für die Landingpages — gleiche Machart wie offer-icons.tsx
 * (eine Strichstärke, runde Enden, currentColor). Welches Icon ein Punkt
 * bekommt, entscheidet `iconFor()` anhand des Titels, damit die ~20
 * Landingpage-JSONs nicht einzeln gepflegt werden müssen.
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

type IconProps = { className?: string };

function Leaf({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 38c0-16 10-26 28-28 0 18-10 28-26 28H10Z" />
      <path d="M10 38 28 20" />
    </svg>
  );
}

function Heart({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M24 40S8 30.5 8 19a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 11.5-16 21-16 21Z" />
    </svg>
  );
}

function Wheat({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M24 42V12" />
      <path d="M24 18c-4 0-7-3-7-7 4 0 7 3 7 7ZM24 18c4 0 7-3 7-7-4 0-7 3-7 7Z" />
      <path d="M24 27c-4 0-7-3-7-7 4 0 7 3 7 7ZM24 27c4 0 7-3 7-7-4 0-7 3-7 7Z" />
      <path d="M24 36c-4 0-7-3-7-7 4 0 7 3 7 7ZM24 36c4 0 7-3 7-7-4 0-7 3-7 7Z" />
    </svg>
  );
}

function Egg({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 30a16 10 0 0 0 32 0" />
      <path d="M8 30h32" />
      <circle cx="24" cy="24" r="5" />
      <path d="M40 30h4" />
    </svg>
  );
}

function Clock({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="24" cy="24" r="16" />
      <path d="M24 15v9l6 4" />
    </svg>
  );
}

function Paw({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M16 34c0-5 3.6-9 8-9s8 4 8 9c0 3-2.5 5-5 4-1.2-.5-2-.7-3-.7s-1.8.2-3 .7c-2.5 1-5-1-5-4Z" />
      <circle cx="13" cy="21" r="3" />
      <circle cx="19.5" cy="14" r="3" />
      <circle cx="28.5" cy="14" r="3" />
      <circle cx="35" cy="21" r="3" />
    </svg>
  );
}

function Cutlery({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M15 6v12a4 4 0 0 0 4 4v20" />
      <path d="M11 6v10a4 4 0 0 0 4 4M23 6v10a4 4 0 0 1-4 4" />
      <path d="M19 6v10" />
      <path d="M34 42V6c-4 3-6 9-6 15 0 3 2 5 6 5" />
    </svg>
  );
}

function Coffee({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 20h22v9a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9v-9Z" />
      <path d="M32 23h3a4 4 0 0 1 0 8h-3" />
      <path d="M16 9c-1.5 2 1.5 3.5 0 6M22 8c-1.5 2 1.5 3.5 0 6M28 9c-1.5 2 1.5 3.5 0 6" />
    </svg>
  );
}

function Pin({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M24 42s13-12.5 13-22a13 13 0 0 0-26 0c0 9.5 13 22 13 22Z" />
      <circle cx="24" cy="20" r="5" />
    </svg>
  );
}

function Star({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m24 8 4.7 9.6 10.5 1.5-7.6 7.4 1.8 10.5L24 32l-9.4 5 1.8-10.5-7.6-7.4 10.5-1.5L24 8Z" />
    </svg>
  );
}

const RULES: Array<[RegExp, (p: IconProps) => React.JSX.Element]> = [
  [/hund|vierbein|heinzi/i, Paw],
  [/feier|fest|hochzeit|anlass|event|gruppe|zauber|platz für/i, Star],
  [/finale|dessert|menü|patty/i, Cutlery],
  [/namen|geschichte/i, Star],
  [/famil|persönlich|herzlich|willkommen/i, Heart],
  [/vegan|vegetar|pflanz/i, Leaf],
  [/regional|hausgemacht|ehrlich|saison|obst|höfe/i, Wheat],
  [/herzhaft|frühstück|rührei|süß/i, Egg],
  [/zeit|tag|uhr|wochenende|sonntag|täglich|hetze|reserv/i, Clock],
  [/kaffee/i, Coffee],
  [/mittag|gericht|burger|grill|abend|essen|karte/i, Cutlery],
  [/grün|terrasse|wald|natur|trubel|büro|draußen/i, Leaf],
  [/nah|regensburg|anfahrt|weg|parkplatz|lage|ort|straße|fahrt|erreichen/i, Pin],
];

/** Passendes Icon zum Titel eines Punkts; Blatt als ruhiger Standard. */
export function iconFor(title: string) {
  return RULES.find(([re]) => re.test(title))?.[1] ?? Leaf;
}
