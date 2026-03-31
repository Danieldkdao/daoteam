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
import { and, eq, getTableColumns } from "drizzle-orm";

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
        })
        .from(MessageTable)
        .innerJoin(user, eq(user.id, MessageTable.userId))
        .where(
          and(
            eq(MessageTable.channelId, channel.id),
            eq(MessageTable.organizationId, orgInfo.id),
          ),
        );

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
        type: SOCKET_EVENT.MESSAGE_CREATED,
        channelId: channel.id,
        messageId: created.id,
      });

      return created;
    }),
});
