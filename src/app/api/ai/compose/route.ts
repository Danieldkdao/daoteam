import {
  canPermissionAction,
  incrementUsage,
} from "@/lib/actions/usage.action";
import { cohere } from "@/lib/ai";
import { auth } from "@/lib/auth/auth";
import { UNAUTHED_MESSAGE } from "@/lib/constants";
import { AI_COMPOSE_SYSTEM_PROMPT, getAIComposePrompt } from "@/lib/prompts";
import { streamText, UIMessage } from "ai";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json(UNAUTHED_MESSAGE, { status: 401 });

  const {
    messages,
    workspaceId,
  }: { messages: UIMessage[]; workspaceId?: string } = await req.json();
  if (!workspaceId) {
    return NextResponse.json("Bad Request", { status: 400 });
  }

  const allowed = await canPermissionAction({
    workspaceId,
    feature: "aiMessages",
  });
  if (!allowed) {
    return NextResponse.json(
      "You have reached the limits of your plan. Please upgrade to continue.",

      { status: 429 },
    );
  }

  const latestUserMessage = messages
    .filter((msg) => msg.role === "user")
    .at(-1)
    ?.parts.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ");

  if (!latestUserMessage) {
    return NextResponse.json("No user message.", { status: 400 });
  }

  const result = streamText({
    model: cohere("command-r-08-2024"),
    system: AI_COMPOSE_SYSTEM_PROMPT,
    prompt: getAIComposePrompt(latestUserMessage),
    onFinish: async () => {
      await incrementUsage({ workspaceId, feature: "aiMessages" });
    },
  });

  return result.toUIMessageStreamResponse();
};
