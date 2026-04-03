"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { checkExistingWorkspaceMember } from "../checks";

export const getActiveSubscription = async (workspaceId: string) => {
  const subscriptions = await auth.api.listActiveSubscriptions({
    query: {
      referenceId: workspaceId,
      customerType: "organization",
    },
    headers: await headers(),
  });

  const activeSubscription = subscriptions.find((s) => s.status === "active");
  return activeSubscription;
};

export const getMemberOrgInfo = async (workspaceId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return "NOAUTH" as const;
  const result = await checkExistingWorkspaceMember({
    userId: session.user.id,
    workspaceId,
  });

  const { message, ...rest } = result;

  if (message !== null) return message;
  return rest;
};
