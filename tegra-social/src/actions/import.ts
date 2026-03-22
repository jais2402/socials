"use server";

import Papa from "papaparse";
import { z } from "zod";
import { db } from "@/lib/db";
import { user, inviteCodes } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/dal";
import { nanoid } from "nanoid";

// ─── Schema ───────────────────────────────────────────────────────────────────

const EmployeeRowSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Role required"),
  country: z.enum(["India", "Iceland"], {
    error: "Must be 'India' or 'Iceland'",
  }),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type ImportResult = {
  imported: number;
  skipped: number;
  errors: { row: number; email?: string; reason: string }[];
};

// ─── Action ───────────────────────────────────────────────────────────────────

export async function importEmployeesFromCSV(
  formData: FormData,
): Promise<ImportResult> {
  await requireAdmin();

  const file = formData.get("csv") as File | null;
  if (!file || file.size === 0) {
    return {
      imported: 0,
      skipped: 0,
      errors: [{ row: 0, reason: "No CSV file provided" }],
    };
  }

  const text = await file.text();

  const parseResult = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.toLowerCase().trim(),
  });

  if (parseResult.errors.length > 0) {
    return {
      imported: 0,
      skipped: 0,
      errors: parseResult.errors.map((e) => ({
        row: e.row ?? 0,
        reason: e.message,
      })),
    };
  }

  const rows = parseResult.data;
  let imported = 0;
  let skipped = 0;
  const errors: ImportResult["errors"] = [];

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2; // 1-indexed, +1 for header row
    const raw = rows[i];

    const validation = EmployeeRowSchema.safeParse(raw);

    if (!validation.success) {
      const reason = validation.error.issues
        .map((issue) => issue.message)
        .join("; ");
      errors.push({ row: rowNum, email: raw.email || undefined, reason });
      skipped++;
      continue;
    }

    const { name, email, role, country } = validation.data;
    const now = new Date();

    const inserted = await db
      .insert(user)
      .values({
        id: nanoid(),
        name,
        email,
        role,
        country,
        emailVerified: false,
        status: "pending_invite",
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing()
      .returning({ id: user.id });

    if (inserted.length === 0) {
      // Duplicate email — conflict was ignored
      errors.push({ row: rowNum, email, reason: "Email already exists — skipped" });
      skipped++;
      continue;
    }

    // Create an invite code for the new user (48h expiry)
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    await db.insert(inviteCodes).values({
      email,
      code: crypto.randomUUID().replace(/-/g, "").slice(0, 32),
      expiresAt,
    });

    imported++;
  }

  return { imported, skipped, errors };
}
