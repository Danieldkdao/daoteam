"use client";

import { cn } from "@/lib/utils";
import { GetProcedureOutput } from "@/trpc/types";
import {
  MessageSquareIcon,
  MessageSquareTextIcon,
  PenIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { MarkdownRenderer } from "../markdown-renderer";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { UserAvatar } from "../user-avatar";
import { EditMessage } from "./edit-message";
import { EmojiPopoverButton } from "./emoji-popover-button";
import { useThreadMessage } from "@/hooks/use-thread-message";
import Image from "next/image";
import { authClient } from "@/lib/auth/auth-client";

type MessageProps = {
  message: GetProcedureOutput<"message", "getMany">["messages"][number];
  compact?: boolean;
  forThread?: boolean;
};

export const Message = ({
  message,
  compact = false,
  forThread = false,
}: MessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = authClient.useSession();
  const { setCurrentThreadMessage } = useThreadMessage();
  const formattedDate = useMemo(() => {
    const datePart = message.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timePart = message.createdAt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${datePart} at ${timePart}`;
  }, [message.createdAt]);

  return (
    <div
      className={cn(
        "p-4 relative rounded-lg transition-colors duration-200 flex items-start gap-4",
        !isEditing && !compact && "group",
        !compact && "hover:bg-card hover:shadow-sm",
      )}
    >
      <UserAvatar
        name={message.user.name}
        image={message.user.image}
        className="size-12"
        textClassName="text-xl font-medium"
      />
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-1",
          compact && "max-h-20 overflow-auto",
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{message.user.name}</span>
          <span>{formattedDate}</span>
        </div>

        {isEditing ? (
          <EditMessage
            channelId={message.channelId}
            workspaceId={message.organizationId}
            messageId={message.id}
            originalMessage={message.message}
            setIsEditing={setIsEditing}
          />
        ) : (
          <div>
            <MarkdownRenderer>{message.message}</MarkdownRenderer>
          </div>
        )}

        {message.image && (
          <div className="p-1 border rounded-md bg-background w-fit mb-1">
            <div className="relative h-fit w-fit max-w-full self-start bg-red-400 rounded-md overflow-hidden">
              <Image
                src={message.image}
                alt="Message image"
                width={320}
                height={160}
                className="h-full w-auto max-w-full object-contain object-top-left"
              />
            </div>
          </div>
        )}

        {message.replyCount > 0 && (
          <button
            className="flex items-center gap-2 mb-2 cursor-pointer"
            onClick={() => setCurrentThreadMessage(message.id)}
          >
            <MessageSquareIcon className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {message.replyCount} replies
            </span>
          </button>
        )}

        {forThread && (
          <EmojiPopoverButton
            channelId={message.channelId}
            workspaceId={message.organizationId}
            messageId={message.id}
            forThread={forThread}
          />
        )}

        <div className="flex items-center gap-2 flex-wrap w-full">
          {message.reactions.map((r, index) => (
            <div
              key={`${r.reaction}${index}`}
              className="flex items-center gap-2 rounded-full py-0.5 px-2.5 bg-primary/50 border border-primary"
            >
              <span>{r.reaction}</span>
              <span className="text-sm font-semibold">{r.count}</span>
            </div>
          ))}
        </div>
      </div>
      {!forThread && (
        <div className="absolute flex opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto bg-background rounded-md p-2 items-center gap-2 -top-1 -right-1 shadow-sm border transition-opacity duration-200">
          {session?.user.id === message.userId && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIsEditing(true)}
                >
                  <PenIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit message</TooltipContent>
            </Tooltip>
          )}
          <EmojiPopoverButton
            channelId={message.channelId}
            workspaceId={message.organizationId}
            messageId={message.id}
            forThread={false}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setCurrentThreadMessage(message.id)}
              >
                <MessageSquareTextIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply in thread</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
