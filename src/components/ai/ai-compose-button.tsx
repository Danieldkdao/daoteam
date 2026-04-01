"use client";

import { SparklesIcon, TriangleAlertIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "../ui/popover";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Editor } from "@tiptap/react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

const AIComposeLoading = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full rounded-md bg-primary/40" />
      <Skeleton className="h-4 w-[97%] rounded-md bg-primary/40" />
      <Skeleton className="h-4 w-[92%] rounded-md bg-primary/40" />
      <Skeleton className="h-4 w-[88%] rounded-md bg-primary/40" />
    </div>
  );
};

const AIComposeError = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-destructive/10 p-2">
          <TriangleAlertIcon className="size-4 text-destructive" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="font-medium text-foreground">
            Couldn&apos;t rewrite this message
          </p>
          <p className="text-muted-foreground">
            The compose request failed before we got a response. Try again and
            we&apos;ll generate a fresh rewrite.
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </div>
  );
};

export const AIComposeButton = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = useState(false);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/compose",
      credentials: "include",
    }),
  });

  const latestResponse = messages
    .filter((msg) => msg.role === "assistant")
    .at(-1)
    ?.parts.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  const isLoading = status === "submitted";
  const isError = status === "error";

  const handleGenerate = async () => {
    if (open) return;
    const currentContent = editor.getText();
    if (!currentContent.trim())
      return toast.error("Please enter a message before using AI compose.");
    setOpen(true);
    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: currentContent }],
    });
  };

  const accept = () => {
    if (!latestResponse) return;

    editor
      .chain()
      .focus()
      .setContent({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: latestResponse }],
          },
        ],
      })
      .run();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="rounded-full bg-linear-90 from-purple-700 to-fuchsia-600 text-white border-none px-4"
          onClick={handleGenerate}
          disabled={open}
        >
          <SparklesIcon className="text-white" />
          Compose
        </Button>
      </PopoverTrigger>

      <PopoverContent className="min-w-120 space-y-2">
        <PopoverHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-linear-90 from-purple-700 to-fuchsia-600 text-white size-8 flex items-center justify-center">
              <SparklesIcon className="size-4" />
            </div>
            <span className="text-base font-medium">
              Compose Assist (Preview)
            </span>
          </div>
        </PopoverHeader>
        <Separator />
        <div>
          {isLoading ? (
            <AIComposeLoading />
          ) : isError ? (
            <AIComposeError onRetry={() => void handleGenerate()} />
          ) : (
            <span className="whitespace-pre-wrap text-base">
              {latestResponse}
            </span>
          )}
        </div>
        <Separator />
        <div className="flex flex-col">
          <div className="flex items-center gap-2 self-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Decline
            </Button>
            <Button
              disabled={!latestResponse || isLoading || isError}
              onClick={accept}
            >
              Accept
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
