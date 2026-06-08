import { listContacts, countByStatus } from "@/lib/contacts";
import { ContactsManager } from "@/components/admin/contacts-manager";
import { NewsletterComposer } from "@/components/admin/newsletter-composer";

export default async function NewsletterAdminPage() {
  const [contacts, counts] = await Promise.all([listContacts(), countByStatus()]);

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

      <NewsletterComposer recipientCount={counts.subscribed} />

      <ContactsManager contacts={contacts} />
    </div>
  );
}
