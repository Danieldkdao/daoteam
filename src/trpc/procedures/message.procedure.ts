import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import {
  checkExistingChannel,
  checkExistingUser,
  checkExistingWorkspaceMember,
} from "../helpers";
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

      await checkExistingUser(userId);
      const { organization: orgInfo } = await checkExistingWorkspaceMember({
        workspaceId,
        userId,
      });
      const channel = await checkExistingChannel({
        channelId,
        userId,
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
});
