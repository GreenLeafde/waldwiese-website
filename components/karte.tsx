import Image from "next/image";
import Link from "next/link";

/**
 * Bausteine für Speise- und Getränkekarte (Redesign 10/2026).
 *
 * Gericht in Jost, Preis rechts in Tabellenziffern, Beschreibung klein
 * darunter, feine Linie zwischen den Gerichten — wie der Karten-Auszug auf
 * der Startseite. Tags (vegan, vegetarisch) als kleines Wort, keine Icons.
 *
 * `tone` meint die SCHRIFT: "dark" = dunkle Schrift auf heller Fläche,
 * "light" = Creme auf dunkler Fläche. Die Fläche selbst kommt von der
 * umgebenden DaySection. Die Freisteller in /public/photos/karte stammen
 * aus den Karten-PDFs (echte Fotos der Gerichte).
 */

/* ------------------------------------------------------------------ Spots */

export const KARTE_SPOTS = {
  brote: { src: "/photos/karte/ww-brote.png", w: 294, h: 225, alt: "Zwei Avocado-Brote mit Rucola und eingelegten Zwiebeln, dazu ein Glas Orangensaft" },
  burger: { src: "/photos/karte/ww-burger.png", w: 276, h: 212, alt: "Burger im Brioche Bun mit Salat, Tomate und Essiggurke" },
  kinder: { src: "/photos/karte/ww-kinder.png", w: 227, h: 235, alt: "Kinderteller mit Croissant, Nutella, Fruchtzwerg und frischem Obst" },
  bowl: { src: "/photos/karte/ww-bowl.png", w: 236, h: 227, alt: "Grüne Smoothie-Bowl mit Banane, Chiasamen, Kokosflocken und Granola" },
  brett: { src: "/photos/karte/ww-fruehstuecksbrett.png", w: 343, h: 520, alt: "Frühstücksbrett mit Wurst, Käse, Aufstrichen, Rührei, Obst und Gemüse" },
  kaffee: { src: "/photos/karte/ww-kaffee.png", w: 223, h: 129, alt: "Tasse Cappuccino mit Latte Art, daneben Kaffeebohnen" },
  bier: { src: "/photos/karte/ww-bier.png", w: 252, h: 188, alt: "Bierflasche und gefülltes Glas mit Hopfendolden und Ähren" },
  wein: { src: "/photos/karte/ww-wein.png", w: 299, h: 206, alt: "Rot- und Weißweinflasche mit gefüllten Gläsern und Trauben" },
  schorle: { src: "/photos/karte/ww-schorle.png", w: 330, h: 189, alt: "Vier Gläser Schorle mit Eis, Früchten und Kräutern" },
} as const;

export type SpotKey = keyof typeof KARTE_SPOTS;
export type KarteTone = "dark" | "light";

const T = {
  dark: { text: "text-tanne", muted: "text-muted-hell", line: "border-tanne/15", soft: "text-tanne/60" },
  light: { text: "text-creme", muted: "text-creme/75", line: "border-creme/15", soft: "text-creme/60" },
} as const;

/** Freigestelltes Foto aus der gedruckten Karte — rein dekorativ. */
export function KarteSpot({
  spot,
  className = "",
  width = 260,
}: {
  spot: SpotKey;
  className?: string;
  width?: number;
}) {
  const s = KARTE_SPOTS[spot];
  return (
    <Image
      src={s.src}
      alt={s.alt}
      width={s.w}
      height={s.h}
      sizes={`${width}px`}
      className={`pointer-events-none select-none h-auto ${className}`}
      style={{ width }}
    />
  );
}

/* --------------------------------------------------------------- Masthead */

/**
 * Kopf einer Kartenseite: Label, große Überschrift, Zeile mit Zeiten,
 * darunter Platz für Knöpfe. Linksbündig im Seitenraster, kein Rahmen.
 */
export function KarteMasthead({
  kicker,
  title,
  accent,
  line,
  children,
  tone = "dark",
}: {
  kicker: string;
  title: string;
  accent?: string;
  /** Die Zeile unter der Überschrift, z. B. „Täglich · 8 bis 14 Uhr". */
  line: string;
  children?: React.ReactNode;
  tone?: KarteTone;
}) {
  const t = T[tone];
  return (
    <div className={`mx-auto max-w-[1180px] px-5 pb-12 pt-[116px] md:px-12 md:pb-16 md:pt-[140px] ${t.text}`}>
      <Link
        href="/"
        className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${t.soft} hover:underline underline-offset-4`}
      >
        <span aria-hidden>←</span> Startseite
      </Link>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-akzent">{kicker}</p>
      <h1 className="mt-3 max-w-[16ch] font-display text-[2.6rem] font-light leading-[1.05] md:text-[3.75rem]">
        {title}
        {accent && (
          <>
            {" "}
            <span className="font-normal">{accent}</span>
          </>
        )}
      </h1>
      <p className={`mt-5 max-w-[60ch] text-[1.05rem] leading-relaxed ${t.muted}`}>{line}</p>
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------- Kategorie & Dish */

/** Kategorie-Überschrift mit Hinweis, linksbündig, Linie darunter. */
export function KarteHeading({
  title,
  hint,
  tone = "dark",
}: {
  title: string;
  hint?: string;
  tone?: KarteTone;
}) {
  const t = T[tone];
  return (
    <div className={`border-b pb-4 ${t.line} ${t.text}`}>
      <h3 className="font-display text-[1.6rem] font-normal leading-tight md:text-[1.9rem]">{title}</h3>
      {hint && <p className={`mt-1 text-[0.95rem] ${t.muted}`}>{hint}</p>}
    </div>
  );
}

const TAG_LABEL: Record<string, string> = {
  vegan: "vegan",
  vegetarisch: "vegetarisch",
  "vegan möglich": "vegan möglich",
  "vegetarisch möglich": "vegetarisch möglich",
};

export type KarteDishData = {
  name: string;
  desc?: string;
  hint?: string;
  price: string | string[];
  options?: Array<{ label: string; price: string }>;
  tags?: readonly string[];
  recipeSlug?: string;
};

/** Ein Gericht: Name links, Preis rechts, Beschreibung darunter. */
export function KarteDish({
  dish,
  tone = "dark",
}: {
  dish: KarteDishData;
  tone?: KarteTone;
}) {
  const t = T[tone];
  const star = dish.tags?.includes("empfehlung");
  const prices = Array.isArray(dish.price) ? dish.price : [dish.price];
  const tags = (dish.tags ?? []).map((x) => TAG_LABEL[x]).filter(Boolean);

  return (
    <li className={`grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b py-4 ${t.line} ${t.text}`}>
      <p className="m-0 font-display text-[1.2rem] leading-tight md:text-[1.3rem]">
        {dish.name}
        {star && (
          <span aria-label="Unsere Empfehlung" title="Unsere Empfehlung" className="ml-2 text-akzent">
            ★
          </span>
        )}
        {tags.length > 0 && (
          <span className={`ml-2 font-body text-xs ${t.muted}`}>{tags.join(" · ")}</span>
        )}
      </p>
      <span className="whitespace-nowrap text-[0.95rem] tabular-nums">{prices.join(" / ")}</span>
      {dish.desc && (
        <p className={`col-span-2 m-0 text-[0.9rem] leading-snug ${t.muted}`}>{dish.desc}</p>
      )}
      {dish.options?.map((opt) => (
        <p key={opt.label} className={`col-span-2 m-0 text-[0.9rem] ${t.muted}`}>
          + {opt.label} <span className="tabular-nums">{opt.price}</span>
        </p>
      ))}
      {dish.hint && (
        <p className={`col-span-2 m-0 text-xs font-semibold uppercase tracking-[0.12em] ${t.soft}`}>
          {dish.hint}
        </p>
      )}
      {dish.recipeSlug && (
        <Link
          href={`/rezepte/${dish.recipeSlug}`}
          className="col-span-2 justify-self-start text-[0.9rem] font-semibold underline underline-offset-4"
        >
          Rezept zum Nachmachen
        </Link>
      )}
    </li>
  );
}

/** Kategorie: Überschrift, Gerichte, optional ein Freisteller unten. */
export function KarteColumn({
  title,
  hint,
  items,
  spot,
  spotWidth,
  tone = "dark",
}: {
  title: string;
  hint?: string;
  items: readonly KarteDishData[];
  spot?: SpotKey;
  spotWidth?: number;
  tone?: KarteTone;
}) {
  return (
    <div className="break-inside-avoid">
      <KarteHeading title={title} hint={hint} tone={tone} />
      <ul className="m-0 list-none p-0">
        {items.map((d) => (
          <KarteDish key={d.name} dish={d} tone={tone} />
        ))}
      </ul>
      {spot && (
        <div className="mt-8 flex justify-center">
          <KarteSpot spot={spot} width={spotWidth ?? 200} />
        </div>
      )}
    </div>
  );
}

/** Schlusszeile unter der Karte. */
export function KarteFineprint({ tone = "dark" }: { tone?: KarteTone }) {
  const t = T[tone];
  return (
    <p className={`mt-12 border-t pt-4 text-[0.8rem] leading-relaxed ${t.line} ${t.muted}`}>
      Alle Preise in Euro inkl. MwSt. · Über Allergene und Zusatzstoffe informiert dich gerne
      unser Serviceteam · Änderungen vorbehalten · <span className="text-akzent">★</span>{" "}
      unsere Empfehlung
    </p>
  );
}
