import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Tegra Social",
};

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Welcome to Tegra Social
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Connecting Roanuz teams across India &amp; Iceland.
        </p>

        <div className="mt-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
            Platform Features
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Employee Directory — browse profiles across India &amp; Iceland</li>
            <li>Random Coffee — casual cross-country 1:1 pairing</li>
            <li>Win Announcements — celebrate team achievements</li>
            <li>Fitness Challenges — India vs Iceland competition</li>
            <li>Cultural Trivia — learn about each other&apos;s culture</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
