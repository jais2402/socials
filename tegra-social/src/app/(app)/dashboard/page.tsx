import { verifySession } from "@/lib/dal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Tegra Social",
};

export default async function DashboardPage() {
  const session = await verifySession();
  const userName = session?.user?.name ?? "there";

  return (
    <div className="p-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Welcome, {userName}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Your Tegra Social dashboard — more features coming soon.
        </p>

        <div className="mt-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
            What&apos;s coming
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Weekly connection prompts — meet a colleague from the other office</li>
            <li>Team directory — browse profiles across India &amp; Denmark</li>
            <li>Coffee chat opt-in — casual 1:1 pairing</li>
            <li>Shared interests &amp; fun facts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
