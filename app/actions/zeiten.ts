"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { loescheEintrag } from "@/lib/stempel";
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
