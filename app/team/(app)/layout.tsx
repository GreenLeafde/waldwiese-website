import Link from "next/link";
import { requireStaff } from "@/lib/staff-auth";
import { teamLogoutAction } from "@/app/actions/team";

export const metadata = {
  title: "Team",
  robots: { index: false, follow: false },
};

const NAV = [
  { label: "Meine Zeit", href: "/team" },
  { label: "Verfügbarkeit", href: "/team/verfuegbarkeit" },
];

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await requireStaff();

  return (
    <div className="min-h-svh bg-stone-soft">
      <header className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-3xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link href="/team" className="font-display text-lg text-mehlcreme">
              Wald &amp; Wiese
              <span className="text-tonwarm"> · Team</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-5 text-sm">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-mehlcreme/70 hover:text-tonwarm transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-mehlcreme/50">{staff.name}</span>
            <form action={teamLogoutAction}>
              <button
                type="submit"
                className="text-xs rounded-full border border-mehlcreme/25 px-3 py-1.5 text-mehlcreme/80 hover:border-tonwarm hover:text-tonwarm transition-colors"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
        {/* Mobile-Nav — das Team ist fast immer am Handy. */}
        <nav className="sm:hidden border-t border-mehlcreme/10 px-5 py-2 flex gap-5 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-mehlcreme/70 hover:text-tonwarm transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">{children}</main>
    </div>
  );
}
