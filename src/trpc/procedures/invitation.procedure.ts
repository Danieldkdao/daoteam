import { db } from "@/db/db";
import { invitation } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, gte, not } from "drizzle-orm";
import z from "zod";
import { checkExistingUserTRPC } from "../helpers";
import { createTRPCRouter, protectedProcedure } from "../init";

export const invitationRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        invitationId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id: userId, email } = ctx.auth.user;

      const existingUser = await checkExistingUserTRPC(userId);

      const now = new Date();

      const existingInvitation = await db.query.invitation.findFirst({
        where: and(
          eq(invitation.id, input.invitationId),
          eq(invitation.email, email),
          not(eq(invitation.inviterId, existingUser.id)),
          gte(invitation.expiresAt, now),
          eq(invitation.status, "pending"),
        ),
        with: {
          user: true,
          organization: true,
        },
      });

      if (!existingInvitation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NF" });
      }

      return existingInvitation;
    }),
});
