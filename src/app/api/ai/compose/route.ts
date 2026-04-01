import { cohere } from "@/lib/ai";
import { auth } from "@/lib/auth/auth";
import { UNAUTHED_MESSAGE } from "@/lib/constants";
import { AI_COMPOSE_SYSTEM_PROMPT, getAIComposePrompt } from "@/lib/prompts";
import { streamText, UIMessage } from "ai";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return NextResponse.json({ error: UNAUTHED_MESSAGE }, { status: 401 });

  const { messages }: { messages: UIMessage[] } = await req.json();
  const latestUserMessage = messages
    .filter((msg) => msg.role === "user")
    .at(-1)
    ?.parts.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ");

  if (!latestUserMessage) {
    return NextResponse.json({ error: "No user message." }, { status: 400 });
  }

  // todo: add rate limits based on the users plan

  const result = streamText({
    model: cohere("command-r-08-2024"),
    system: AI_COMPOSE_SYSTEM_PROMPT,
    prompt: getAIComposePrompt(latestUserMessage),
  });

  return result.toUIMessageStreamResponse();
};
