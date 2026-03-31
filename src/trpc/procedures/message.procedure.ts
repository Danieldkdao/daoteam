import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import {
  checkExistingChannelTRPC,
  checkExistingUserTRPC,
  checkExistingWorkspaceMemberTRPC,
} from "../helpers";
import { SOCKET_EVENT } from "@/lib/ws/events";
import { broadcastToChannel } from "@/lib/ws/server";
import { db } from "@/db/db";
import { MessageTable, user } from "@/db/schema";
import { and, asc, eq, getTableColumns, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        channelId: z.uuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { workspaceId, channelId } = input;
      const { id: userId } = ctx.auth.user;

      await checkExistingUserTRPC(userId);
      const { organization: orgInfo } = await checkExistingWorkspaceMemberTRPC({
        workspaceId,
        userId,
      });
      const channel = await checkExistingChannelTRPC({
        channelId,
        workspaceId,
      });

      const channelMessages = await db
        .select({
          ...getTableColumns(MessageTable),
          user: getTableColumns(user),
          reactions: sql<{ reaction: string; count: number }[]>`
            COALESCE(
              (
                SELECT json_agg(json_build_object('reaction', t.reaction, 'count', t.count))
                FROM (
                  SELECT
                    "reactions"."reaction" AS reaction,
                    COUNT(*)::int AS count
                  FROM "reactions"
                  WHERE "reactions"."message_id" = ${MessageTable.id}
                  GROUP BY "reactions"."reaction"
                  ORDER BY "reactions"."reaction"
                ) t
              ),
              '[]'::json
            )
          `,
        })
        .from(MessageTable)
        .innerJoin(user, eq(user.id, MessageTable.userId))
        .where(
          and(
            eq(MessageTable.channelId, channel.id),
            eq(MessageTable.organizationId, orgInfo.id),
          ),
        )
        .orderBy(asc(MessageTable.createdAt), asc(MessageTable.id));

      return {
        channel,
        messages: channelMessages,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        channelId: z.uuid(),
        message: z.string().min(1),
        image: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, channelId, message, image } = input;
      const { id: userId } = ctx.auth.user;

      const existingUser = await checkExistingUserTRPC(userId);
      const { organization: orgInfo } = await checkExistingWorkspaceMemberTRPC({
        userId: existingUser.id,
        workspaceId,
      });
      const channel = await checkExistingChannelTRPC({
        channelId,
        workspaceId,
      });

      const [created] = await db
        .insert(MessageTable)
        .values({
          message,
          image: image ?? null,
          userId: existingUser.id,
          channelId: channel.id,
          organizationId: orgInfo.id,
        })
        .returning();

      broadcastToChannel(channel.id, {
        type: SOCKET_EVENT.MESSAGE_CREATED_EDITED,
        channelId: channel.id,
        messageId: created.id,
      });

      return created;
    }),
  edit: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        channelId: z.uuid(),
        message: z.string(),
        messageId: z.uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, channelId, message, messageId } = input;
      const { id: userId } = ctx.auth.user;

      const existingUser = await checkExistingUserTRPC(userId);
      const { organization: orgInfo } = await checkExistingWorkspaceMemberTRPC({
        userId: existingUser.id,
        workspaceId,
      });
      const existingChannel = await checkExistingChannelTRPC({
        channelId,
        workspaceId: orgInfo.id,
      });

      const [updatedMessage] = await db
        .update(MessageTable)
        .set({
          message,
        })
        .where(
          and(
            eq(MessageTable.userId, existingUser.id),
            eq(MessageTable.id, messageId),
            eq(MessageTable.channelId, existingChannel.id),
            eq(MessageTable.organizationId, orgInfo.id),
          ),
        )
        .returning();

      if (!updatedMessage) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "ISE" });
      }

      broadcastToChannel(existingChannel.id, {
        type: SOCKET_EVENT.MESSAGE_CREATED_EDITED,
        channelId: existingChannel.id,
        messageId: updatedMessage.id,
      });

      return updatedMessage;
    }),
});
