import type { Metadata } from "next";
import { db } from "@/lib/db";
import { user, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "../ProfileForm";

export const metadata: Metadata = {
  title: "Set Up Your Profile — Tegra Social",
};

export default async function ProfileSetupPage() {
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      country: user.country,
      image: user.image,
      photoUrl: profiles.photoUrl,
      bio: profiles.bio,
      interests: profiles.interests,
      funFact: profiles.funFact,
      favouriteFood: profiles.favouriteFood,
      favouriteSport: profiles.favouriteSport,
    })
    .from(user)
    .leftJoin(profiles, eq(user.id, profiles.userId))
    .where(eq(user.isAdmin, true))
    .limit(1);

  const profileData = rows[0] ?? null;

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Welcome to Tegra Social!
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Let&apos;s set up your profile so your colleagues can get to know you.
          Fill in as much as you&apos;d like — you can always update it later.
        </p>

        <ProfileForm profileData={profileData} isSetup={true} />
      </div>
    </div>
  );
}
