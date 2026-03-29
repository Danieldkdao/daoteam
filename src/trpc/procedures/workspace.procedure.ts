import { db } from "@/db/db";
import { member, organization, user } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { desc, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import { generateSlug } from "@/lib/utils";

export const workspaceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1),
        onboarding: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const requestHeaders = await headers();

      try {
        const workspace = await auth.api.createOrganization({
          body: {
            name: input.name,
            slug: generateSlug(input.name, ctx.auth.user.id),
            userId: ctx.auth.user.id,
            keepCurrentActiveOrganization: false,
          },
          headers: requestHeaders,
        });

        if (!workspace.id) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Failed to create workspace.",
          });
        }

        if (input.onboarding) {
          await db
            .update(user)
            .set({
              onboardingPhase: "select-plan",
            })
            .where(eq(user.id, ctx.auth.user.id));
        }

        return {
          message: "Workspace created successfully!",
          workspace,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Failed to create workspace.",
        });
      }
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const teamMembers = await db
      .select()
      .from(member)
      .where(eq(member.userId, ctx.auth.user.id));

    const workspaceIds = [
      ...new Set(teamMembers.map((tm) => tm.organizationId)),
    ];

    if (workspaceIds.length === 0) {
      return [];
    }

    return db
      .select()
      .from(organization)
      .where(inArray(organization.id, workspaceIds))
      .orderBy(desc(organization.createdAt));
  }),
});
