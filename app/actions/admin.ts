"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  adminConfigured,
  createSessionToken,
  verifyPassword,
} from "@/lib/admin-auth";

export type LoginState = { error: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!adminConfigured()) {
    return {
      error:
        "Login ist noch nicht eingerichtet (ADMIN_PASSWORD / ADMIN_SESSION_SECRET fehlen).",
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    // Brute-Force ausbremsen.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Falsches Passwort." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
