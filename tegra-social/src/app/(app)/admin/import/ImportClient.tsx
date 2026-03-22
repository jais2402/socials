"use client";

import { useState, useRef } from "react";
import { importEmployeesFromCSV, type ImportResult } from "@/actions/import";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ImportClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setErrorMessage("Please select a CSV file first.");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("csv", file);
      const importResult = await importEmployeesFromCSV(formData);
      setResult(importResult);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileName(file?.name ?? "");
    setResult(null);
    setErrorMessage("");
  }

  function handleDownloadSample() {
    const sampleContent = `name,email,role,country
Jane Smith,jane.smith@company.com,Software Engineer,india
John Doe,john.doe@company.com,Designer,iceland`;
    const blob = new Blob([sampleContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample-employees.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Upload card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload CSV File</CardTitle>
          <CardDescription>
            CSV must have columns:{" "}
            <code className="font-mono text-xs">name, email, role, country</code>.
            Country must be <code className="font-mono text-xs">india</code> or{" "}
            <code className="font-mono text-xs">iceland</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <label
                htmlFor="csv-input"
                className="flex-1 flex items-center gap-2 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-3 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-zinc-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {fileName ? fileName : "Choose CSV file\u2026"}
                </span>
                <input
                  id="csv-input"
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              <Button type="submit" disabled={isLoading || !fileName}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Importing\u2026
                  </span>
                ) : (
                  "Import"
                )}
              </Button>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            )}
          </form>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleDownloadSample}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Download sample CSV
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Results card */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary badges */}
            <div className="flex gap-3 flex-wrap">
              <Badge
                variant="outline"
                className="text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950 px-3 py-1 text-sm"
              >
                {result.imported} employee{result.imported !== 1 ? "s" : ""}{" "}
                imported successfully
              </Badge>
              {result.skipped > 0 && (
                <Badge
                  variant="outline"
                  className="text-yellow-700 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-950 px-3 py-1 text-sm"
                >
                  {result.skipped} row{result.skipped !== 1 ? "s" : ""} skipped
                </Badge>
              )}
            </div>

            {/* Error details */}
            {result.errors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Skipped rows
                </h3>
                <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Row</TableHead>
                        <TableHead className="w-48">Email</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.errors.map((err, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-sm font-mono">
                            {err.row}
                          </TableCell>
                          <TableCell className="text-sm font-mono text-zinc-500">
                            {err.email ?? "\u2014"}
                          </TableCell>
                          <TableCell className="text-sm text-red-600 dark:text-red-400">
                            {err.reason}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
