import {
  checkExistingChannel,
  checkExistingUser,
  checkExistingWorkspaceMember,
} from "@/lib/checks";
import { cloudinary } from "@/lib/cloudinary/cloudinary";
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

export const handleImageUpload = async (image: string | null | undefined) => {
  let imageData: { imageUrl: string | null; publicId: string | null } = {
    imageUrl: null,
    publicId: null,
  };
  if (!image) return imageData;
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "daoteam",
      resource_type: "image",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    });
    if (result?.secure_url && result.public_id) {
      imageData = {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      };
    }

    return imageData;
  } catch (error) {
    console.error(error);
    return imageData;
  }
};
