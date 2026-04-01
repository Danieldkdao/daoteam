import { db } from "@/db/db";
import { member, organization, user } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { generateSlug } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import {
  and,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  or,
} from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";
import {
  checkExistingUserTRPC,
  checkExistingWorkspaceMemberTRPC,
} from "../helpers";
import { createTRPCRouter, protectedProcedure } from "../init";

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
  getOne: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.auth.user;

      if (!input.workspaceId) return null;

      await checkExistingUserTRPC(userId);
      const { organization: orgInfo } = await checkExistingWorkspaceMemberTRPC({
        userId,
        workspaceId: input.workspaceId,
      });

      const [workspace] = await db
        .select()
        .from(organization)
        .where(eq(organization.id, orgInfo.id));

      return workspace;
    }),
  getMembers: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { workspaceId, search } = input;
      const { id: userId } = ctx.auth.user;

      if (!workspaceId) return { currentUserMember: null, members: [] };

      await checkExistingUserTRPC(userId);
      const memberOrgInfo = await checkExistingWorkspaceMemberTRPC({
        userId,
        workspaceId: workspaceId,
      });

      const members = await db
        .select({
          ...getTableColumns(member),
          user: getTableColumns(user),
        })
        .from(member)
        .innerJoin(user, eq(user.id, member.userId))
        .where(
          and(
            eq(member.organizationId, memberOrgInfo.organization.id),
            search?.trim()
              ? or(
                  ilike(user.name, `%${search}%`),
                  ilike(user.email, `%${search}%`),
                )
              : undefined,
          ),
        );

      return {
        currentUserMember: memberOrgInfo.member,
        members,
      };
    }),
});
