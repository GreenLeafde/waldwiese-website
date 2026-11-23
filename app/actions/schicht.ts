"use server";

import { revalidatePath } from "next/cache";
import {
  erledige,
  getAufgabe,
  nimmZurueck,
  schreibeKommentar,
  aufgabenFuerSchicht,
  offeneUebertraege,
  UEBERTRAG_TAGE,
  type Tagesaufgabe,
} from "@/lib/aufgaben";
import { MAX_BYTES, speichereNachweis, typErlaubt } from "@/lib/nachweise";
import {
  aktuelleSchicht,
  berlinDatum,
  tagDanach,
  tagDavor,
  wochentagVonDatum,
  type Schicht,
} from "@/lib/schichten";
import {
  holeEingestempelte,
  holeMitarbeiter,
  istEingestempelt,
  stempleAus,
  stempleEin,
} from "@/lib/stempel";

/**
 * Die Schicht-Ansicht haengt am QR-Code und ist bewusst ohne Anmeldung
 * erreichbar — wie die Stempeluhr heute. Diese Funktionen sind damit auch per
 * POST von aussen aufrufbar. Sie duerfen deshalb nur genau das koennen, was
 * die Ansicht braucht: an einem der letzten Tage abhaken, zuruecknehmen,
 * kommentieren. Nichts loeschen, nichts an Vorlagen aendern.
 */

export type SchichtState = { status: "idle" | "ok" | "error"; message: string };

const DATUM_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Erlaubt ist der Uebertragszeitraum plus morgen.
 *
 * Liegengebliebenes wird bis zu {@link UEBERTRAG_TAGE} Tage mitgenommen und
 * dort abgehakt, wo es herkommt — also muss auch so weit zurueck gebucht
 * werden duerfen. Nach vorn bleibt es bei einem Tag (Nachtschicht). Quer durch
 * den Kalender kann trotzdem niemand Haken setzen.
 */
function datumErlaubt(datum: string): boolean {
  if (!DATUM_RE.test(datum)) return false;
  if (!wochentagVonDatum(datum)) return false;

  const heute = berlinDatum(new Date());
  if (datum === tagDanach(heute)) return true;

  let d = heute;
  for (let i = 0; i <= UEBERTRAG_TAGE; i++) {
    if (datum === d) return true;
    d = tagDavor(d);
  }
  return false;
}

function schichtAus(wert: FormDataEntryValue | null): Schicht | null {
  const s = String(wert ?? "");
  return s === "frueh" || s === "spaet" ? s : null;
}

/** Namen kurz halten und Zeilenumbrueche rauswerfen. */
function nameAus(formData: FormData): string | null {
  const roh = String(formData.get("name") ?? "").replace(/\s+/g, " ").trim();
  return roh ? roh.slice(0, 60) : null;
}

export async function hakeAbAction(formData: FormData): Promise<void> {
  const id = String(formData.get("aufgabeId") ?? "").trim();
  const datum = String(formData.get("datum") ?? "").trim();
  const schicht = schichtAus(formData.get("schicht"));
  const zurueck = String(formData.get("zurueck") ?? "") === "1";
  const name = nameAus(formData);

  if (!id || !schicht || !datumErlaubt(datum)) return;

  // Abhaken darf nur, wer gerade im Dienst ist. Die Ansicht blendet das
  // ohnehin aus — hier zaehlt, dass auch ein direkter Aufruf scheitert.
  if (!name || !(await istEingestempelt(name))) return;

  if (zurueck) {
    await nimmZurueck(id, datum, schicht);
  } else {
    await erledige(id, datum, schicht, name);
  }
  revalidatePath("/schicht");
}

/**
 * Abhaken mit Nachweis — Foto oder Unterschrift.
 *
 * Bewusst ein eigener Weg: Bei diesen Aufgaben darf nicht ohne Bild abgehakt
 * werden, sonst waere die Nachweispflicht mit einer Wischbewegung umgangen.
 */
export async function hakeMitNachweisAction(
  _prev: SchichtState,
  formData: FormData,
): Promise<SchichtState> {
  const id = String(formData.get("aufgabeId") ?? "").trim();
  const datum = String(formData.get("datum") ?? "").trim();
  const schicht = schichtAus(formData.get("schicht"));
  const name = nameAus(formData);

  if (!id || !schicht || !datumErlaubt(datum)) {
    return { status: "error", message: "Angaben unvollständig." };
  }
  if (!name || !(await istEingestempelt(name))) {
    return { status: "error", message: "Nur wer eingestempelt ist, kann abhaken." };
  }

  // Was verlangt die Aufgabe wirklich? Nicht dem Formular glauben.
  const aufgabe = await getAufgabe(id);
  if (!aufgabe) return { status: "error", message: "Aufgabe nicht gefunden." };
  if (aufgabe.nachweis === "keiner") {
    return { status: "error", message: "Diese Aufgabe braucht keinen Nachweis." };
  }

  const datei = formData.get("nachweis");
  if (!(datei instanceof File) || datei.size === 0) {
    return {
      status: "error",
      message:
        aufgabe.nachweis === "foto"
          ? "Es fehlt noch das Foto."
          : "Es fehlt noch die Unterschrift.",
    };
  }
  if (datei.size > MAX_BYTES) {
    return { status: "error", message: "Das Bild ist zu groß." };
  }
  if (!typErlaubt(datei.type)) {
    return { status: "error", message: "Dieses Dateiformat geht nicht." };
  }

  try {
    const daten = new Uint8Array(await datei.arrayBuffer());
    const pfad = await speichereNachweis(aufgabe.nachweis, datei.type, daten);
    await erledige(id, datum, schicht, name, pfad);
  } catch (e) {
    return {
      status: "error",
      message:
        e instanceof Error ? `Nicht gespeichert: ${e.message}` : "Nicht gespeichert.",
    };
  }

  revalidatePath("/schicht");
  return { status: "ok", message: "Erledigt und festgehalten." };
}

// ─── Schicht starten und beenden ────────────────────────────────────────────

/**
 * Das Einstempeln ist die Anmeldung: danach sieht die Person ihre Aufgaben.
 * Der Name muss aus dem gepflegten Mitarbeiterstamm kommen — frei getippte
 * Namen gibt es hier bewusst nicht.
 */
export async function starteSchichtAction(
  _prev: SchichtState,
  formData: FormData,
): Promise<SchichtState> {
  const name = nameAus(formData);
  if (!name) return { status: "error", message: "Bitte zuerst den Namen wählen." };

  try {
    const stamm = await holeMitarbeiter();
    if (!stamm.some((m) => m.name === name)) {
      return { status: "error", message: "Diesen Namen gibt es in der Zeiterfassung nicht." };
    }
    if (await istEingestempelt(name)) {
      return { status: "ok", message: `${name} ist bereits im Dienst.` };
    }
    await stempleEin(name);
  } catch (e) {
    return {
      status: "error",
      message:
        e instanceof Error ? `Nicht gestempelt: ${e.message}` : "Nicht gestempelt.",
    };
  }

  revalidatePath("/schicht");
  return { status: "ok", message: `Schicht gestartet — willkommen, ${name}.` };
}

export async function beendeSchichtAction(
  _prev: SchichtState,
  formData: FormData,
): Promise<SchichtState> {
  const name = nameAus(formData);
  if (!name) return { status: "error", message: "Kein Name angegeben." };

  try {
    if (!(await istEingestempelt(name))) {
      return { status: "error", message: `${name} ist gerade nicht eingestempelt.` };
    }
    await stempleAus(name);
  } catch (e) {
    return {
      status: "error",
      message:
        e instanceof Error ? `Nicht gestempelt: ${e.message}` : "Nicht gestempelt.",
    };
  }

  revalidatePath("/schicht");
  return { status: "ok", message: `Schicht beendet. Schönen Feierabend, ${name}.` };
}

/** Wer ist gerade im Dienst — fuer das regelmaessige Nachsehen im Browser. */
export async function holeDienstAction(): Promise<
  { name: string; seit: string; datum: string }[]
> {
  try {
    return await holeEingestempelte();
  } catch {
    return [];
  }
}

export async function kommentiereAction(
  _prev: SchichtState,
  formData: FormData,
): Promise<SchichtState> {
  const id = String(formData.get("aufgabeId") ?? "").trim();
  const inhalt = String(formData.get("inhalt") ?? "").trim();

  if (!id) return { status: "error", message: "Aufgabe nicht gefunden." };
  if (!inhalt) return { status: "error", message: "Der Kommentar ist leer." };
  if (inhalt.length > 1000) {
    return { status: "error", message: "Der Kommentar ist zu lang (höchstens 1000 Zeichen)." };
  }

  try {
    await schreibeKommentar(id, nameAus(formData), inhalt);
  } catch {
    return { status: "error", message: "Nicht gespeichert — bitte nochmal versuchen." };
  }

  revalidatePath("/schicht");
  return { status: "ok", message: "Kommentar gespeichert." };
}

/**
 * Frischer Stand fuer die Ansicht — mehrere Leute arbeiten gleichzeitig an
 * derselben Liste, und niemand soll einen Haken doppelt setzen, weil sein
 * Tablet noch den alten Stand zeigt.
 */
export async function holeStandAction(
  datum: string,
  schicht: Schicht,
): Promise<{ aufgaben: Tagesaufgabe[]; uebertrag: Tagesaufgabe[] }> {
  const s = schichtAus(schicht);
  if (!datumErlaubt(datum) || !s) return { aufgaben: [], uebertrag: [] };

  const [aufgaben, uebertrag] = await Promise.all([
    aufgabenFuerSchicht(datum, s),
    offeneUebertraege(datum, s),
  ]);
  return { aufgaben, uebertrag };
}

/** Welche Schicht laeuft jetzt — vom Server, damit die Tablet-Uhr egal ist. */
export async function aktuelleSchichtAction(): Promise<{
  datum: string;
  schicht: Schicht;
}> {
  return aktuelleSchicht(new Date());
}
