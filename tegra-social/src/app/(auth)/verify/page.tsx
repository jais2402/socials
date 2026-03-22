"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function VerifyPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    // If session is already established, redirect to dashboard immediately
    if (!isPending && session) {
      router.push("/dashboard");
      return;
    }

    // Give better-auth 5 seconds to process the token via the /api/auth route,
    // then show an error if no session was established
    const timer = setTimeout(() => {
      if (!session) {
        setTimedOut(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [session, isPending, router]);

  if (timedOut) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Link expired or invalid</CardTitle>
          <CardDescription>
            This magic link has expired or has already been used.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login"
            className={buttonVariants({ variant: "default", className: "w-full justify-center" })}
          >
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Verifying…</CardTitle>
        <CardDescription>
          Signing you in, please wait a moment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
        </div>
      </CardContent>
    </Card>
  );
}
