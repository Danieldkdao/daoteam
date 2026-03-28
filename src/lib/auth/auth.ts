import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { emailOTP, organization } from "better-auth/plugins";
import { sendVerificationOtp } from "../emails/verification-email";
import { envServer } from "@/data/env/server";

export const auth = betterAuth({
  user: {
    additionalFields: {
      onboardingPhase: {
        type: "string",
        required: true,
        input: false,
        defaultValue: "create-organization",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
  },
  socialProviders: {
    google: {
      clientId: envServer.GOOGLE_CLIENT_ID,
      clientSecret: envServer.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: envServer.GITHUB_CLIENT_ID,
      clientSecret: envServer.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP(data) {
        await sendVerificationOtp(data);
      },
    }),
    organization(),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
