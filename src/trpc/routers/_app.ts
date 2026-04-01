import { createTRPCRouter } from "../init";
import { channelRouter } from "../procedures/channel.procedure";
import { invitationRouter } from "../procedures/invitation.procedure";
import { messageRouter } from "../procedures/message.procedure";
import { reactionRouter } from "../procedures/reaction.procedure";
import { workspaceRouter } from "../procedures/workspace.procedure";

export const appRouter = createTRPCRouter({
  channel: channelRouter,
  workspace: workspaceRouter,
  message: messageRouter,
  reaction: reactionRouter,
  invitation: invitationRouter,
});
export type AppRouter = typeof appRouter;
