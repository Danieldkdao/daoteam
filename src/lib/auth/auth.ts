import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/db";
import { emailOTP, organization } from "better-auth/plugins";
import { sendVerificationOtp } from "../emails/verification-email";
import { sendOrganizationInvitation } from "../emails/organization-invitation";
import { envServer } from "@/data/env/server";
import Stripe from "stripe";
import { stripe } from "@better-auth/stripe";
import { and, eq } from "drizzle-orm";
import { member } from "@/db/schema";
import { broadcastToWorkspace } from "../ws/server";
import { SOCKET_EVENT } from "../ws/events";

const stripeClient = new Stripe(envServer.STRIPE_SECRET_KEY, {
  apiVersion: "2026-02-25.clover",
});

export const auth = betterAuth({
  user: {
    additionalFields: {
      plan: {
        type: "string",
        required: true,
        input: true,
        defaultValue: "free",
      },
      onboardingPhase: {
        type: "string",
        required: true,
        input: true,
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
    organization({
      requireEmailVerificationOnInvitation: true,
      organizationHooks: {
        afterAcceptInvitation: async (data) => {
          broadcastToWorkspace(data.organization.id, {
            workspaceId: data.organization.id,
            type: SOCKET_EVENT.MEMBER_ADDED,
          });
        },
      },
      async sendInvitationEmail(data) {
        const inviteUrl = `${envServer.BETTER_AUTH_URL}/accept-invitation/${data.id}`;

        await sendOrganizationInvitation({
          email: data.email,
          invitedByUsername: data.inviter.user.name,
          invitedByEmail: data.inviter.user.email,
          teamName: data.organization.name,
          inviteUrl,
        });
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      organization: {
        enabled: true,
      },
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "Free",
            limits: {
              monthlyAIGeneratedMessage: 50,
              monthlyAIGeneratedSummaries: 1,
            },
          },
          {
            name: "pro",
            priceId: envServer.STRIPE_PRO_PRICE_ID,
            limits: {
              monthlyAIGeneratedMessage: 500,
              monthlyAIGeneratedSummaries: 5,
            },
          },
          {
            name: "enterprise",
            priceId: envServer.STRIPE_ENTERPRISE_PRICE_ID,
            limits: {
              monthlyAIGeneratedMessage: null,
              monthlyAIGeneratedSummaries: null,
            },
          },
        ],
        authorizeReference: async ({ user, referenceId }) => {
          const [teamMember] = await db
            .select()
            .from(member)
            .where(
              and(
                eq(member.userId, user.id),
                eq(member.organizationId, referenceId),
              ),
            );
          return teamMember?.role === "owner" || teamMember?.role === "admin";
        },
      },
    }),
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
