import { db } from "@/db/db";
import { ChannelTable, member, organization, user } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const checkExistingUser = async (userId: string) => {
  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, userId));
  if (!existingUser) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "UA" });
  }
  return existingUser;
};

export const checkExistingWorkspaceMember = async ({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}) => {
  const [existingOrganization] = await db
    .select()
    .from(organization)
    .where(eq(organization.id, workspaceId));
  if (!existingOrganization) {
    throw new TRPCError({ code: "NOT_FOUND", message: "ONF" });
  }

  const [existingMember] = await db
    .select()
    .from(member)
    .where(
      and(
        eq(member.userId, userId),
        eq(member.organizationId, existingOrganization.id),
      ),
    );

  if (!existingMember) {
    throw new TRPCError({ code: "FORBIDDEN", message: "F" });
  }

  return {
    member: existingMember,
    organization: existingOrganization,
  };
};

export const checkExistingChannel = async ({
  channelId,
  workspaceId,
}: {
  channelId: string;
  workspaceId: string;
  userId: string;
}) => {
  const [existingChannel] = await db
    .select()
    .from(ChannelTable)
    .where(
      and(
        eq(ChannelTable.id, channelId),
        eq(ChannelTable.organizationId, workspaceId),
      ),
    );

  if (!existingChannel) {
    throw new TRPCError({ code: "NOT_FOUND", message: "CNF" });
  }

  return existingChannel;
};
