"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import {
  aendereMitarbeiter,
  entferneMitarbeiter,
  legeMitarbeiterAn,
  type MitarbeiterEingabe,
} from "@/lib/stempel";

export type StammState = { status: "idle" | "ok" | "error"; message: string };

/**
 * Pflege des Mitarbeiterstamms. Nur mit Admin-Passwort — hier haengen
 * Personalnummern und damit die Lohnabrechnung dran.
 */
function eingabeAus(formData: FormData): MitarbeiterEingabe | string {
  const name = String(formData.get("name") ?? "").replace(/\s+/g, " ").trim();
  if (!name) return "Der Name fehlt.";
  if (name.length > 60) return "Der Name ist zu lang.";

  const nrRoh = String(formData.get("nr") ?? "").trim();
  const nr = Number(nrRoh);
  if (!nrRoh || !Number.isInteger(nr) || nr <= 0 || nr > 99999) {
    return "Die Personalnummer muss eine ganze Zahl sein.";
  }

  const lohnart = String(formData.get("lohnart") ?? "").trim() || "0001";
  if (!/^[0-9]{1,8}$/.test(lohnart)) return "Die Lohnart darf nur Ziffern enthalten.";

  return { name, nr, lohnart };
}

export async function speichereMitarbeiterAction(
  _prev: StammState,
  formData: FormData,
): Promise<StammState> {
  await requireAdmin();

  const eingabe = eingabeAus(formData);
  if (typeof eingabe === "string") return { status: "error", message: eingabe };

  const idRoh = String(formData.get("id") ?? "").trim();

  try {
    if (idRoh) {
      await aendereMitarbeiter(Number(idRoh), eingabe);
    } else {
      await legeMitarbeiterAn(eingabe);
    }
  } catch (e) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "Nicht gespeichert.",
    };
  }

  revalidatePath("/admin/team");
  revalidatePath("/schicht");
  return {
    status: "ok",
    message: idRoh ? "Änderungen gespeichert." : `${eingabe.name} angelegt.`,
  };
}

export async function entferneMitarbeiterAction(
  _prev: StammState,
  formData: FormData,
): Promise<StammState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return { status: "error", message: "Person nicht gefunden." };

  try {
    await entferneMitarbeiter(id);
  } catch (e) {
    return {
      status: "error",
      message: e instanceof Error ? e.message : "Nicht entfernt.",
    };
  }

  revalidatePath("/admin/team");
  revalidatePath("/schicht");
  return { status: "ok", message: "Aus der Liste entfernt." };
}
