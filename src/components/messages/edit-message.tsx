"use client";

import { SetterType } from "@/lib/types";
import { getEditorConfig } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEditor } from "@tiptap/react";
import { useState } from "react";
import { toast } from "sonner";
import { TextEditor } from "../editor/editor";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";

type EditMessageProps = {
  channelId: string;
  workspaceId: string;
  originalMessage: string;
  messageId: string;
  setIsEditing: SetterType<boolean>;
};

export const EditMessage = ({
  channelId,
  workspaceId,
  originalMessage,
  messageId,
  setIsEditing,
}: EditMessageProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState(originalMessage ?? "");
  const editor = useEditor(getEditorConfig({ message, setMessage }));

  const trimmedMessage = message.trim();

  const editMessage = useMutation(
    trpc.message.edit.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.message.getMany.queryOptions({ channelId, workspaceId }),
        );
        toast.success("Message updated successfully!");
        setIsEditing(false);
      },
      onError: () => {
        toast.error(
          "Something went wrong. Please try again or come back later.",
        );
      },
    }),
  );

  const handleEditMessage = async () => {
    if (!trimmedMessage || trimmedMessage === originalMessage)
      return toast.error("No edits made.");

    await editMessage.mutateAsync({
      channelId,
      message,
      messageId,
      workspaceId,
    });
  };

  return (
    <div className="w-full rounded-lg bg-sidebar border shadow-xs">
      <TextEditor editor={editor} showAICompose={false} />
      <div className="flex flex-col w-full gap-2 px-3 py-3">
        <div className="flex items-center gap-2 self-end">
          <Button
            disabled={editMessage.isPending}
            onClick={() => setIsEditing(false)}
            variant="outline"
          >
            <LoadingSwap isLoading={editMessage.isPending}>Cancel</LoadingSwap>
          </Button>
          <Button
            disabled={!trimmedMessage || editMessage.isPending}
            onClick={handleEditMessage}
          >
            <LoadingSwap isLoading={editMessage.isPending}>
              Save changes
            </LoadingSwap>
          </Button>
        </div>
      </div>
    </div>
  );
};
