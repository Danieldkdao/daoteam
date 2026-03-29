"use server";

import { headers } from "next/headers";
import { auth } from "../auth/auth";
import { NO_PERMISSIONS_MESSAGE, UNAUTHED_MESSAGE } from "../constants";
import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";
import { ChannelTable, member } from "@/db/schema";
import { generateSlug } from "../utils";

type CreateChannelProps = {
  orgId: string;
  name: string;
};

export const createChannel = async (props: CreateChannelProps) => {
  const { orgId, name } = props;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: true, message: UNAUTHED_MESSAGE };

  try {
    const existingMember = await db.query.member.findFirst({
      where: and(
        eq(member.userId, session.user.id),
        eq(member.organizationId, orgId),
      ),
    });

    if (!existingMember)
      return { error: true, message: "Workspace not found." };
    if (existingMember.role === "member")
      return { error: true, message: NO_PERMISSIONS_MESSAGE };

    const channelSlug = generateSlug(name);

    const [createdChannel] = await db
      .insert(ChannelTable)
      .values({
        name,
        organizationId: orgId,
        slug: channelSlug,
        userId: session.user.id,
      })
      .returning();

    return {
      error: false,
      message: "Channel created successfully!",
      channel: createdChannel,
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Something went wrong. Please try again or come back later.",
    };
  }
};
