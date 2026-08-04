/**
 * Personal-Daten (Mitarbeiter, Arbeitszeiten) aus dem bestehenden System des
 * Hotels — Wald & Wiese bekommt eine eigene Oberflaeche, aber KEINE zweite
 * Zeiterfassung.
 *
 * Warum so: Stempeln, Zeit-Rechnung und Auswertung existieren im Hotel-Backend
 * bereits. Wuerden wir das hier nachbauen, gaebe es zwei Wahrheiten und zwei
 * Abrechnungen. Stattdessen laeuft alles ueber einen schmalen Anschluss dort
 * (/api/partner/zeiten), der ausschliesslich Personal- und Zeitdaten des
 * Bereichs 'gastro' herausgibt — kein Zugriff auf Gaeste, Buchungen oder
 * Rechnungen, auch wenn der Schluessel einmal verloren geht.
 *
 * Wald & Wiese braucht dafuer KEINE eigene Datenbank-Anbindung: die eigene
 * Turso-Datenbank (ueber Vercel) bleibt fuer Website, Newsletter und
 * Auswertungen zustaendig.
 *
 * NUR server-seitig importieren.
 *
 * Env:
 *   NATURLICH_API_URL      — z. B. https://das-naturlich.de
 *   NATURLICH_PARTNER_KEY  — Schluessel fuer den Anschluss (dort PARTNER_GASTRO_KEY)
 */

export type Staff = {
  id: string;
  email: string;
  name: string;
  role: string | null;
  active: boolean;
  department: string | null;
  employment_type: string | null;
  weekly_hours_target: number | null;
};

export type WorkSession = {
  id: string;
  user_id: string | null;
  user_name: string;
  started_at: string;
  ended_at: string | null;
  department: string | null;
  notes: string | null;
};

const env = (key: string): string => (process.env[key] ?? "").trim();

/** true, wenn der Anschluss eingerichtet ist (sonst degradieren die Seiten freundlich). */
export function staffConfigured(): boolean {
  return Boolean(env("NATURLICH_API_URL") && env("NATURLICH_PARTNER_KEY"));
}

function endpoint(query = ""): string {
  const base = env("NATURLICH_API_URL").replace(/\/+$/, "");
  return `${base}/api/partner/zeiten${query}`;
}

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  if (!staffConfigured()) throw new Error("Die Zeiterfassung ist noch nicht verbunden.");

  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "x-partner-key": env("NATURLICH_PARTNER_KEY"),
      ...(init?.headers || {}),
    },
  });

  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    // 401 vom Login ist ein normaler Fall und wird vom Aufrufer behandelt.
    throw Object.assign(new Error(data?.error || `Zeiterfassung antwortet mit ${res.status}`), {
      status: res.status,
    });
  }
  return data as T;
}

// ─── Mitarbeiter ──────────────────────────────────────────────────────────

/** Alle aktiven Personen von Wald & Wiese. */
export async function listStaff(): Promise<Staff[]> {
  const { staff } = await call<{ staff: Staff[] }>(endpoint("?resource=staff"));
  return staff || [];
}

/** Namen fuer die Anmeldeseite — bewusst ohne E-Mail-Adressen. */
export async function listLoginNames(): Promise<{ id: string; name: string }[]> {
  const { staff } = await call<{ staff: { id: string; name: string }[] }>(
    endpoint("?resource=login-list"),
  );
  return staff || [];
}

export class LoginGesperrt extends Error {}

/**
 * Anmeldung pruefen. Der Code wird drueben geprueft — dieses Projekt kennt
 * weder Codes noch das Verfahren dahinter.
 * Gibt null zurueck, wenn der Code nicht stimmt; wirft LoginGesperrt, wenn zu
 * oft falsch geraten wurde.
 */
export async function verifyStaffLogin(userId: string, password: string): Promise<Staff | null> {
  try {
    const { user } = await call<{ ok: boolean; user: Staff }>(endpoint(), {
      method: "POST",
      body: JSON.stringify({ action: "login", userId, password }),
    });
    return user ?? null;
  } catch (e) {
    const status = (e as { status?: number }).status;
    if (status === 429) throw new LoginGesperrt();
    if (status === 401) return null;
    throw e;
  }
}

// ─── Stempeln ─────────────────────────────────────────────────────────────

/** Laufende (nicht beendete) Sitzung einer Person, sonst null. */
export async function openSession(userId: string): Promise<WorkSession | null> {
  const { session } = await call<{ session: WorkSession | null }>(
    endpoint(`?resource=open-session&userId=${encodeURIComponent(userId)}`),
  );
  return session ?? null;
}

/** Einstempeln. Laeuft bereits eine Sitzung, bleibt sie unveraendert. */
export async function startSession(userId: string): Promise<WorkSession | null> {
  const { session } = await call<{ session: WorkSession | null }>(endpoint(), {
    method: "POST",
    body: JSON.stringify({ action: "clock-in", userId }),
  });
  return session ?? null;
}

/** Ausstempeln. Ohne laufende Sitzung passiert nichts. */
export async function stopSession(userId: string, notes?: string): Promise<WorkSession | null> {
  const { session } = await call<{ session: WorkSession | null }>(endpoint(), {
    method: "POST",
    body: JSON.stringify({ action: "clock-out", userId, notes }),
  });
  return session ?? null;
}

export class CodeFalsch extends Error {}

/**
 * Eigenen Code aendern. Der bisherige Code wird drueben geprueft — hier liegt
 * kein Code und kein Verfahren.
 */
export async function changePin(
  userId: string,
  currentPin: string,
  newPin: string,
): Promise<void> {
  try {
    await call(endpoint(), {
      method: "POST",
      body: JSON.stringify({ action: "set-pin", userId, currentPin, pin: newPin }),
    });
  } catch (e) {
    const status = (e as { status?: number }).status;
    if (status === 401) throw new CodeFalsch();
    if (status === 429) throw new LoginGesperrt();
    throw e;
  }
}

// ─── Verfuegbarkeit ───────────────────────────────────────────────────────

/** Angabe fuer einen Tag — das digitale Gegenstueck zum Papier-Zettel. */
export type Wish = {
  id: string;
  user_id: string | null;
  user_name: string;
  /** YYYY-MM-DD */
  date: string;
  /** 'nicht_moeglich' | 'nur_bis' | 'nur_von_bis' | 'nur_ab' | 'flexibel' */
  wish_type: string;
  from_time: string | null;
  to_time: string | null;
  notes: string | null;
};

/** Gewuenschte Stunden in einer bestimmten Woche. */
export type WeekTarget = {
  id: string;
  user_id: string | null;
  user_name: string;
  /** Montag, YYYY-MM-DD */
  week_start: string;
  hours: number | null;
};

export type AvailabilityEntry = {
  date: string;
  wishType: string;
  fromTime?: string | null;
  toTime?: string | null;
  notes?: string | null;
};

/** Verfuegbarkeiten und Wochenstunden eines Zeitraums (Datumsgrenzen inklusive). */
export async function getAvailability(
  fromDate: string,
  toDate: string,
  userId?: string,
): Promise<{ wishes: Wish[]; targets: WeekTarget[] }> {
  const params = new URLSearchParams({ resource: "availability", from: fromDate, to: toDate });
  if (userId) params.set("userId", userId);
  const data = await call<{ wishes: Wish[]; targets: WeekTarget[] }>(endpoint(`?${params.toString()}`));
  return { wishes: data.wishes || [], targets: data.targets || [] };
}

/** Eine ganze Woche speichern. Tage ohne Angabe (wishType "") werden geloescht. */
export async function saveAvailability(
  userId: string,
  entries: AvailabilityEntry[],
): Promise<void> {
  await call(endpoint(), {
    method: "POST",
    body: JSON.stringify({ action: "set-availability", userId, entries }),
  });
}

/** Wunsch-Stunden fuer eine Woche (null = keine Angabe). */
export async function saveWeekTarget(
  userId: string,
  weekStart: string,
  hours: number | null,
): Promise<void> {
  await call(endpoint(), {
    method: "POST",
    body: JSON.stringify({ action: "set-week-target", userId, weekStart, hours }),
  });
}

/**
 * Sitzungen eines Zeitraums. Ohne userId: alle Personen des Betriebs
 * (Chef-Sicht). Eine Sitzung zaehlt zu dem Tag, an dem sie begonnen hat.
 */
export async function sessionsInRange(
  fromIso: string,
  toIso: string,
  userId?: string,
): Promise<WorkSession[]> {
  const params = new URLSearchParams({ resource: "sessions", from: fromIso, to: toIso });
  if (userId) params.set("userId", userId);
  const { sessions } = await call<{ sessions: WorkSession[] }>(endpoint(`?${params.toString()}`));
  return sessions || [];
}
