import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import {
  checkExistingChannelTRPC,
  checkExistingUserTRPC,
  checkExistingWorkspaceMemberTRPC,
} from "../helpers";
import { db } from "@/db/db";
import { MessageTable, ReactionTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { broadcastToChannel } from "@/lib/ws/server";
import { SOCKET_EVENT } from "@/lib/ws/events";

export const reactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        reaction: z.string().length(2),
        channelId: z.uuid(),
        workspaceId: z.string(),
        messageId: z.uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { reaction, channelId, workspaceId, messageId } = input;
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

      const [existingMessage] = await db
        .select()
        .from(MessageTable)
        .where(
          and(
            eq(MessageTable.id, messageId),
            eq(MessageTable.channelId, existingChannel.id),
            eq(MessageTable.organizationId, orgInfo.id),
          ),
        );

      if (!existingMessage) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NF" });
      }

      const whereQuery = [
        eq(ReactionTable.channelId, existingChannel.id),
        eq(ReactionTable.messageId, existingMessage.id),
        eq(ReactionTable.userId, existingUser.id),
        eq(ReactionTable.reaction, reaction),
      ];

      const [existingReaction] = await db
        .select()
        .from(ReactionTable)
        .where(and(...whereQuery));

      let reactionToReturn;

      if (existingReaction) {
        [reactionToReturn] = await db
          .delete(ReactionTable)
          .where(and(eq(ReactionTable.id, existingReaction.id), ...whereQuery))
          .returning();
      } else {
        [reactionToReturn] = await db
          .insert(ReactionTable)
          .values({
            reaction,
            channelId: existingChannel.id,
            messageId: existingMessage.id,
            userId: existingUser.id,
          })
          .returning();
      }

      if (!reactionToReturn) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "ISE" });
      }

      broadcastToChannel(existingChannel.id, {
        type: SOCKET_EVENT.MESSAGE_CREATED_EDITED,
        channelId: existingChannel.id,
        messageId: existingMessage.id,
      });

      return reactionToReturn;
    }),
});
