import { db } from "@/db/db";
import { user } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { authedProcedure, createTRPCRouter } from "../init";

export const pricingRouter = createTRPCRouter({
  continueWithFreePlan: authedProcedure.mutation(async ({ ctx }) => {
    try {
      await db
        .update(user)
        .set({
          onboardingPhase: "completed",
        })
        .where(
          and(
            eq(user.id, ctx.auth.user.id),
            eq(user.onboardingPhase, "select-plan"),
          ),
        );

      return { message: "Success" };
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Failed to continue with free plan.",
      });
    }
  }),
});
