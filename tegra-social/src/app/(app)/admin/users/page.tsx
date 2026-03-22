import { db } from "@/lib/db";
import { user, inviteCodes } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { Separator } from "@/components/ui/separator";
import { InviteForm } from "./InviteForm";
import { UserTable } from "./UserTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management — Admin — Tegra Social",
};

export default async function AdminUsersPage() {
  const [users, invites] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        country: user.country,
        role: user.role,
        isAdmin: user.isAdmin,
        status: user.status,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(asc(user.createdAt)),
    db
      .select({
        id: inviteCodes.id,
        email: inviteCodes.email,
        usedAt: inviteCodes.usedAt,
        expiresAt: inviteCodes.expiresAt,
        createdAt: inviteCodes.createdAt,
      })
      .from(inviteCodes)
      .orderBy(asc(inviteCodes.createdAt)),
  ]);

  return (
    <div className="space-y-10">
      {/* Invite section */}
      <section>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
          Send an invite
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          The invitee will receive a magic link to sign in and set up their
          profile.
        </p>

        <InviteForm />

        {invites.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Sent invites
            </h3>
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <span className="text-zinc-800 dark:text-zinc-200">
                    {invite.email}
                  </span>
                  <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                    <span>
                      {invite.usedAt
                        ? "Used"
                        : new Date() > invite.expiresAt
                          ? "Expired"
                          : "Pending"}
                    </span>
                    <span>
                      {invite.createdAt
                        ? new Date(invite.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <Separator />

      {/* User list section */}
      <section>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
          All users
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          {users.length} {users.length === 1 ? "user" : "users"} registered
        </p>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <UserTable initialUsers={users} />
        </div>
      </section>
    </div>
  );
}
