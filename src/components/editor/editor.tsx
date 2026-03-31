"use client";

import { Editor, EditorContent } from "@tiptap/react";
import { Toolbar } from "./toolbar";

type TextEditorProps = {
  editor: Editor | null;
  showAICompose?: boolean;
};

export const TextEditor = ({
  editor,
  showAICompose = true,
}: TextEditorProps) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <Toolbar editor={editor} showAICompose={showAICompose} />
      <EditorContent editor={editor} className="w-full" />
    </>
  );
};
