/**
 * Geteilte Typen/Defaults für die Launch-Liste (Frühstücks-Newsletter).
 * Client-sicher (kein node:crypto) — die Token-Logik liegt server-only in
 * lib/newsletter-token.ts, der Versand in app/actions/newsletter.ts.
 */

export type NewsletterState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const NEWSLETTER_INITIAL_STATE: NewsletterState = {
  status: "idle",
  message: "",
};
