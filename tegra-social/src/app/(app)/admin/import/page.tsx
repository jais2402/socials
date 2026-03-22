import type { Metadata } from "next";
import { ImportClient } from "./ImportClient";

export const metadata: Metadata = {
  title: "Import Employees — Admin",
};

export default function ImportPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
        Import Employees
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        Upload a CSV file to bulk-import employees. Valid rows create user
        accounts; invalid or duplicate rows are skipped with explanations.
      </p>
      <ImportClient />
    </div>
  );
}
