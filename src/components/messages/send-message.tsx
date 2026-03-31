"use client";

import { getEditorConfig } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEditor } from "@tiptap/react";
import { SendIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { TextEditor } from "../editor/editor";
import { Button } from "../ui/button";
import { LoadingSwap } from "../ui/loading-swap";
import { AttachImageButton } from "./attach-image-button";

type SendMessageFieldProps = {
  channelId: string;
  workspaceId: string;
  messageId?: string;
};

export const SendMessageField = (props: SendMessageFieldProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null | undefined>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const editor = useEditor(getEditorConfig({ message, setMessage }));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const trimmedMessage = message.trim();

  const sendMessage = useMutation(
    trpc.message.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.message.getMany.queryOptions(props),
        );
        if (props.messageId) {
          await queryClient.invalidateQueries(
            trpc.message.getThread.queryOptions({
              ...props,
              messageId: props.messageId ?? null,
            }),
          );
        }
        editor?.commands.clearContent();
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setMessage("");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleSendMessage = async () => {
    if (!trimmedMessage) {
      toast.error("Please enter a message before sending.");
      return;
    }

    await sendMessage.mutateAsync({ ...props, message: trimmedMessage, image });
  };

  return (
    <div className="w-full rounded-lg border bg-sidebar shadow-xs">
      <TextEditor editor={editor} />
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <AttachImageButton
          disabled={sendMessage.isPending}
          image={image}
          setImage={setImage}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          fileInputRef={fileInputRef}
        />
        <Button
          disabled={!trimmedMessage || sendMessage.isPending}
          onClick={handleSendMessage}
        >
          <LoadingSwap isLoading={sendMessage.isPending}>
            <div className="flex items-center gap-2">
              <SendIcon />
              Send Message
            </div>
          </LoadingSwap>
        </Button>
      </div>
    </div>
  );
};
