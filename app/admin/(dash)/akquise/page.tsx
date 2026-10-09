import { dbReachable } from "@/lib/db";
import { DbNotice } from "@/components/admin/db-notice";
import { AkquiseManager } from "@/components/admin/akquise-manager";
import {
  faelligkeiten,
  heuteVersendet,
  listLeads,
  versandBereit,
} from "@/lib/akquise";
import { ANHANG, TAGESLIMIT } from "@/lib/akquise-texte";

/**
 * Akquise: Firmenkontakte mit fertigem Mail-Entwurf, Versand und Verlauf.
 * Vorbild ist /admin/akquise im Hotel-Backend.
 *
 * Zeitlimit fuer die Seite und ihre Server-Aktionen: der Stapelversand
 * schickt bis zu 20 Mails nacheinander und braucht dafuer laenger als der
 * Vercel-Standard erlaubt.
 */
export const maxDuration = 300;

export default async function AkquisePage() {
  if (!(await dbReachable())) {
    return (
      <div>
        <h1 className="text-3xl font-display font-normal text-waldgruen">Akquise</h1>
        <div className="mt-6">
          <DbNotice />
        </div>
      </div>
    );
  }

  const [leads, heute] = await Promise.all([listLeads(), heuteVersendet()]);

  return (
    <AkquiseManager
      leads={leads}
      faellig={faelligkeiten(leads)}
      heute={heute}
      limit={TAGESLIMIT}
      versandBereit={versandBereit() != null}
      anhang={ANHANG}
    />
  );
}
