import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { eq, and, isNull, gt } from "drizzle-orm";
import { db } from "./db";
import { user, inviteCodes } from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
      country: {
        type: "string",
        required: false,
      },
      isAdmin: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "active",
      },
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log(`[DEV] Magic link for ${email}: ${url}`);
      },
      expiresIn: 48 * 60 * 60, // 48 hours
      disableSignUp: false,
    }),
    nextCookies(),
  ],

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const path = ctx.path as string;
      const body = ctx.body as Record<string, unknown> | undefined;
      const email =
        body && typeof body.email === "string" ? body.email : null;

      // (a) Block deactivated users on any magic-link sign-in path
      if (
        email &&
        (path.includes("/magic-link") || path.includes("/sign-in"))
      ) {
        const existingUser = await db
          .select({ status: user.status })
          .from(user)
          .where(eq(user.email, email))
          .limit(1);

        if (existingUser[0]?.status === "deactivated") {
          throw new APIError("FORBIDDEN", { message: "Account deactivated" });
        }
      }

      // (b) Validate invite codes on magic-link sign-in (which also creates new users)
      if (email && path.includes("/sign-in/magic-link")) {
        // Check if user already exists — existing users don't need invite codes
        const existingUser2 = await db
          .select({ id: user.id })
          .from(user)
          .where(eq(user.email, email))
          .limit(1);

        if (!existingUser2[0]) {
          const now = new Date();
          const validInvite = await db
            .select({ id: inviteCodes.id })
            .from(inviteCodes)
            .where(
              and(
                eq(inviteCodes.email, email),
                isNull(inviteCodes.usedAt),
                gt(inviteCodes.expiresAt, now)
              )
            )
            .limit(1);

          if (!validInvite[0]) {
            throw new APIError("BAD_REQUEST", {
              message: "No valid invite found",
            });
          }
        }
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session;
