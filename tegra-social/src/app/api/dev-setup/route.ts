import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// DEV ONLY: Creates a test account with email+password login
export async function GET() {
  const email = "admin@tegrasocial.demo";
  const password = "demo1234";
  const name = "Admin User";

  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });

    return NextResponse.json({
      message: "Dev account created! Login with these credentials:",
      email,
      password,
    });
  } catch {
    return NextResponse.json({
      message: "Account may already exist. Try logging in:",
      email,
      password,
    });
  }
}
