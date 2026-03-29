import { createTRPCRouter } from "../init";
import { channelRouter } from "../procedures/channel.procedure";
import { messageRouter } from "../procedures/message.procedure";
import { pricingRouter } from "../procedures/pricing.procedure";
import { workspaceRouter } from "../procedures/workspace.procedure";

export const appRouter = createTRPCRouter({
  channel: channelRouter,
  pricing: pricingRouter,
  workspace: workspaceRouter,
  message: messageRouter,
});
export type AppRouter = typeof appRouter;
