"use client";

import { GetProcedureOutput } from "@/trpc/types";
import { UserAvatar } from "../user-avatar";
import { useMemo, useState } from "react";
import { MarkdownRenderer } from "../markdown-renderer";
import { Button } from "../ui/button";
import { MessageSquareTextIcon, PenIcon, SmilePlusIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { EditMessage } from "./edit-message";
import { cn } from "@/lib/utils";

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
      </div>
      <div className="absolute hidden group-hover:flex bg-background rounded-md p-2 items-center gap-2 -top-1 -right-1 shadow-sm border">
        {/* todo: investigate odd behavior where after cursor just leaves trigger, then the tooltip content appears in the top left of the entire screen briefly */}
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <SmilePlusIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add reaction</TooltipContent>
        </Tooltip>
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
