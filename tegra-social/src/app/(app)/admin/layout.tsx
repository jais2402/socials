import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Tegra Social",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8">
      <div className="max-w-5xl">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
          Admin
        </h1>

        <nav className="flex gap-1 mb-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link
            href="/admin/users"
            className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 border-b-2 border-transparent hover:border-zinc-400 transition-colors"
          >
            Users
          </Link>
          <Link
            href="/admin/import"
            className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 border-b-2 border-transparent hover:border-zinc-400 transition-colors"
          >
            Import
          </Link>
        </nav>

        {children}
      </div>
    </div>
  );
}
