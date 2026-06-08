import { isAuthed } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAuthed()) redirect("/admin");

  return (
    <main className="min-h-svh grid place-items-center bg-waldgruen px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="eyebrow no-line justify-center text-tonwarm text-center">
          Wald &amp; Wiese
        </p>
        <h1 className="mt-4 text-center text-3xl font-display font-normal text-mehlcreme">
          Team-Login
        </h1>
        <p className="mt-3 text-center text-sm text-mehlcreme/60">
          Nur für das Wald-&-Wiese-Team.
        </p>
        <div className="mt-8 rounded-2xl bg-mehlcreme p-6 shadow-lg">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
