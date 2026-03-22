import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * Returns the current session or null if unauthenticated.
 * Safe to call from Server Components and Server Actions.
 */
export async function verifySession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session ?? null;
}

/**
 * Returns the current session or redirects to /login.
 * Use in Server Components/Actions that require authentication.
 */
export async function requireSession() {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

/**
 * Returns the current session or redirects to / if user is not an admin.
 * Use in admin-only Server Components/Actions.
 */
export async function requireAdmin() {
  const session = await requireSession();
  if (!session.user.isAdmin) {
    redirect("/");
  }
  return session;
}
