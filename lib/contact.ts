/**
 * Geteilte Typen/Defaults für das Kontaktformular.
 *
 * Bewusst HIER (und nicht in app/actions/contact.ts): eine Datei mit der
 * "use server"-Direktive darf zur Laufzeit ausschließlich async-Funktionen
 * exportieren — Konstanten wie CONTACT_INITIAL_STATE würden dort einen Fehler
 * werfen. Server Action und Client-Formular importieren beide von hier.
 */

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Partial<Record<"name" | "email" | "message" | "consent", string>>;
};

export const CONTACT_INITIAL_STATE: ContactState = {
  status: "idle",
  message: "",
};
