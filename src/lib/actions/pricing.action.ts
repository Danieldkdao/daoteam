"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { UNAUTHED_MESSAGE } from "../constants";

export const continueWithFreePlan = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: true, message: UNAUTHED_MESSAGE };

  try {
    await db
      .update(user)
      .set({
        onboardingPhase: "completed",
      })
      .where(
        and(
          eq(user.id, session.user.id),
          eq(user.onboardingPhase, "select-plan"),
        ),
      );

    return { error: false, message: "Success" };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Something went wrong. Failed to continue with free plan.",
    };
  }
};
