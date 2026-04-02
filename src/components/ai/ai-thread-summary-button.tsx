"use client";

import { Loader2Icon, SparklesIcon, TriangleAlertIcon } from "lucide-react";
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
import { MarkdownRenderer } from "../markdown-renderer";
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

const AIThreadSummaryError = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-destructive/10 p-2">
          <TriangleAlertIcon className="size-4 text-destructive" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="font-medium text-foreground">
            Couldn&apos;t summarize this thread
          </p>
          <p className="text-muted-foreground">
            The summary request failed before we got a response. Try again and
            we&apos;ll generate a fresh summary.
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

export const AIThreadSummaryButton = ({ threadId }: { threadId: string }) => {
  const [open, setOpen] = useState(false);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/summarize",
      credentials: "include",
      body: {
        threadId,
      },
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
    setOpen(true);
    await sendMessage({
      role: "user",
      parts: [{ type: "text", text: "Sent" }],
    });
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
          Summarize
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-100" align="end">
        <PopoverHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-linear-90 from-purple-700 to-fuchsia-600 text-white size-8 flex items-center justify-center">
                <SparklesIcon className="size-4" />
              </div>
              <span className="text-base font-medium">
                AI Summary (Preview)
              </span>
            </div>
            {status === "streaming" && (
              <Loader2Icon className="text-fuchsia-600 size-4 animate-spin" />
            )}
          </div>
        </PopoverHeader>
        <Separator />
        <div>
          {isLoading ? (
            <AIComposeLoading />
          ) : isError ? (
            <AIThreadSummaryError onRetry={() => void handleGenerate()} />
          ) : (
            <div className="max-h-80 overflow-auto text-base">
              <MarkdownRenderer>{latestResponse ?? ""}</MarkdownRenderer>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
