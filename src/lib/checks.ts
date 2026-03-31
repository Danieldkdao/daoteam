import { db } from "@/db/db";
import { ChannelTable, member, organization, user } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const checkExistingUser = async (userId: string) => {
  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, userId));

  const message = existingUser ? null : ("NOUSER" as const);
  return { user: existingUser ?? null, message };
};

export const checkExistingWorkspaceMember = async ({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}) => {
  const [existingOrganization] = await db
    .select()
    .from(organization)
    .where(eq(organization.id, workspaceId));

  if (!existingOrganization)
    return { org: null, member: null, message: "NOORG" as const };

  const [existingMember] = await db
    .select()
    .from(member)
    .where(
      and(
        eq(member.userId, userId),
        eq(member.organizationId, existingOrganization.id),
      ),
    );

  if (!existingMember)
    return { org: null, member: null, message: "NOMEMBER" as const };

  return { org: existingOrganization, member: existingMember, message: null };
};

export const checkExistingChannel = async ({
  channelId,
  workspaceId,
}: {
  channelId: string;
  workspaceId: string;
}) => {
  const [existingChannel] = await db
    .select()
    .from(ChannelTable)
    .where(
      and(
        eq(ChannelTable.organizationId, workspaceId),
        eq(ChannelTable.id, channelId),
      ),
    );

  const message = existingChannel ? null : ("NOCHANNEL" as const);

  return { channel: existingChannel ?? null, message };
};
