"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import {
  aendereEintrag,
  beendeOffeneStempelung,
  loescheEintrag,
  minutenZwischen,
} from "@/lib/stempel";
import { sendeStundenMail, stundenEmpfaenger } from "@/lib/stunden-mail";

export type ZeitState = { status: "idle" | "ok" | "error"; message: string };

/**
 * Eine Zeitbuchung entfernen. Nur mit Admin-Passwort — hier haengt die
 * Lohnabrechnung dran.
 */
export async function loescheZeitAction(
  _prev: ZeitState,
  formData: FormData,
): Promise<ZeitState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id) || id <= 0) {
    return { status: "error", message: "Eintrag nicht gefunden." };
  }

  try {
    await loescheEintrag(id);
  } catch (e) {
    return {
      status: "error",
      message:
        e instanceof Error ? `Nicht gelöscht: ${e.message}` : "Nicht gelöscht.",
    };
  }

  revalidatePath("/admin/zeiten");
  return { status: "ok", message: "Eintrag gelöscht." };
}

const UHRZEIT = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Ein Tippfehler bei der Uhrzeit wird über Mitternacht schnell zur 23-Stunden-Schicht. */
const LAENGSTE_SCHICHT_MIN = 16 * 60;

function zeitFehler(start: string, end: string): string | null {
  if (start === end) return "Beginn und Ende sind gleich.";
  if (minutenZwischen(start, end) > LAENGSTE_SCHICHT_MIN) {
    return `Von ${start} bis ${end} wären über 16 Stunden. Bitte die Uhrzeiten prüfen.`;
  }
  return null;
}

/** Eine falsche Stempelung korrigieren. Nur mit Admin-Passwort. */
export async function aendereZeitAction(
  _prev: ZeitState,
  formData: FormData,
): Promise<ZeitState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const date = String(formData.get("date") ?? "");
  const start = String(formData.get("start") ?? "");
  const end = String(formData.get("end") ?? "");

  if (!Number.isFinite(id) || id <= 0) {
    return { status: "error", message: "Eintrag nicht gefunden." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !UHRZEIT.test(start) || !UHRZEIT.test(end)) {
    return { status: "error", message: "Bitte Tag, Beginn und Ende angeben." };
  }
  const fehlerZeit = zeitFehler(start, end);
  if (fehlerZeit) return { status: "error", message: fehlerZeit };

  try {
    await aendereEintrag(id, { date, start, end });
  } catch (e) {
    return {
      status: "error",
      message: e instanceof Error ? `Nicht gespeichert: ${e.message}` : "Nicht gespeichert.",
    };
  }

  revalidatePath("/admin/zeiten");
  return { status: "ok", message: "Gespeichert." };
}

/** Eine vergessene Stempelung mit einer Uhrzeit beenden. */
export async function beendeStempelungAction(
  _prev: ZeitState,
  formData: FormData,
): Promise<ZeitState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "");
  const start = String(formData.get("start") ?? "");
  const end = String(formData.get("end") ?? "");

  if (!name || !UHRZEIT.test(end)) {
    return { status: "error", message: "Bitte die Uhrzeit angeben." };
  }
  const fehlerZeit = zeitFehler(start, end);
  if (fehlerZeit) return { status: "error", message: fehlerZeit };

  try {
    await beendeOffeneStempelung(name, end);
  } catch (e) {
    return {
      status: "error",
      message: e instanceof Error ? `Nicht gespeichert: ${e.message}` : "Nicht gespeichert.",
    };
  }

  revalidatePath("/admin/zeiten");
  return { status: "ok", message: "Gespeichert." };
}

/**
 * Die Monatsübersicht sofort verschicken — sonst geht sie automatisch am 25.
 * raus. Gedacht für den Fall, dass sie noch einmal gebraucht wird oder man
 * einmal sehen will, was ankommt.
 *
 * `erzwingen` ist hier bewusst gesetzt: Wer den Knopf drückt, will die Mail
 * auch dann, wenn sie diesen Monat schon einmal rausging.
 */
export async function sendeStundenMailAction(
  _prev: ZeitState,
  formData: FormData,
): Promise<ZeitState> {
  await requireAdmin();

  const monat = String(formData.get("monat") ?? "").trim();
  if (!/^\d{4}-\d{2}$/.test(monat)) {
    return { status: "error", message: "Kein gültiger Monat." };
  }

  const ergebnis = await sendeStundenMail(monat, true);
  revalidatePath("/admin/zeiten");

  if (ergebnis.status === "fehler") {
    return { status: "error", message: `Nicht versendet: ${ergebnis.meldung}` };
  }
  return {
    status: "ok",
    message: `Verschickt an ${stundenEmpfaenger()}.`,
  };
}
