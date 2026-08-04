"use server";

/**
 * Aktionen des Team-Bereichs: Anmelden, Abmelden, Ein- und Ausstempeln.
 *
 * Geschrieben wird in die Zeiterfassung des Hotel-Backends (staff-db.ts) —
 * dieser Bereich ist nur die Oberflaeche fuer Wald & Wiese, nicht ein zweites
 * System.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  STAFF_COOKIE,
  STAFF_COOKIE_MAX_AGE,
  createStaffToken,
  istLeitung,
  requireStaff,
} from "@/lib/staff-auth";
import {
  BEREICHE,
  changePin,
  CodeFalsch,
  deleteShift,
  LoginGesperrt,
  saveAvailability,
  saveShift,
  saveWeekTarget,
  startSession,
  staffConfigured,
  stopSession,
  verifyStaffLogin,
  type AvailabilityEntry,
} from "@/lib/staff-db";
import { weekDays } from "@/lib/work-time";

export type TeamLoginState = { error: string };

export async function teamLoginAction(
  _prev: TeamLoginState,
  formData: FormData,
): Promise<TeamLoginState> {
  if (!staffConfigured()) {
    return {
      error:
        "Der Team-Bereich ist noch nicht mit der Zeiterfassung verbunden (NATURLICH_API_URL / NATURLICH_PARTNER_KEY fehlen).",
    };
  }

  const userId = String(formData.get("userId") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  if (!userId) return { error: "Bitte zuerst den eigenen Namen antippen." };
  if (!password) return { error: "Bitte den Code eingeben." };

  // Geprueft wird drueben: dort liegen die Codes, dort wird auch entschieden,
  // ob die Person ueberhaupt zu Wald & Wiese gehoert.
  let user;
  try {
    user = await verifyStaffLogin(userId, password);
  } catch (e) {
    if (e instanceof LoginGesperrt) {
      return { error: "Zu viele Versuche. Bitte in ein paar Minuten noch einmal." };
    }
    return { error: "Die Zeiterfassung ist gerade nicht erreichbar. Bitte später noch einmal." };
  }

  if (!user) {
    // Brute-Force ausbremsen.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "E-Mail oder Code stimmt nicht." };
  }

  const store = await cookies();
  store.set(
    STAFF_COOKIE,
    createStaffToken({ id: user.id, name: user.name, email: user.email, role: user.role }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: STAFF_COOKIE_MAX_AGE,
    },
  );

  redirect("/team");
}

export async function teamLogoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(STAFF_COOKIE);
  redirect("/team/login");
}

export type ClockState = { error: string };

/**
 * Stempeln. Die Richtung steht im Formularfeld "action" ('start' | 'stop') —
 * so genuegt eine Aktion fuer beide Knoepfe.
 */
export async function clockAction(
  _prev: ClockState,
  formData: FormData,
): Promise<ClockState> {
  const staff = await requireStaff();
  const dir = String(formData.get("action") ?? "start");

  try {
    if (dir === "stop") await stopSession(staff.id);
    else await startSession(staff.id);
  } catch (e) {
    return {
      error:
        e instanceof Error
          ? e.message
          : dir === "stop"
            ? "Ausstempeln hat nicht geklappt."
            : "Einstempeln hat nicht geklappt.",
    };
  }

  revalidatePath("/team");
  return { error: "" };
}

export type ShiftState = { error: string; saved: boolean };

/**
 * Schicht planen oder entfernen. Nur die Leitung — geprueft wird hier UND
 * im Hotel-System, damit ein Fehler an einer Stelle nicht reicht.
 */
export async function saveShiftAction(
  _prev: ShiftState,
  formData: FormData,
): Promise<ShiftState> {
  const staff = await requireStaff();
  if (!istLeitung(staff)) return { error: "Planen darf nur die Leitung.", saved: false };

  const shiftId = String(formData.get("shiftId") ?? "").trim();
  const loeschen = String(formData.get("loeschen") ?? "") === "1";

  try {
    if (loeschen) {
      if (!shiftId) return { error: "Diese Schicht gibt es nicht mehr.", saved: false };
      await deleteShift(staff.id, shiftId);
    } else {
      const type = String(formData.get("type") ?? "service");
      const mitZeit = BEREICHE.find((b) => b.value === type)?.mitZeit ?? true;
      const start = String(formData.get("start") ?? "").trim();
      const end = String(formData.get("end") ?? "").trim();
      if (mitZeit && (!start || !end)) {
        return { error: "Bitte Von- und Bis-Zeit angeben.", saved: false };
      }
      await saveShift(staff.id, {
        id: shiftId || undefined,
        staffId: String(formData.get("staffId") ?? ""),
        date: String(formData.get("date") ?? ""),
        start,
        end,
        type,
        notes: String(formData.get("notes") ?? ""),
      });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Speichern hat nicht geklappt.", saved: false };
  }

  revalidatePath("/team/plan");
  revalidatePath("/team");
  return { error: "", saved: true };
}

export type PinState = { error: string; saved: boolean };

/** Eigenen Code aendern (bisheriger Code wird geprueft). */
export async function changePinAction(
  _prev: PinState,
  formData: FormData,
): Promise<PinState> {
  const staff = await requireStaff();
  const alt = String(formData.get("alt") ?? "").trim();
  const neu = String(formData.get("neu") ?? "").trim();
  const neu2 = String(formData.get("neu2") ?? "").trim();

  if (!alt || !neu) return { error: "Bitte beide Felder ausfüllen.", saved: false };
  if (neu !== neu2) return { error: "Die beiden neuen Codes sind nicht gleich.", saved: false };
  if (!/^\d{4,8}$/.test(neu)) return { error: "Der neue Code muss 4 bis 8 Ziffern haben.", saved: false };
  if (/^(\d)\1+$/.test(neu)) return { error: "Bitte keinen Code aus lauter gleichen Ziffern.", saved: false };

  try {
    await changePin(staff.id, alt, neu);
  } catch (e) {
    if (e instanceof CodeFalsch) return { error: "Der bisherige Code stimmt nicht.", saved: false };
    if (e instanceof LoginGesperrt) {
      return { error: "Zu viele Versuche. Bitte in ein paar Minuten noch einmal.", saved: false };
    }
    return { error: "Ändern hat nicht geklappt. Bitte später noch einmal.", saved: false };
  }

  return { error: "", saved: true };
}

export type AvailabilityState = { error: string; saved: boolean };

/**
 * Verfuegbarkeit einer Woche speichern — das digitale Gegenstueck zum
 * Papier-Zettel. Pro Tag kommt eine Auswahl ("nicht möglich", "nur bis",
 * "nur von–bis", "nur ab", "ganztägig flexibel") und je nach Auswahl eine
 * oder zwei Uhrzeiten. Dazu die gewuenschten Stunden dieser Woche.
 */
export async function saveAvailabilityAction(
  _prev: AvailabilityState,
  formData: FormData,
): Promise<AvailabilityState> {
  const staff = await requireStaff();
  const weekStart = String(formData.get("weekStart") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
    return { error: "Die Woche wurde nicht erkannt.", saved: false };
  }

  const entries: AvailabilityEntry[] = weekDays(weekStart).map((date) => ({
    date,
    wishType: String(formData.get(`typ-${date}`) ?? ""),
    fromTime: String(formData.get(`von-${date}`) ?? "") || null,
    toTime: String(formData.get(`bis-${date}`) ?? "") || null,
    notes: String(formData.get(`notiz-${date}`) ?? "") || null,
  }));

  // Fehlende Uhrzeit dort abfangen, wo sie zur Auswahl gehoert — sonst
  // stuende spaeter "nur bis" ohne Zeit im Plan.
  for (const e of entries) {
    const braucht =
      (e.wishType === "nur_bis" && !e.toTime) ||
      (e.wishType === "nur_ab" && !e.fromTime) ||
      (e.wishType === "nur_von_bis" && (!e.fromTime || !e.toTime));
    if (braucht) {
      return { error: "Bitte bei den Zeitangaben auch die Uhrzeit eintragen.", saved: false };
    }
  }

  const hoursRaw = String(formData.get("stunden") ?? "").trim();
  const hours = hoursRaw === "" ? null : Number(hoursRaw.replace(",", "."));
  if (hours !== null && (!Number.isFinite(hours) || hours < 0 || hours > 80)) {
    return { error: "Die Wochenstunden müssen zwischen 0 und 80 liegen.", saved: false };
  }

  try {
    await saveAvailability(staff.id, entries);
    await saveWeekTarget(staff.id, weekStart, hours);
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Speichern hat nicht geklappt.",
      saved: false,
    };
  }

  revalidatePath("/team/verfuegbarkeit");
  return { error: "", saved: true };
}
