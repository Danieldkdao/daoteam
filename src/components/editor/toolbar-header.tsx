import type { Editor } from "@tiptap/react";
import { ToolbarButton } from "./toolbar-button";
import {
  BoldIcon,
  Code2Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  Redo2Icon,
  SparklesIcon,
  StrikethroughIcon,
  Undo2Icon,
} from "lucide-react";
import { Button } from "../ui/button";

type ToolbarEditorProps = {
  editor: Editor;
  showAICompose?: boolean;
};

export const ToolbarHeader = ({
  editor,
  showAICompose = true,
}: ToolbarEditorProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b px-3 py-3">
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
      {showAICompose && (
        <>
          <div className="mx-1 h-6 w-px bg-border" />

          <Button className="rounded-full bg-linear-90 from-purple-700 to-fuchsia-600 text-white border-none px-4">
            <SparklesIcon className="text-white" />
            Compose
          </Button>
        </>
      )}
    </div>
  );
};
