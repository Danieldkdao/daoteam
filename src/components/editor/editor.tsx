"use client";

import { cn } from "@/lib/utils";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import {
  BoldIcon,
  Code2Icon,
  ImageIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  Redo2Icon,
  SendIcon,
  SparklesIcon,
  StrikethroughIcon,
  Undo2Icon,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingSwap } from "../ui/loading-swap";

type TextEditorProps = {
  channelId: string;
  workspaceId: string;
};

export const TextEditor = (props: TextEditorProps) => {
  // const sendMessage = useMutation(
  //   trpc.message.create.mutationOptions({
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(trpc.message.getMany.queryOptions(props));
  //       setMessage("");
  //     },
  //     onError: () => {
  //       toast.error(
  //         "Something went wrong. Please try again or come back later.",
  //       );
  //     },
  //   }),
  // );
  const [message, setMessage] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Markdown,
    ],
    content: message,
    onUpdate({ editor }) {
      setMessage((editor.storage as any).markdown.getMarkdown());
    },
    autofocus: "end",
    editable: true,
    injectCSS: true,
    editorProps: {
      attributes: {
        class:
          "h-32 overflow-auto border px-4 py-3 text-foreground shadow-xs outline-hidden transition-colors placeholder:text-muted-foreground [&_p]:my-3 [&_h1]:my-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:my-3 [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
      },
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
  });

  if (!editor) {
    return null;
  }

  // const handleSendMessage = async () => {
  //   if (!message.trim())
  //     return toast.error("Please enter a message before sending.");
  //   await sendMessage.mutateAsync({ ...props, message });
  // };

  return (
    <div className="w-full rounded-lg border bg-sidebar shadow-xs">
      <div className="flex flex-wrap items-center gap-4 border-b px-3 py-3">
        <ToolbarButton
          label="Bold"
          isActive={editor.isActive("bold")}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          isActive={editor.isActive("italic")}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Strike"
          isActive={editor.isActive("strike")}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Code Block"
          isActive={editor.isActive("codeBlock")}
          disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2Icon />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton
          label="Bullet List"
          isActive={editor.isActive("bulletList")}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Ordered List"
          isActive={editor.isActive("orderedList")}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrderedIcon />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton
          label="Undo"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2Icon />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2Icon />
        </ToolbarButton>

        <div className="mx-1 h-6 w-px bg-border" />

        <Button
          className="rounded-full bg-linear-90 from-purple-700 to-fuchsia-600 text-white border-none px-4"
          // disabled={!message.trim() || sendMessage.isPending}
        >
          <SparklesIcon className="text-white" />
          Compose
        </Button>
      </div>
      <EditorContent editor={editor} className="w-full" />
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <Button
          variant="outline"
          // disabled={sendMessage.isPending}
        >
          <ImageIcon />
          Attach Image
        </Button>
        <Button
        // disabled={!message.trim() || sendMessage.isPending}
        // onClick={handleSendMessage}
        >
          {/* <LoadingSwap 
          // isLoading={sendMessage.isPending}
          >
            <div className="flex items-center gap-2">
              <SendIcon />
              Send Message
            </div>
          </LoadingSwap> */}
        </Button>
      </div>
    </div>
  );
};

const ToolbarButton = ({
  children,
  className,
  disabled,
  isActive = false,
  label,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
  label: string;
  onClick: () => void;
}) => {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant={isActive ? "secondary" : "ghost"}
      className={cn("shrink-0", className)}
      disabled={disabled}
      aria-label={label}
      aria-pressed={isActive}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
