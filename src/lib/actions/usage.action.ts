"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { checkExistingWorkspaceMember } from "../checks";
import { getActiveSubscription } from "./auth.action";
import { PaidFeature } from "../types";
import { db } from "@/db/db";
import { organization } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { isResetReady } from "../utils";

export const getUsageAction = async (workspaceId: string) => {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) return;

  const result = await checkExistingWorkspaceMember({
    userId: session.user.id,
    workspaceId,
  });

  if (result.message !== null) return;

  const activeSubscription = await getActiveSubscription(workspaceId);

  const aiMessagesLimit = (
    activeSubscription ? activeSubscription.limits?.aiMessages : 50
  ) as number | null;
  const aiThreadSummariesLimit = (
    activeSubscription ? activeSubscription.limits?.aiThreadSummaries : 1
  ) as number | null;

  const defaultReturnValue = {
    aiMessages: {
      limit: aiMessagesLimit,
      usage: result.org.aiMessages,
    },
    aiThreadSummaries: {
      limit: aiThreadSummariesLimit,
      usage: result.org.aiThreadSummaries,
    },
    plan: activeSubscription?.plan ?? "free",
  };

  if (!isResetReady(result.org.lastResetOn)) return defaultReturnValue;

  const update = await auth.api.updateOrganization({
    body: {
      data: {
        aiMessages: 0,
        aiThreadSummaries: 0,
        lastResetOn: new Date(),
      },
      organizationId: workspaceId,
    },
    headers: h,
  });

  if (!update) return defaultReturnValue;
  return {
    aiMessages: {
      limit: aiMessagesLimit,
      usage: update.aiMessages,
    },
    aiThreadSummaries: {
      limit: aiThreadSummariesLimit,
      usage: update.aiThreadSummaries,
    },
    plan: activeSubscription?.plan ?? "free",
  };
};

export const canPermissionAction = async ({
  workspaceId,
  feature,
}: {
  workspaceId: string;
  feature: PaidFeature;
}) => {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  if (!session) return false;
  const result = await checkExistingWorkspaceMember({
    userId: session.user.id,
    workspaceId,
  });
  if (result.message !== null) return false;
  if (isResetReady(result.org.lastResetOn)) {
    await auth.api.updateOrganization({
      body: {
        data: {
          aiMessages: 0,
          aiThreadSummaries: 0,
          lastResetOn: new Date(),
        },
        organizationId: workspaceId,
      },
      headers: h,
    });
    return true;
  }

  const activeSubscription = await getActiveSubscription(workspaceId);
  const currentPlan = activeSubscription?.plan ?? "free";
  if (currentPlan === "enterprise") return true;
  const limits: Record<PaidFeature, number> = {
    aiMessages: (activeSubscription?.limits?.aiMessages ?? 50) as number,
    aiThreadSummaries: (activeSubscription?.limits?.aiThreadSummaries ??
      1) as number,
  };
  return result.org[feature] < limits[feature];
};

export const incrementUsage = async ({
  workspaceId,
  feature,
}: {
  workspaceId: string;
  feature: PaidFeature;
}) => {
  await db
    .update(organization)
    .set({
      [feature]: sql`${organization[feature]} + 1`,
    })
    .where(eq(organization.id, workspaceId));
};
