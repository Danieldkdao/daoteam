import { db } from "@/db/db";
import { ChannelTable, member } from "@/db/schema";
import { NO_PERMISSIONS_MESSAGE } from "@/lib/constants";
import { generateSlug } from "@/lib/utils";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import { checkExistingUser, checkExistingWorkspaceMember } from "../helpers";

export const channelRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        orgId: z.string().trim().min(1),
        name: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingMember = await db.query.member.findFirst({
          where: and(
            eq(member.userId, ctx.auth.user.id),
            eq(member.organizationId, input.orgId),
          ),
        });

        if (!existingMember) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Workspace not found.",
          });
        }

        if (existingMember.role === "member") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: NO_PERMISSIONS_MESSAGE,
          });
        }

        const [channel] = await db
          .insert(ChannelTable)
          .values({
            name: input.name,
            organizationId: input.orgId,
            slug: generateSlug(input.name),
            userId: ctx.auth.user.id,
          })
          .returning();

        return {
          message: "Channel created successfully!",
          channel,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong. Please try again or come back later.",
        });
      }
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.auth.user;

      if (!input.workspaceId) return [];

      await checkExistingUser(userId);
      const { organization } = await checkExistingWorkspaceMember({
        userId,
        workspaceId: input.workspaceId,
      });

      const channels = await db
        .select()
        .from(ChannelTable)
        .where(eq(ChannelTable.organizationId, organization.id))
        .orderBy(desc(ChannelTable.createdAt));

      return channels;
    }),
});
