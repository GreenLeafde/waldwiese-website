import Link from "next/link";
import { listNewslettersWithStats } from "@/lib/newsletters";
import { dbReachable } from "@/lib/db";
import { DbNotice } from "@/components/admin/db-notice";
import { ResumeButton } from "@/components/admin/resume-button";

export const metadata = {
  title: "Versand",
  robots: { index: false, follow: false },
};

export default async function VersandPage() {
  if (!(await dbReachable())) {
    return (
      <div>
        <h1 className="text-3xl font-display font-normal text-waldgruen">
          Gesendete Newsletter
        </h1>
        <div className="mt-6">
          <DbNotice />
        </div>
      </div>
    );
  }

  const items = await listNewslettersWithStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-normal text-waldgruen">
          Gesendete Newsletter
        </h1>
        <p className="mt-2 text-waldgruen/55 text-sm">
          Jede versendete Kampagne mit Öffnungen, Klicks und Abmeldungen. Klick
          auf eine Kampagne für die Vorschau und Details.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white ring-1 ring-waldgruen/10 px-5 py-10 text-center text-sm text-waldgruen/45">
          Noch kein Newsletter versendet. Sobald du einen verschickst, taucht er
          hier mit Auswertung auf.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => {
            const open = Math.max(0, n.recipientCount - n.sentCount);
            return (
              <li
                key={n.id}
                className="rounded-2xl bg-white ring-1 ring-waldgruen/10 overflow-hidden"
              >
                <Link
                  href={`/admin/versand/${n.id}`}
                  className="block hover:bg-mehlcreme/20 transition px-5 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-waldgruen truncate">
                          {n.name || n.subject}
                        </p>
                        {n.scheduledAt != null && (
                          <span className="shrink-0 rounded-full bg-tonwarm/15 text-tonwarm-dark text-[0.65rem] font-medium px-2.5 py-0.5">
                            ⏰ geplant
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-waldgruen/45">
                        {n.name ? `${n.subject} · ` : ""}
                        {n.scheduledAt != null
                          ? `Geht automatisch am ${n.scheduledAtLabel} raus · ${n.recipientCount} Empfänger eingeplant`
                          : `${n.sentAtLabel} · ${n.sentCount} / ${n.recipientCount} gesendet`}
                      </p>
                    </div>
                    <div className="flex gap-5 text-sm shrink-0">
                      <Stat value={n.opens} label="Öffnungen" />
                      <Stat value={n.clicks} label="Klicks" />
                      <Stat value={n.unsubs} label="Abmeldungen" />
                    </div>
                  </div>
                </Link>

                {open > 0 && (
                  <div className="border-t border-waldgruen/10 bg-mehlcreme/20 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-waldgruen/60">
                      {n.scheduledAt != null ? (
                        <>
                          Geht am{" "}
                          <strong className="text-waldgruen">
                            {n.scheduledAtLabel}
                          </strong>{" "}
                          von allein raus — du musst nichts tun. Soll er früher
                          weg, schick ihn hier jetzt schon los.
                        </>
                      ) : (
                        <>
                          <strong className="text-waldgruen">{open}</strong>{" "}
                          haben ihn noch nicht — weitersenden geht ohne
                          Duplikate (jeder bekommt ihn nur einmal).
                        </>
                      )}
                    </span>
                    <ResumeButton newsletterId={n.id} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl text-waldgruen leading-none">{value}</p>
      <p className="mt-1 text-[0.65rem] uppercase tracking-wide text-waldgruen/40">
        {label}
      </p>
    </div>
  );
}
