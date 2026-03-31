import {
  checkExistingChannel,
  checkExistingUser,
  checkExistingWorkspaceMember,
} from "@/lib/checks";
import { TRPCError } from "@trpc/server";

export const checkExistingUserTRPC = async (userId: string) => {
  const response = await checkExistingUser(userId);
  if (response.message === "NOUSER") {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "UA" });
  }
  return response.user;
};

export const checkExistingWorkspaceMemberTRPC = async (props: {
  userId: string;
  workspaceId: string;
}) => {
  const response = await checkExistingWorkspaceMember(props);
  if (response.message === "NOORG") {
    throw new TRPCError({ code: "NOT_FOUND", message: "ONF" });
  }

  if (response.message === "NOMEMBER") {
    throw new TRPCError({ code: "FORBIDDEN", message: "F" });
  }

  return {
    member: response.member,
    organization: response.org,
  };
};

export const checkExistingChannelTRPC = async (props: {
  channelId: string;
  workspaceId: string;
}) => {
  const response = await checkExistingChannel(props);

  if (response.message === "NOCHANNEL") {
    throw new TRPCError({ code: "NOT_FOUND", message: "CNF" });
  }

  return response.channel;
};
