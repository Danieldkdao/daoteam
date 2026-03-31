"use client";

import { MessageSquareIcon, SparklesIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { SendMessageField } from "./send-message";
import { useThreadMessage } from "@/hooks/use-thread-message";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Message } from "./message";
import { MessagesList } from "./messages-list";

type ThreadSidebarProps = {
  channelId: string;
  workspaceId: string;
};

export const ThreadSidebar = (props: ThreadSidebarProps) => {
  const trpc = useTRPC();
  const { currentThreadMessage, setCurrentThreadMessage } = useThreadMessage();
  const {
    data: thread,
    isPending,
    isError,
  } = useQuery(
    trpc.message.getThread.queryOptions(
      {
        ...props,
        messageId: currentThreadMessage,
      },
      { enabled: !!currentThreadMessage },
    ),
  );

  if (!currentThreadMessage) return null;

  if (isPending) {
    return <div className="border-l w-130 shrink-0 flex flex-col">loading</div>;
  }

  if (isError || !thread) {
    return <div className="border-l w-130 shrink-0 flex flex-col">error</div>;
  }

  const { threadMessages, ...message } = thread;

  return (
    <div className="border-l w-130 shrink-0 flex flex-col">
      <div className="px-5 h-16 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="size-5" />
          <span className="text-xl font-medium">Thread</span>
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-full bg-linear-90 from-purple-700 to-fuchsia-600 text-white border-none px-4">
            <SparklesIcon className="text-white" />
            Summarize
          </Button>
          <Button
            variant="outline"
            className="size-11 sm:size-11 [&_svg:not([class*='size-'])]:size-5"
            onClick={() => setCurrentThreadMessage(null)}
          >
            <XIcon />
          </Button>
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col">
        <div className="space-y-2">
          <div className="border-b bg-sidebar/40">
            <Message
              message={{ ...message, reactions: [], replyCount: 0 }}
              compact
            />
          </div>
          <span className="text-muted-foreground text-sm font-medium px-4 w-full">
            {threadMessages.length} replies
          </span>
        </div>

        <MessagesList
          messages={threadMessages.map((msg) => ({
            ...msg,
            reactions: Object.values(
              msg.reactions.reduce<
                Record<string, { reaction: string; count: number }>
              >((acc, reaction) => {
                acc[reaction.reaction] ??= {
                  reaction: reaction.reaction,
                  count: 0,
                };
                acc[reaction.reaction].count += 1;
                return acc;
              }, {}),
            ),
            replyCount: 0,
          }))}
          forThread
        />
      </div>
      <div className="p-4 border-t">
        <SendMessageField
          channelId={message.channelId}
          workspaceId={message.organizationId}
          messageId={message.id}
        />
      </div>
    </div>
  );
};
