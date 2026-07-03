import Link from "next/link";
import { logoutAction } from "@/app/actions/admin";

const NAV = [
  { label: "Übersicht", href: "/admin" },
  { label: "Auswertungen", href: "/admin/analytics" },
  { label: "Newsletter", href: "/admin/newsletter" },
  { label: "Versand", href: "/admin/versand" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-stone-soft">
      <header className="bg-waldgruen text-mehlcreme">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-lg text-mehlcreme">
              Wald &amp; Wiese
              <span className="text-tonwarm"> · Backend</span>
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
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-mehlcreme/50 hover:text-tonwarm transition-colors"
            >
              Website ansehen ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs rounded-full border border-mehlcreme/25 px-3 py-1.5 text-mehlcreme/80 hover:border-tonwarm hover:text-tonwarm transition-colors"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
        {/* Mobile-Nav */}
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

      <main className="mx-auto max-w-6xl px-5 md:px-8 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
