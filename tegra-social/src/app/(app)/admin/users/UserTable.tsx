"use client";

import { useState, useTransition } from "react";
import { deactivateUser, reactivateUser } from "@/actions/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  country: string | null;
  role: string | null;
  isAdmin: boolean | null;
  status: string | null;
  createdAt: Date;
};

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "active";
  if (s === "active") {
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0">
        Active
      </Badge>
    );
  }
  if (s === "deactivated") {
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-0">
        Deactivated
      </Badge>
    );
  }
  return (
    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-0">
      Pending
    </Badge>
  );
}

export function UserTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [pending, startTransition] = useTransition();

  function updateUserStatus(userId: string, newStatus: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  }

  function handleDeactivate(userId: string, userName: string) {
    startTransition(async () => {
      const result = await deactivateUser(userId);
      if (result.success) {
        updateUserStatus(userId, "deactivated");
        toast.success(`${userName} deactivated`);
      } else {
        toast.error(result.error ?? "Failed to deactivate user");
      }
    });
  }

  function handleReactivate(userId: string, userName: string) {
    startTransition(async () => {
      const result = await reactivateUser(userId);
      if (result.success) {
        updateUserStatus(userId, "active");
        toast.success(`${userName} reactivated`);
      } else {
        toast.error(result.error ?? "Failed to reactivate user");
      }
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-zinc-500 py-8"
            >
              No users yet. Send an invite to get started.
            </TableCell>
          </TableRow>
        )}
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell className="font-medium">
              {u.name}
              {u.isAdmin && (
                <span className="ml-1 text-xs text-zinc-400">(admin)</span>
              )}
            </TableCell>
            <TableCell className="text-zinc-600 dark:text-zinc-400">
              {u.email}
            </TableCell>
            <TableCell className="text-zinc-600 dark:text-zinc-400">
              {u.country ?? "—"}
            </TableCell>
            <TableCell className="text-zinc-600 dark:text-zinc-400">
              {u.role ?? "—"}
            </TableCell>
            <TableCell>
              <StatusBadge status={u.status} />
            </TableCell>
            <TableCell className="text-zinc-500 text-sm">
              {u.createdAt.toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              {u.status === "deactivated" ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => handleReactivate(u.id, u.name)}
                >
                  Reactivate
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={pending}
                  onClick={() => handleDeactivate(u.id, u.name)}
                >
                  Deactivate
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
