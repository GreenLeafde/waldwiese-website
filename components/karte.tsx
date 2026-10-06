import Image from "next/image";
import Link from "next/link";
import { LeafMark } from "@/components/diet-leaf";

/**
 * Bausteine für Speise- und Getränkekarte im Look der gedruckten Karten
 * (Stand Oktober 2026): Papierfläche in Mehlcreme, Waldgrün-Haarlinien,
 * zentrierte Versalien-Überschriften, Preis direkt hinter dem Namen und
 * freigestellte Foodfotos als Spots.
 *
 * Die Freisteller in /public/photos/karte stammen aus den Karten-PDFs.
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

/** Freigestelltes Foto wie auf der gedruckten Karte — rein dekorativ. */
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
 * Kopf wie auf der Karte: dicke Linie, Wortmarke, dünne Linie, Zeile mit
 * Ort / Kartenname / Familie.
 */
export function KarteMasthead({
  kicker,
  title,
  accent,
  line,
  children,
}: {
  kicker: string;
  title: string;
  accent?: string;
  /** Die kleine Zeile unter der Wortmarke, z. B. „Täglich · 8 bis 14 Uhr". */
  line: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-mehlcreme">
      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-24 md:pt-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-waldgruen/45 hover:text-tonwarm transition-colors"
        >
          <span aria-hidden>←</span> Startseite
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10 pt-10 md:pt-12 pb-10 md:pb-14">
        <div aria-hidden className="h-[3px] bg-waldgruen" />

        <div className="py-8 md:py-10 text-center reveal">
          <p className="text-[0.62rem] md:text-[0.68rem] tracking-[0.3em] uppercase text-waldgruen/50">
            {kicker}
          </p>
          <h1 className="mt-5 font-display font-normal leading-[0.95] tracking-tight text-waldgruen text-5xl md:text-7xl lg:text-8xl">
            {title}
            {accent && (
              <>
                {" "}
                <span className="accent">{accent}</span>
              </>
            )}
          </h1>
        </div>

        <div aria-hidden className="h-px bg-waldgruen/35" />

        <p className="py-4 text-center text-[0.62rem] md:text-[0.7rem] tracking-[0.26em] uppercase text-waldgruen/60">
          {line}
        </p>

        <div aria-hidden className="h-px bg-waldgruen/35" />

        {children && <div className="pt-10 md:pt-12">{children}</div>}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Kategorie & Dish */

/** Zentrierte Versalien-Überschrift mit Haarlinie darunter. */
export function KarteHeading({
  title,
  hint,
  tone = "dark",
}: {
  title: string;
  hint?: string;
  tone?: "dark" | "light";
}) {
  const text = tone === "light" ? "text-mehlcreme" : "text-waldgruen";
  const rule = tone === "light" ? "bg-mehlcreme/30" : "bg-waldgruen/30";
  const sub = tone === "light" ? "text-mehlcreme/65" : "text-waldgruen/55";
  return (
    <div className="text-center">
      <h3
        className={`font-display font-normal uppercase tracking-[0.14em] leading-tight text-2xl md:text-3xl ${text}`}
      >
        {title}
      </h3>
      {hint && <p className={`mt-2 text-sm italic ${sub}`}>{hint}</p>}
      <div aria-hidden className={`mt-4 h-px ${rule}`} />
    </div>
  );
}

const TAG_LABEL: Record<string, string> = {
  vegan: "vegan",
  vegetarisch: "vegetarisch",
  "vegan möglich": "vegan möglich",
  "vegetarisch möglich": "vegetarisch möglich",
  empfehlung: "Empfehlung",
};

function DishTag({ tag, tone }: { tag: string; tone: "dark" | "light" }) {
  const label = TAG_LABEL[tag];
  if (!label || tag === "empfehlung") return null;
  const vegan = tag === "vegan" || tag === "vegan möglich";
  return (
    <span
      className={`ml-2 inline-flex items-center gap-1 align-middle font-body text-[0.68rem] lowercase tracking-wide ${
        tone === "light" ? "text-tonwarm" : "text-tonwarm"
      }`}
    >
      <LeafMark filled={vegan} className="h-2.5 w-2.5 shrink-0" />
      {label}
    </span>
  );
}

export type KarteDishData = {
  name: string;
  desc?: string;
  hint?: string;
  price: string | string[];
  options?: Array<{ label: string; price: string }>;
  tags?: readonly string[];
  recipeSlug?: string;
};

/**
 * Ein Gericht im Kartenlook: Name fett, Preis direkt dahinter (wie gedruckt),
 * Beschreibung klein darunter.
 */
export function KarteDish({
  dish,
  tone = "dark",
}: {
  dish: KarteDishData;
  tone?: "dark" | "light";
}) {
  const star = dish.tags?.includes("empfehlung");
  const name = tone === "light" ? "text-mehlcreme" : "text-waldgruen";
  const body = tone === "light" ? "text-mehlcreme/70" : "text-waldgruen/70";
  const price = tone === "light" ? "text-mehlcreme/90" : "text-waldgruen/90";
  const prices = Array.isArray(dish.price) ? dish.price : [dish.price];

  return (
    <li className="relative">
      {star && (
        <span
          aria-label="Unsere Empfehlung"
          title="Unsere Empfehlung"
          className="absolute -left-5 top-[0.15em] text-tonwarm text-sm md:-left-6 md:text-base"
        >
          ★
        </span>
      )}
      <p className="font-display text-lg md:text-xl leading-snug">
        <span className={`font-semibold ${name}`}>{dish.name}</span>{" "}
        <span className={`whitespace-nowrap font-normal ${price}`}>
          {prices.join(" / ")}
        </span>
        {dish.tags?.map((t) => (
          <DishTag key={t} tag={t} tone={tone} />
        ))}
      </p>
      {dish.desc && (
        <p className={`mt-1.5 text-[0.95rem] leading-relaxed ${body}`}>
          {dish.desc}
        </p>
      )}
      {dish.options?.map((opt) => (
        <p key={opt.label} className="mt-1 text-[0.95rem] text-tonwarm">
          + {opt.label}{" "}
          <span className={tone === "light" ? "text-mehlcreme/50" : "text-waldgruen/50"}>
            {opt.price}
          </span>
        </p>
      ))}
      {dish.hint && (
        <p
          className={`mt-1 text-[0.68rem] uppercase tracking-[0.18em] ${
            tone === "light" ? "text-mehlcreme/45" : "text-waldgruen/45"
          }`}
        >
          {dish.hint}
        </p>
      )}
      {dish.recipeSlug && (
        <Link
          href={`/rezepte/${dish.recipeSlug}`}
          className="mt-1.5 inline-flex items-center gap-1.5 text-[0.9rem] text-tonwarm underline decoration-tonwarm/40 underline-offset-2 transition-colors hover:text-tonwarm-dark"
        >
          Rezept zum Nachmachen <span aria-hidden>→</span>
        </Link>
      )}
    </li>
  );
}

/** Kategorie-Spalte: Überschrift, Gerichte, optional ein Freisteller. */
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
  tone?: "dark" | "light";
}) {
  return (
    <div className="break-inside-avoid">
      <KarteHeading title={title} hint={hint} tone={tone} />
      <ul className="mt-7 space-y-7 pl-5 md:pl-6">
        {items.map((d) => (
          <KarteDish key={d.name} dish={d} tone={tone} />
        ))}
      </ul>
      {spot && (
        <div className="mt-9 flex justify-center">
          <KarteSpot spot={spot} width={spotWidth ?? 230} />
        </div>
      )}
    </div>
  );
}

/** Schlusszeile wie im Fuß der gedruckten Karte. */
export function KarteFineprint({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const c = tone === "light" ? "text-mehlcreme/45" : "text-waldgruen/45";
  const rule = tone === "light" ? "bg-mehlcreme/20" : "bg-waldgruen/20";
  return (
    <div className="mt-16 md:mt-20">
      <div aria-hidden className={`h-px ${rule}`} />
      <p className={`pt-4 text-center text-[0.72rem] leading-relaxed ${c}`}>
        Alle Preise in Euro inkl. MwSt. · Über Allergene und Zusatzstoffe
        informiert dich gerne unser Serviceteam · Änderungen vorbehalten ·{" "}
        <span className="text-tonwarm">★</span> unsere Empfehlung für dich
      </p>
    </div>
  );
}
