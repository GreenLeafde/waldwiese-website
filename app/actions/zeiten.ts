"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { loescheEintrag } from "@/lib/stempel";

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
