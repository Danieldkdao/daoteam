"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "../ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SmilePlusIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type EmojiPopoverButtonProps = {
  messageId: string;
  workspaceId: string;
  channelId: string;
};

export const EmojiPopoverButton = (props: EmojiPopoverButtonProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const createReaction = useMutation(
    trpc.reaction.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.message.getMany.queryOptions({
            channelId: props.channelId,
            workspaceId: props.workspaceId,
          }),
        );
      },
      onError: (error) => {
        if (error.data?.code === "NOT_FOUND" && error.message === "NF") {
          toast.error("Message not found.");
        } else {
          toast.error(
            "Something went wrong. Please try again or come back later.",
          );
        }
      },
    }),
  );

  const handleCreateReaction = async (emoji: string) => {
    await createReaction.mutateAsync({ ...props, reaction: emoji });
  };

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen} modal>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={createReaction.isPending}
            >
              <SmilePlusIcon />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Add reaction</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-fit p-0" align="end">
        <EmojiPicker
          className="h-[342px]"
          onEmojiSelect={async ({ emoji }) => {
            setIsOpen(false);
            await handleCreateReaction(emoji);
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
};
