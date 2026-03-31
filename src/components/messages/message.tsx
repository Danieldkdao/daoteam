"use client";

import { cn } from "@/lib/utils";
import { GetProcedureOutput } from "@/trpc/types";
import { MessageSquareTextIcon, PenIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { MarkdownRenderer } from "../markdown-renderer";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { UserAvatar } from "../user-avatar";
import { EditMessage } from "./edit-message";
import { EmojiPopoverButton } from "./emoji-popover-button";

export const Message = ({
  message,
}: {
  message: GetProcedureOutput<"message", "getMany">["messages"][number];
}) => {
  const [isEditing, setIsEditing] = useState(false);
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
        "p-4 relative rounded-lg hover:bg-card hover:shadow-sm transition-colors duration-200 flex items-start gap-4",
        !isEditing && "group",
      )}
    >
      <UserAvatar
        name={message.user.name}
        image={message.user.image}
        className="size-12"
        textClassName="text-xl font-medium"
      />
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{message.user.name}</span>
          <span>{formattedDate}</span>
        </div>
        <div>
          {isEditing ? (
            <EditMessage
              channelId={message.channelId}
              workspaceId={message.organizationId}
              messageId={message.id}
              originalMessage={message.message}
              setIsEditing={setIsEditing}
            />
          ) : (
            <MarkdownRenderer>{message.message}</MarkdownRenderer>
          )}
        </div>
        <div className="flex items-center gap-2">
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
      <div className="absolute flex opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto bg-background rounded-md p-2 items-center gap-2 -top-1 -right-1 shadow-sm border transition-opacity duration-200">
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
        <EmojiPopoverButton
          channelId={message.channelId}
          workspaceId={message.organizationId}
          messageId={message.id}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <MessageSquareTextIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reply in thread</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
