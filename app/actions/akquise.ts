"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import {
  addNotiz,
  deleteLead,
  entwuerfeFuerNeue,
  importLeads,
  listEvents,
  saveLead,
  sendeAntwort,
  sendeErstkontakt,
  sendeNachfass,
  sendeStapel,
  setStatus,
  vermerkeAnruf,
  type LeadEingabe,
} from "@/lib/akquise";
import {
  STATUS,
  TYPEN,
  type LeadEvent,
  type Status,
  type Typ,
} from "@/lib/akquise-texte";

/**
 * Server-Aktionen fuer /admin/akquise. Jede prueft den Login selbst: eine
 * Server-Aktion ist per POST direkt erreichbar, nicht nur ueber die Seite.
 */

export type Ergebnis = { ok: boolean; message: string };

const fehler = (e: unknown): Ergebnis => ({
  ok: false,
  message: e instanceof Error ? e.message : "Die Datenbank hat nicht geantwortet.",
});

const alsStatus = (s: string): Status | undefined =>
  STATUS.includes(s as Status) ? (s as Status) : undefined;
const alsTyp = (s: string): Typ | "" => (TYPEN.includes(s as Typ) ? (s as Typ) : "");

function frisch() {
  revalidatePath("/admin/akquise");
}

export async function speichereLeadAction(
  id: string | null,
  eingabe: LeadEingabe,
): Promise<Ergebnis & { id?: string }> {
  await requireAdmin();
  try {
    const r = await saveLead(id, eingabe);
    if (!r.ok) return { ok: false, message: r.grund };
    frisch();
    return { ok: true, message: id ? "Gespeichert." : "Kontakt angelegt.", id: r.id };
  } catch (e) {
    return fehler(e);
  }
}

export async function loescheLeadAction(id: string): Promise<Ergebnis> {
  await requireAdmin();
  try {
    await deleteLead(id);
    frisch();
    return { ok: true, message: "Kontakt gelöscht." };
  } catch (e) {
    return fehler(e);
  }
}

export async function importiereAction(text: string, typ: string): Promise<Ergebnis> {
  await requireAdmin();
  try {
    const r = await importLeads(text, alsTyp(typ) || "firma");
    frisch();
    return {
      ok: true,
      message:
        `${r.neu} übernommen` +
        (r.uebersprungen
          ? `, ${r.uebersprungen} übersprungen (doppelte Adresse, ungültige Adresse oder leere Zeile)`
          : "") +
        ".",
    };
  } catch (e) {
    return fehler(e);
  }
}

export async function entwuerfeFuerNeueAction(): Promise<Ergebnis> {
  await requireAdmin();
  try {
    const n = await entwuerfeFuerNeue();
    frisch();
    return {
      ok: true,
      message: n
        ? `${n} Entwürfe geschrieben. Bitte durchlesen, bevor sie rausgehen.`
        : "Keine neuen Kontakte mit E-Mail-Adresse ohne Entwurf.",
    };
  } catch (e) {
    return fehler(e);
  }
}

/**
 * Speichert erst, was im Formular steht, und sendet dann. So geht immer der
 * Text raus, der gerade zu sehen ist.
 */
export async function sendeAction(
  id: string,
  art: "erst" | "antwort" | "nachfass",
  eingabe: LeadEingabe,
): Promise<Ergebnis> {
  await requireAdmin();
  try {
    const gespeichert = await saveLead(id, eingabe);
    if (!gespeichert.ok) return { ok: false, message: gespeichert.grund };
    const r =
      art === "erst"
        ? await sendeErstkontakt(id)
        : art === "nachfass"
          ? await sendeNachfass(id)
          : await sendeAntwort(id);
    frisch();
    return r.ok
      ? { ok: true, message: "Gesendet." }
      : { ok: false, message: `Nicht gesendet: ${r.grund}` };
  } catch (e) {
    return fehler(e);
  }
}

/** Aus der Arbeitsliste: Nachfass-Mail mit einem Klick. */
export async function nachfassSendenAction(id: string): Promise<Ergebnis> {
  await requireAdmin();
  try {
    const r = await sendeNachfass(id);
    frisch();
    return r.ok
      ? { ok: true, message: "Nachfass-Mail raus." }
      : { ok: false, message: `Nicht gesendet: ${r.grund}` };
  } catch (e) {
    return fehler(e);
  }
}

export type StapelErgebnis = Ergebnis & {
  gesendet: number;
  offen: number;
  limitErreicht: boolean;
  fehler: { firma: string; grund: string }[];
};

export async function stapelAction(anzahl: number, typ: string): Promise<StapelErgebnis> {
  await requireAdmin();
  try {
    const r = await sendeStapel(Number(anzahl) || 10, alsTyp(typ));
    frisch();
    const nicht = r.fehler.length
      ? ` ${r.fehler.length} nicht: ${r.fehler.map((f) => `${f.firma} (${f.grund})`).join("; ")}`
      : "";
    return {
      ok: r.fehler.length === 0,
      message: `${r.gesendet} gesendet, ${r.offen} warten noch.${nicht}`,
      ...r,
    };
  } catch (e) {
    return { ...fehler(e), gesendet: 0, offen: 0, limitErreicht: false, fehler: [] };
  }
}

export async function statusAction(
  id: string,
  status: string,
  tage?: number,
): Promise<Ergebnis> {
  await requireAdmin();
  const s = alsStatus(status);
  if (!s) return { ok: false, message: "Unbekannter Stand." };
  try {
    await setStatus(id, s, tage);
    frisch();
    return { ok: true, message: "Stand geändert." };
  } catch (e) {
    return fehler(e);
  }
}

export async function anrufAction(input: {
  id: string;
  ergebnis: string;
  status: string;
  tage: number;
}): Promise<Ergebnis> {
  await requireAdmin();
  try {
    const r = await vermerkeAnruf({
      id: input.id,
      ergebnis: input.ergebnis,
      status: alsStatus(input.status),
      wiedervorlageTage: Number(input.tage) || 0,
    });
    frisch();
    return r.ok
      ? { ok: true, message: "Anruf vermerkt." }
      : { ok: false, message: r.grund ?? "Nicht gespeichert." };
  } catch (e) {
    return fehler(e);
  }
}

export async function notizAction(id: string, text: string): Promise<Ergebnis> {
  await requireAdmin();
  if (!text.trim()) return { ok: false, message: "Der Text fehlt." };
  try {
    await addNotiz(id, text);
    frisch();
    return { ok: true, message: "Notiert." };
  } catch (e) {
    return fehler(e);
  }
}

export async function verlaufAction(id: string): Promise<LeadEvent[]> {
  await requireAdmin();
  try {
    return await listEvents(id);
  } catch {
    return [];
  }
}
