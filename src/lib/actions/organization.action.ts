"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { UNAUTHED_MESSAGE } from "../constants";
import { generateSlug } from "../utils";
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createOrganization = async (orgName: string) => {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) return { error: true, message: UNAUTHED_MESSAGE };

  try {
    await auth.api.createOrganization({
      body: {
        name: orgName,
        slug: generateSlug(orgName, session.user.id),
        userId: session.user.id,
        keepCurrentActiveOrganization: false,
      },
      headers: h,
    });
    await db
      .update(user)
      .set({
        onboardingPhase: "select-plan",
      })
      .where(eq(user.id, session.user.id));

    return { error: false, message: "Organization created successfully!" };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Something went wrong. Failed to create organization.",
    };
  }
};
