import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// DEV ONLY: Creates a test account with email+password login
// Hit GET /api/dev-setup to create the account, then login with these creds
export async function GET() {
  const email = "admin@tegrasocial.demo";
  const password = "demo1234";
  const name = "Admin User";

  try {
    // Sign up via better-auth (this hashes the password properly)
    await auth.api.signUpEmail({
      body: { email, password, name },
    });

    return NextResponse.json({
      message: "Dev account created! Login with these credentials:",
      email,
      password,
    });
  } catch (e: unknown) {
    // Account might already exist — try to just return the creds
    return NextResponse.json({
      message: "Account may already exist. Try logging in:",
      email,
      password,
      note: String(e),
    });
  }
}
