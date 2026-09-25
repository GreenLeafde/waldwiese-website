import { listContacts, countByStatus } from "@/lib/contacts";
import { listOpenCampaigns } from "@/lib/newsletters";
import { listSuppressions } from "@/lib/suppressions";
import { dbReachable } from "@/lib/db";
import { ContactsManager } from "@/components/admin/contacts-manager";
import { NewsletterComposer } from "@/components/admin/newsletter-composer";
import { SuppressionManager } from "@/components/admin/suppression-manager";
import { DbNotice } from "@/components/admin/db-notice";

/**
 * Zeitlimit für diese Seite UND die von hier aufgerufenen Server-Actions
 * (Newsletter-Versand). Der Versand läuft per `after()` nach der Antwort
 * weiter — bis zu diesem Limit. Vercel-Standard wäre je nach Plan deutlich
 * kürzer; siehe app/actions/newsletter-admin.ts.
 */
export const maxDuration = 300;

export default async function NewsletterAdminPage() {
  if (!(await dbReachable())) {
    return (
      <div>
        <h1 className="text-3xl font-display font-normal text-waldgruen">
          Newsletter
        </h1>
        <div className="mt-6">
          <DbNotice />
        </div>
      </div>
    );
  }

  const [contacts, counts, openCampaigns, suppressions] = await Promise.all([
    listContacts(),
    countByStatus(),
    listOpenCampaigns(),
    listSuppressions(),
  ]);

  return (
    <div className="space-y-14">
      <div>
        <h1 className="text-3xl font-display font-normal text-waldgruen">
          Newsletter
        </h1>
        <p className="mt-2 text-waldgruen/55">
          {counts.subscribed} angemeldet · {counts.pending} ausstehend ·{" "}
          {counts.unsubscribed} abgemeldet
        </p>
      </div>

      <NewsletterComposer
        recipientCount={counts.subscribed}
        openCampaigns={openCampaigns}
      />

      <ContactsManager contacts={contacts} />

      <SuppressionManager suppressions={suppressions} />
    </div>
  );
}
