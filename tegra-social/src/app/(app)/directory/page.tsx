import type { Metadata } from "next";
import { db } from "@/lib/db";
import { user, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { DirectoryClient } from "./DirectoryClient";

export const metadata: Metadata = {
  title: "Employee Directory — Tegra Social",
};

export default async function DirectoryPage() {
  const employees = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      country: user.country,
      image: user.image,
      photoUrl: profiles.photoUrl,
      interests: profiles.interests,
      bio: profiles.bio,
      funFact: profiles.funFact,
      favouriteFood: profiles.favouriteFood,
      favouriteSport: profiles.favouriteSport,
    })
    .from(user)
    .leftJoin(profiles, eq(user.id, profiles.userId))
    .where(eq(user.status, "active"));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Employee Directory
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Browse and connect with colleagues across India and Iceland.
        </p>
      </div>

      <DirectoryClient employees={employees} />
    </div>
  );
}
