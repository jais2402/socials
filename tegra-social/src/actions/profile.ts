"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { profiles, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Demo mode: use first admin user as the current user
async function getDemoUserId() {
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.isAdmin, true))
    .limit(1);
  return rows[0]?.id ?? "demo-admin-001";
}

export async function updateProfile(formData: FormData) {
  const userId = await getDemoUserId();

  // Fields on the user table
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const role = (formData.get("role") as string | null)?.trim() ?? null;
  const country = (formData.get("country") as string | null)?.trim() ?? null;

  // Fields on the profiles table
  const bio = (formData.get("bio") as string | null)?.trim() ?? null;
  const interestsRaw =
    (formData.get("interests") as string | null)?.trim() ?? "";
  const interests = interestsRaw
    ? interestsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const funFact = (formData.get("funFact") as string | null)?.trim() ?? null;
  const favouriteFood =
    (formData.get("favouriteFood") as string | null)?.trim() ?? null;
  const favouriteSport =
    (formData.get("favouriteSport") as string | null)?.trim() ?? null;

  // Update user table fields
  if (name) {
    await db
      .update(user)
      .set({
        name,
        role: role ?? undefined,
        country: country ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));
  }

  // Upsert profiles table
  await db
    .insert(profiles)
    .values({
      userId,
      bio,
      interests: interests.length > 0 ? interests : null,
      funFact,
      favouriteFood,
      favouriteSport,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: {
        bio,
        interests: interests.length > 0 ? interests : null,
        funFact,
        favouriteFood,
        favouriteSport,
        updatedAt: new Date(),
      },
    });

  revalidatePath("/profile");
  revalidatePath("/directory");

  return { success: true };
}

export async function getProfile(userId: string) {
  const result = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  return result[0] ?? null;
}
