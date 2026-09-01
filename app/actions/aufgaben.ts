"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import {
  createAufgabe,
  setAktiv,
  updateAufgabe,
  verschiebe,
  istGueltigerSlot,
  wochentagVonDatum,
  WOCHENTAGE,
  type AufgabeEingabe,
  type Nachweis,
  type Rhythmus,
  type SchichtSlot,
  type Schicht,
  type Wochentag,
} from "@/lib/aufgaben";

export type AufgabeState = {
  status: "idle" | "ok" | "error";
  message: string;
};

const NACHWEISE: Nachweis[] = ["keiner", "foto", "unterschrift"];
const RHYTHMEN: Rhythmus[] = ["woechentlich", "einmalig"];

/**
 * Die Schicht-Kaestchen kommen als "5-spaet". Alles, was sich nicht sauber
 * zerlegen laesst oder gar keine Schicht ist (z. B. "Mo spaet"), faellt raus.
 */
function slotsAus(formData: FormData): SchichtSlot[] {
  const roh = formData.getAll("slot").map(String);
  const slots: SchichtSlot[] = [];
  for (const wert of roh) {
    const [tag, schicht] = wert.split("-");
    const wochentag = Number(tag) as Wochentag;
    if (!Number.isInteger(wochentag)) continue;
    if (schicht !== "frueh" && schicht !== "spaet") continue;
    const slot: SchichtSlot = { wochentag, schicht: schicht as Schicht };
    if (istGueltigerSlot(slot)) slots.push(slot);
  }
  return slots;
}

/** Liest und prueft das Formular. Gibt bei einem Fehler dessen Text zurueck. */
function eingabeAus(formData: FormData): AufgabeEingabe | string {
  const titel = String(formData.get("titel") ?? "").trim();
  if (!titel) return "Die Aufgabe braucht einen Titel.";
  if (titel.length > 120) return "Der Titel ist zu lang (höchstens 120 Zeichen).";

  const nachweis = String(formData.get("nachweis") ?? "keiner") as Nachweis;
  if (!NACHWEISE.includes(nachweis)) return "Unbekannte Art von Nachweis.";

  const rhythmus = String(formData.get("rhythmus") ?? "woechentlich") as Rhythmus;
  if (!RHYTHMEN.includes(rhythmus)) return "Unbekannter Rhythmus.";

  // Einmalige Aufgaben haengen an einem Datum — der Wochentag ergibt sich
  // daraus, gewaehlt wird nur noch frueh oder spaet.
  const datum = String(formData.get("datum") ?? "").trim();
  let schichten: SchichtSlot[];

  if (rhythmus === "einmalig") {
    const wochentag = wochentagVonDatum(datum);
    if (!wochentag) return "Für eine einmalige Aufgabe fehlt ein gültiges Datum.";

    const schicht = String(formData.get("schichtEinmalig") ?? "frueh");
    if (schicht !== "frueh" && schicht !== "spaet") return "Unbekannte Schicht.";

    const slot: SchichtSlot = { wochentag, schicht: schicht as Schicht };
    if (!istGueltigerSlot(slot)) {
      const tag = WOCHENTAGE.find((w) => w.wert === wochentag)?.lang ?? "An diesem Tag";
      return `${tag}s gibt es keine Spätschicht — wähle die Frühschicht oder ein anderes Datum.`;
    }
    schichten = [slot];
  } else {
    schichten = slotsAus(formData);
    if (schichten.length === 0) {
      return "Wähle mindestens eine Schicht aus, sonst taucht die Aufgabe nirgends auf.";
    }
  }

  return {
    titel,
    beschreibung: String(formData.get("beschreibung") ?? "").trim() || null,
    bereich: String(formData.get("bereich") ?? "").trim() || null,
    nachweis,
    rhythmus,
    datum: rhythmus === "einmalig" ? datum : null,
    schichten,
  };
}

export async function speichereAufgabeAction(
  _prev: AufgabeState,
  formData: FormData,
): Promise<AufgabeState> {
  await requireAdmin();

  const eingabe = eingabeAus(formData);
  if (typeof eingabe === "string") {
    return { status: "error", message: eingabe };
  }

  const id = String(formData.get("id") ?? "").trim();
  try {
    if (id) {
      await updateAufgabe(id, eingabe);
    } else {
      await createAufgabe(eingabe);
    }
  } catch (e) {
    return {
      status: "error",
      message:
        e instanceof Error
          ? `Nicht gespeichert: ${e.message}`
          : "Nicht gespeichert — die Datenbank hat nicht geantwortet.",
    };
  }

  revalidatePath("/admin/aufgaben");
  return {
    status: "ok",
    message: id ? "Änderungen gespeichert." : `„${eingabe.titel}" angelegt.`,
  };
}

export async function stilllegenAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const aktiv = String(formData.get("aktiv") ?? "") === "1";
  if (id) await setAktiv(id, aktiv);
  revalidatePath("/admin/aufgaben");
}

export async function verschiebeAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const richtung = String(formData.get("richtung") ?? "");
  if (id && (richtung === "hoch" || richtung === "runter")) {
    await verschiebe(id, richtung);
  }
  revalidatePath("/admin/aufgaben");
}
