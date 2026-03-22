import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tegra Social — Sign In",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tegra Social
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Connecting Roanuz teams across India &amp; Denmark
        </p>
      </div>
      {children}
    </div>
  );
}
