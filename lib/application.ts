/**
 * Geteilte Typen/Defaults für das Bewerbungsformular (Karriere-Seite).
 *
 * Bewusst HIER und nicht in app/actions/karriere.ts: eine "use server"-Datei
 * darf zur Laufzeit nur async-Funktionen exportieren. Server Action und
 * Client-Formular importieren beide von hier.
 */

export type ApplicationState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Partial<
    Record<"name" | "email" | "phone" | "position" | "consent", string>
  >;
};

export const APPLICATION_INITIAL_STATE: ApplicationState = {
  status: "idle",
  message: "",
};
