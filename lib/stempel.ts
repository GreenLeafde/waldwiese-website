/**
 * Anschluss an die bestehende Zeiterfassung.
 *
 * WICHTIG: Diese Daten gehoeren der alten Stempel-App und werden dort
 * ausgewertet. Wir lesen sie im **exakt gleichen Format**, in dem sie liegen,
 * und legen keine zweite Kopie an. Alles, was hier geschrieben wird, muss die
 * alte App unveraendert weiterlesen koennen.
 *
 * Ablage ist eine Tabelle `kv_store` (key/value) mit drei JSON-Texten:
 *   zt-config   — die Mitarbeiter  [{id, nr, name, lohnart, color}]
 *   zt-open     — wer gerade drin ist  { "<Name>": {start:"HH:MM", date:"YYYY-MM-DD"} }
 *   zt-entries  — abgeschlossene Stempelungen  [{id, name, date, start, end, color}]
 *
 * Gelesen wird ueber die REST-Schnittstelle von Supabase — ein `fetch` reicht,
 * dafuer braucht das Projekt keine zusaetzliche Abhaengigkeit.
 *
 * Env:
 *   ZEITERFASSUNG_SUPABASE_URL — https://<projekt>.supabase.co
 *   ZEITERFASSUNG_SUPABASE_KEY — Schluessel des Projekts
 *
 * NUR server-seitig importieren.
 */

const env = (key: string): string => (process.env[key] ?? "").trim();

export type Mitarbeiter = {
  id: number;
  nr: number;
  name: string;
  lohnart: string;
  color: string;
};

export type Eingestempelt = {
  name: string;
  /** "HH:MM" */
  seit: string;
  /** "YYYY-MM-DD" */
  datum: string;
};

export function stempelKonfiguriert(): boolean {
  return Boolean(env("ZEITERFASSUNG_SUPABASE_URL") && env("ZEITERFASSUNG_SUPABASE_KEY"));
}

/** Sagt, WAS fehlt — sonst sucht man bei "nicht verbunden" im Dunkeln. */
export function stempelProblem(): string | null {
  const fehlt: string[] = [];
  if (!env("ZEITERFASSUNG_SUPABASE_URL")) fehlt.push("ZEITERFASSUNG_SUPABASE_URL");
  if (!env("ZEITERFASSUNG_SUPABASE_KEY")) fehlt.push("ZEITERFASSUNG_SUPABASE_KEY");
  if (fehlt.length === 0) return null;
  return `Es fehlt noch ${fehlt.join(" und ")} in den Einstellungen dieses Projekts.`;
}

/** Rohtext eines Schluessels aus dem kv_store, oder null. */
async function lese(key: string): Promise<string | null> {
  if (!stempelKonfiguriert()) return null;

  const basis = env("ZEITERFASSUNG_SUPABASE_URL").replace(/\/+$/, "");
  const schluessel = env("ZEITERFASSUNG_SUPABASE_KEY");

  const res = await fetch(
    `${basis}/rest/v1/kv_store?key=eq.${encodeURIComponent(key)}&select=value`,
    {
      cache: "no-store",
      headers: {
        apikey: schluessel,
        Authorization: `Bearer ${schluessel}`,
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Zeiterfassung antwortet mit ${res.status}`);
  }
  const zeilen = (await res.json()) as { value: string }[];
  return zeilen[0]?.value ?? null;
}

async function leseJson<T>(key: string, standard: T): Promise<T> {
  try {
    const roh = await lese(key);
    if (!roh) return standard;
    return JSON.parse(roh) as T;
  } catch (e) {
    console.error("[stempel]", key, e);
    return standard;
  }
}

/** Die Mitarbeiter, wie sie in der Stempel-App gepflegt sind. */
export async function holeMitarbeiter(): Promise<Mitarbeiter[]> {
  const liste = await leseJson<Mitarbeiter[]>("zt-config", []);
  return Array.isArray(liste) ? liste : [];
}

/**
 * Wer gerade eingestempelt ist. Das Einstempeln ist die Anmeldung: Nur wer
 * hier steht, sieht die Aufgaben und kann abhaken.
 */
export async function holeEingestempelte(): Promise<Eingestempelt[]> {
  const roh = await leseJson<Record<string, { start?: string; date?: string }>>(
    "zt-open",
    {},
  );
  if (!roh || typeof roh !== "object") return [];

  return Object.entries(roh)
    .filter(([name]) => Boolean(name))
    .map(([name, wert]) => ({
      name,
      seit: String(wert?.start ?? ""),
      datum: String(wert?.date ?? ""),
    }))
    .sort((a, b) => a.seit.localeCompare(b.seit));
}

/**
 * Prueft serverseitig, ob dieser Name gerade im Dienst ist.
 *
 * Ohne diese Pruefung koennte jemand die Aktion direkt aufrufen und mit einem
 * beliebigen Namen abhaken — die Schicht-Ansicht ist ja bewusst ohne
 * Anmeldung erreichbar.
 */
export async function istEingestempelt(name: string): Promise<boolean> {
  if (!name) return false;
  const offen = await holeEingestempelte();
  return offen.some((e) => e.name === name);
}

// ─── Schreiben ──────────────────────────────────────────────────────────────

const BERLIN = "Europe/Berlin";

/** "HH:MM" in Berliner Zeit — dasselbe Format, das die alte App schreibt. */
export function jetztUhrzeit(t = new Date()): string {
  return t.toLocaleTimeString("de-DE", {
    timeZone: BERLIN,
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "YYYY-MM-DD" in Berliner Zeit. */
export function jetztDatum(t = new Date()): string {
  return t.toLocaleDateString("en-CA", {
    timeZone: BERLIN,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

type Eintrag = {
  id: number;
  name: string;
  date: string;
  start: string;
  end: string;
  color: string;
};

/** Alle abgeschlossenen Stempelungen — Grundlage der Auswertung. */
export async function holeEintraege(): Promise<Eintrag[]> {
  const liste = await leseJson<Eintrag[]>("zt-entries", []);
  return Array.isArray(liste) ? liste : [];
}

/**
 * Einen Eintrag entfernen (Korrektur durch die Leitung).
 * Wie beim Stempeln wird der ganze JSON-Text neu geschrieben — mehr gibt das
 * Altformat nicht her.
 */
export async function loescheEintrag(id: number): Promise<void> {
  const alle = await holeEintraege();
  await schreibe(
    "zt-entries",
    alle.filter((e) => e.id !== id),
  );
}

async function schreibe(key: string, wert: unknown): Promise<void> {
  if (!stempelKonfiguriert()) throw new Error("Die Zeiterfassung ist nicht verbunden.");

  const basis = env("ZEITERFASSUNG_SUPABASE_URL").replace(/\/+$/, "");
  const schluessel = env("ZEITERFASSUNG_SUPABASE_KEY");

  const res = await fetch(`${basis}/rest/v1/kv_store`, {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: schluessel,
      Authorization: `Bearer ${schluessel}`,
      "Content-Type": "application/json",
      // Gleiches Verhalten wie das upsert der alten App.
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify([{ key, value: JSON.stringify(wert) }]),
  });

  if (!res.ok) {
    throw new Error(`Zeiterfassung antwortet mit ${res.status}`);
  }
}

/**
 * Einstempeln — das gilt zugleich als Anmeldung fuer die Aufgabenliste.
 *
 * Achtung, bekannte Schwaeche des Altformats: `zt-open` ist ein einziger
 * JSON-Text, der komplett neu geschrieben wird. Stempeln zwei Personen im
 * selben Augenblick, kann eine der beiden Aenderungen verloren gehen. Deshalb
 * wird direkt danach nachgelesen und im Zweifel ein zweites Mal geschrieben.
 * Ganz beseitigen liesse sich das nur, indem man das Format aendert — und
 * genau das soll unberuehrt bleiben.
 */
export async function stempleEin(name: string): Promise<void> {
  const offen = await leseOffenRoh();
  if (offen[name]) return; // schon drin

  const eintrag = { start: jetztUhrzeit(), date: jetztDatum() };
  await schreibe("zt-open", { ...offen, [name]: eintrag });

  const kontrolle = await leseOffenRoh();
  if (!kontrolle[name]) {
    await schreibe("zt-open", { ...kontrolle, [name]: eintrag });
  }
}

/** Ausstempeln: Eintrag aus `zt-open` heraus und als Zeile in `zt-entries`. */
export async function stempleAus(name: string): Promise<void> {
  const offen = await leseOffenRoh();
  const start = offen[name];
  if (!start) return; // war gar nicht eingestempelt

  const [mitarbeiter, eintraege] = await Promise.all([
    holeMitarbeiter(),
    leseJson<Eintrag[]>("zt-entries", []),
  ]);
  const farbe = mitarbeiter.find((m) => m.name === name)?.color ?? "#888888";

  const zeile: Eintrag = {
    id: Date.now(),
    name,
    date: String(start.date ?? jetztDatum()),
    start: String(start.start ?? ""),
    end: jetztUhrzeit(),
    color: farbe,
  };

  // Erst die Zeile sichern, dann den offenen Eintrag entfernen. Diese
  // Reihenfolge ist die weniger schlimme: Bricht es dazwischen ab, steht die
  // Person doppelt da statt dass ihre Arbeitszeit verloren geht.
  await schreibe("zt-entries", [...(Array.isArray(eintraege) ? eintraege : []), zeile]);

  const rest = { ...(await leseOffenRoh()) };
  delete rest[name];
  await schreibe("zt-open", rest);
}

async function leseOffenRoh(): Promise<Record<string, { start?: string; date?: string }>> {
  const roh = await leseJson<Record<string, { start?: string; date?: string }>>(
    "zt-open",
    {},
  );
  return roh && typeof roh === "object" ? roh : {};
}

// ─── Mitarbeiter pflegen ────────────────────────────────────────────────────

/**
 * Dieselbe Farbreihe wie in der alten App — die Farben stehen mit im
 * Datensatz und tauchen dort in der Auswertung wieder auf.
 */
const FARBEN = [
  "#e74c3c", "#3498db", "#27ae60", "#e67e22", "#8e44ad",
  "#16a085", "#d35400", "#2c3e50", "#c0392b", "#2980b9",
];

export type MitarbeiterEingabe = {
  name: string;
  nr: number;
  lohnart: string;
};

/**
 * Legt eine Person an. Die Personalnummer wird mitgegeben statt
 * hochgezaehlt: Sie kommt aus der Lohnbuchhaltung, und die alte App konnte
 * sie nach dem Anlegen nicht mehr aendern.
 */
export async function legeMitarbeiterAn(daten: MitarbeiterEingabe): Promise<void> {
  const alle = await holeMitarbeiter();
  if (alle.some((m) => m.name.toLowerCase() === daten.name.toLowerCase())) {
    throw new Error("Diesen Namen gibt es schon.");
  }
  if (alle.some((m) => m.nr === daten.nr)) {
    throw new Error(`Die Nummer ${daten.nr} ist schon vergeben.`);
  }

  const neu: Mitarbeiter = {
    id: Date.now(),
    nr: daten.nr,
    name: daten.name,
    lohnart: daten.lohnart,
    color: FARBEN[alle.length % FARBEN.length],
  };
  await schreibe("zt-config", [...alle, neu]);
}

/**
 * Aendert Name, Nummer oder Lohnart.
 *
 * Achtung beim Namen: Er ist in `zt-open` und `zt-entries` der Schluessel.
 * Wird er geaendert, ziehen die bestehenden Zeitbuchungen mit um — sonst
 * verloere die Person ihre bisherigen Stunden.
 */
export async function aendereMitarbeiter(
  id: number,
  daten: MitarbeiterEingabe,
): Promise<void> {
  const alle = await holeMitarbeiter();
  const person = alle.find((m) => m.id === id);
  if (!person) throw new Error("Diese Person gibt es nicht mehr.");

  if (alle.some((m) => m.id !== id && m.name.toLowerCase() === daten.name.toLowerCase())) {
    throw new Error("Diesen Namen gibt es schon.");
  }
  if (alle.some((m) => m.id !== id && m.nr === daten.nr)) {
    throw new Error(`Die Nummer ${daten.nr} ist schon vergeben.`);
  }

  const alterName = person.name;
  await schreibe(
    "zt-config",
    alle.map((m) => (m.id === id ? { ...m, ...daten } : m)),
  );

  if (alterName !== daten.name) {
    const eintraege = await holeEintraege();
    await schreibe(
      "zt-entries",
      eintraege.map((e) => (e.name === alterName ? { ...e, name: daten.name } : e)),
    );

    const offen = await leseOffenRoh();
    if (offen[alterName]) {
      const { [alterName]: laufend, ...rest } = offen;
      await schreibe("zt-open", { ...rest, [daten.name]: laufend });
    }
  }
}

/**
 * Entfernt eine Person aus der Liste. Die bereits erfassten Zeiten bleiben
 * stehen — sie gehoeren in die Abrechnung, auch wenn jemand nicht mehr da ist.
 */
export async function entferneMitarbeiter(id: number): Promise<void> {
  const alle = await holeMitarbeiter();
  const person = alle.find((m) => m.id === id);
  if (!person) return;

  await schreibe(
    "zt-config",
    alle.filter((m) => m.id !== id),
  );

  // Eine laufende Stempelung waere sonst nicht mehr zu beenden.
  const offen = await leseOffenRoh();
  if (offen[person.name]) {
    const rest = { ...offen };
    delete rest[person.name];
    await schreibe("zt-open", rest);
  }
}

/** Naechste freie Personalnummer als Vorschlag. */
export function naechsteNummer(alle: Mitarbeiter[]): number {
  return alle.reduce((max, m) => Math.max(max, m.nr), 0) + 1;
}

/** Minuten zwischen zwei "HH:MM" — nie negativ, wie in der alten App. */
export function minutenZwischen(a: string, b: string): number {
  if (!a || !b) return 0;
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return Math.max(0, bh * 60 + bm - (ah * 60 + am));
}

/** "4:33" */
export function alsStunden(minuten: number): string {
  if (minuten <= 0) return "0:00";
  return `${Math.floor(minuten / 60)}:${String(minuten % 60).padStart(2, "0")}`;
}
