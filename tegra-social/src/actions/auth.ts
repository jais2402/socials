"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, inviteCodes } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/dal";

// ─── sendInvite ──────────────────────────────────────────────────────────────

export async function sendInvite(email: string, name: string) {
  try {
    const session = await requireAdmin();

    // Create an invite code record (48h expiry)
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await db.insert(inviteCodes).values({
      email,
      code: crypto.randomUUID().replace(/-/g, "").slice(0, 32),
      expiresAt,
      createdBy: session.user.id,
    });

    // Trigger the magic link email (logs to console in dev)
    await auth.api.signInMagicLink({
      body: { email, callbackURL: "/profile/setup" },
      headers: await headers(),
    });

    return { success: true, message: "Invite sent" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send invite";
    return { success: false, error: message };
  }
}

// ─── deactivateUser ───────────────────────────────────────────────────────────

export async function deactivateUser(userId: string) {
  try {
    await requireAdmin();
    await db
      .update(user)
      .set({ status: "deactivated" })
      .where(eq(user.id, userId));
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to deactivate user";
    return { success: false, error: message };
  }
}

// ─── reactivateUser ───────────────────────────────────────────────────────────

export async function reactivateUser(userId: string) {
  try {
    await requireAdmin();
    await db
      .update(user)
      .set({ status: "active" })
      .where(eq(user.id, userId));
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reactivate user";
    return { success: false, error: message };
  }
}

// ─── logoutAction / signOutAction ─────────────────────────────────────────────

export async function logoutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}

// Alias used by the sidebar form
export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}
