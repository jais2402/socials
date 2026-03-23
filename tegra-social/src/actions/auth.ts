"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, inviteCodes } from "@/lib/db/schema";

// ─── sendInvite ──────────────────────────────────────────────────────────────

export async function sendInvite(email: string, name: string) {
  try {
    // Create an invite code record (48h expiry)
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await db.insert(inviteCodes).values({
      email,
      code: crypto.randomUUID().replace(/-/g, "").slice(0, 32),
      expiresAt,
    });

    return { success: true, message: "Invite created" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send invite";
    return { success: false, error: message };
  }
}

// ─── deactivateUser ───────────────────────────────────────────────────────────

export async function deactivateUser(userId: string) {
  try {
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

// ─── signOutAction (no-op in demo mode) ──────────────────────────────────────

export async function signOutAction() {
  // No-op in demo mode
}
