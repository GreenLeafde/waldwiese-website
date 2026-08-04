import { redirect } from "next/navigation";
import { currentStaff } from "@/lib/staff-auth";
import { listLoginNames, staffConfigured } from "@/lib/staff-db";
import { TeamLoginForm } from "@/components/team/team-login-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Team",
  robots: { index: false, follow: false },
};

export default async function TeamLoginPage() {
  if (await currentStaff()) redirect("/team");

  let staff: { id: string; name: string }[] = [];
  let ladeFehler = "";
  if (staffConfigured()) {
    try {
      staff = await listLoginNames();
    } catch {
      ladeFehler = "Die Zeiterfassung ist gerade nicht erreichbar.";
    }
  } else {
    ladeFehler = "Der Team-Bereich ist noch nicht verbunden.";
  }

  return (
    <main className="min-h-svh grid place-items-center bg-waldgruen px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="eyebrow no-line justify-center text-tonwarm text-center">
          Wald &amp; Wiese
        </p>
        <h1 className="mt-4 text-center text-3xl font-display font-normal text-mehlcreme">
          Arbeitszeit
        </h1>
        <p className="mt-3 text-center text-sm text-mehlcreme/60">
          Anmelden, um Schichten zu sehen und zu stempeln.
        </p>
        <div className="mt-8 rounded-2xl bg-mehlcreme p-6 shadow-lg">
          {ladeFehler ? (
            <p role="alert" className="text-sm text-tonwarm-dark">
              {ladeFehler}
            </p>
          ) : (
            <TeamLoginForm staff={staff} />
          )}
        </div>
      </div>
    </main>
  );
}
