import { db } from "@/db/db";
import { MessageTable } from "@/db/schema";
import {
  canPermissionAction,
  incrementUsage,
} from "@/lib/actions/usage.action";
import { cohere } from "@/lib/ai";
import { auth } from "@/lib/auth/auth";
import { UNAUTHED_MESSAGE } from "@/lib/constants";
import {
  AI_THREAD_SUMMARY_SYSTEM_PROMPT,
  getAIThreadSummaryPrompt,
} from "@/lib/prompts";
import { streamText } from "ai";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const formatThreadMessage = ({
  message,
  image,
  createdAt,
  user,
  index,
  kind,
}: {
  message: string;
  image: string | null;
  createdAt: Date;
  user: { name: string };
  index: number;
  kind: "thread_starter" | "reply";
}) => {
  const contentParts = [message.trim()];

  if (image) {
    contentParts.push("[Attached image]");
  }

  const content = contentParts.filter(Boolean).join("\n");

  return [
    `Message ${index} (${kind === "thread_starter" ? "thread starter" : "reply"})`,
    `Author: ${user.name}`,
    `Sent at: ${createdAt.toISOString()}`,
    `Content: ${content || "[No text content]"}`,
  ].join("\n");
};

export const POST = async (req: Request) => {
  console.log("yes");
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json(UNAUTHED_MESSAGE, { status: 401 });
  console.log("after");

  const { threadId, workspaceId }: { threadId?: string; workspaceId?: string } =
    await req.json();
  if (!threadId || !workspaceId) {
    return NextResponse.json("Bad Request", { status: 400 });
  }

  const allowed = await canPermissionAction({
    workspaceId,
    feature: "aiThreadSummaries",
  });
  if (!allowed) {
    return NextResponse.json(
      "You have reached the limits of your plan. Please upgrade to continue.",

      { status: 429 },
    );
  }

  console.log(allowed);

  const thread = await db.query.MessageTable.findFirst({
    where: eq(MessageTable.id, threadId),
    with: {
      user: true,
      threadMessages: {
        with: {
          user: true,
        },
        orderBy: [asc(MessageTable.createdAt), asc(MessageTable.id)],
      },
    },
  });

  if (!thread) {
    return NextResponse.json("Thread not found.", { status: 404 });
  }

  const threadMessagesForPrompt = [
    formatThreadMessage({
      message: thread.message,
      image: thread.image,
      createdAt: thread.createdAt,
      user: thread.user,
      index: 1,
      kind: "thread_starter",
    }),
    ...thread.threadMessages.map((message, index) =>
      formatThreadMessage({
        message: message.message,
        image: message.image,
        createdAt: message.createdAt,
        user: message.user,
        index: index + 2,
        kind: "reply",
      }),
    ),
  ].join("\n\n");

  const result = streamText({
    model: cohere("command-r-08-2024"),
    system: AI_THREAD_SUMMARY_SYSTEM_PROMPT,
    prompt: getAIThreadSummaryPrompt(threadMessagesForPrompt),
    onFinish: async () => {
      await incrementUsage({ workspaceId, feature: "aiThreadSummaries" });
    },
  });

  return result.toUIMessageStreamResponse();
};
