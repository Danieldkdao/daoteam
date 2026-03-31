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
import { and, asc, eq, getTableColumns, isNull, sql } from "drizzle-orm";
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
          replyCount: sql<number>`(
            SELECT COUNT(*)
            FROM ${MessageTable} mt
            WHERE mt.thread_id = ${MessageTable.id}
          )`,
        })
        .from(MessageTable)
        .innerJoin(user, eq(user.id, MessageTable.userId))
        .where(
          and(
            eq(MessageTable.channelId, channel.id),
            eq(MessageTable.organizationId, orgInfo.id),
            isNull(MessageTable.threadId),
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
        messageId: z.string().optional(),
        image: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { workspaceId, channelId, message, messageId, image } = input;
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

      let parentMessageId;

      if (messageId) {
        const [existingMessage] = await db
          .select()
          .from(MessageTable)
          .where(
            and(
              eq(MessageTable.id, messageId),
              eq(MessageTable.channelId, channel.id),
              eq(MessageTable.organizationId, orgInfo.id),
              isNull(MessageTable.threadId),
            ),
          );

        if (!existingMessage) {
          throw new TRPCError({ code: "NOT_FOUND", message: "NF" });
        }

        parentMessageId = existingMessage.id;
      }

      const [created] = await db
        .insert(MessageTable)
        .values({
          message,
          image: image ?? null,
          userId: existingUser.id,
          channelId: channel.id,
          organizationId: orgInfo.id,
          threadId: parentMessageId ?? null,
        })
        .returning();

      broadcastToChannel(channel.id, {
        type: SOCKET_EVENT[
          messageId ? "THREAD_MESSAGE_CREATED" : "MESSAGE_CREATED_EDITED"
        ],
        channelId: channel.id,
        messageId: parentMessageId ?? created.id,
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
  getThread: protectedProcedure
    .input(
      z.object({
        messageId: z.uuid().nullable(),
        channelId: z.uuid(),
        workspaceId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { messageId, channelId, workspaceId } = input;
      const { id: userId } = ctx.auth.user;

      if (!messageId) return null;

      const existingUser = await checkExistingUserTRPC(userId);
      const { organization: orgInfo } = await checkExistingWorkspaceMemberTRPC({
        userId: existingUser.id,
        workspaceId,
      });
      const existingChannel = await checkExistingChannelTRPC({
        channelId,
        workspaceId: orgInfo.id,
      });

      const existingMessageThread = await db.query.MessageTable.findFirst({
        where: and(
          eq(MessageTable.id, messageId),
          eq(MessageTable.organizationId, orgInfo.id),
          eq(MessageTable.channelId, existingChannel.id),
          isNull(MessageTable.threadId),
        ),
        with: {
          threadMessages: {
            with: {
              user: true,
              reactions: true,
            },
            orderBy: [asc(MessageTable.createdAt), asc(MessageTable.id)],
          },
          user: true,
        },
      });

      if (!existingMessageThread) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NF" });
      }

      return existingMessageThread;
    }),
});
