import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { COLOR_COMBINATIONS } from "./constants";
import { MarkdownStorage, GetEditorConfigParams } from "./types";
import type { Editor } from "@tiptap/react";
import { Markdown } from "tiptap-markdown";
import StarterKit from "@tiptap/starter-kit";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateSlug = (text: string, uniqueIdentifier?: string) => {
  if (!text.trim()) return "";
  return (
    text.toLowerCase().replaceAll(/\s+/g, "-") +
    (uniqueIdentifier ? `-${uniqueIdentifier}` : "")
  );
};

export const getColorCombination = (id: string) => {
  const charSum = id
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const colorIndex = charSum % COLOR_COMBINATIONS.length;
  return COLOR_COMBINATIONS[colorIndex];
};

export const getEditorConfig = ({
  message,
  setMessage,
}: GetEditorConfigParams) => {
  return {
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Markdown,
    ],
    content: message,
    onUpdate({ editor }: { editor: Editor }) {
      const storage = editor.storage as unknown as MarkdownStorage;
      setMessage(storage.markdown.getMarkdown());
    },
    autofocus: "end" as const,
    editable: true,
    injectCSS: true,
    editorProps: {
      attributes: {
        class:
          "h-32 overflow-auto border px-4 py-3 text-foreground shadow-xs outline-hidden transition-colors placeholder:text-muted-foreground [&_p]:my-3 [&_h1]:my-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:my-3 [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
      },
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  };
};

export const isResetReady = (date: Date) => {
  const now = new Date();
  return (
    date.getFullYear() > now.getFullYear() ||
    (date.getFullYear() === now.getFullYear() &&
      date.getMonth() > now.getMonth())
  );
};
