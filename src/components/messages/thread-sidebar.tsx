"use client";

import {
  AlertCircleIcon,
  MessageSquareIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { SendMessageField } from "./send-message";
import { useThreadMessage } from "@/hooks/use-thread-message";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Message } from "./message";
import { MessagesList } from "./messages-list";
import { MessageSkeleton } from "./message-skeleton";
import { Skeleton } from "../ui/skeleton";

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
    refetch,
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
    return (
      <ThreadSidebarShell onClose={() => setCurrentThreadMessage(null)}>
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="space-y-2">
            <div className="border-b bg-sidebar/40">
              <MessageSkeleton lines={3} />
            </div>
            <Skeleton className="h-4 w-24 ml-4" />
          </div>

          <div className="flex-1 min-h-0 overflow-auto p-5 space-y-2">
            <MessageSkeleton lines={2} />
            <MessageSkeleton lines={3} />
            <MessageSkeleton lines={2} />
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="w-full rounded-lg border bg-sidebar shadow-xs p-4 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </div>
      </ThreadSidebarShell>
    );
  }

  if (isError || !thread) {
    return (
      <ThreadSidebarShell onClose={() => setCurrentThreadMessage(null)}>
        <div className="flex-1 min-h-0 flex items-center justify-center p-6">
          <div className="max-w-sm w-full rounded-2xl border bg-sidebar/40 p-6 text-center space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircleIcon className="size-7" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold">
                Couldn&apos;t load thread
              </h2>
              <p className="text-sm text-muted-foreground">
                The thread content didn&apos;t load. Try again or close the
                sidebar and reopen it.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button onClick={() => void refetch()}>Try Again</Button>
              <Button
                variant="outline"
                onClick={() => setCurrentThreadMessage(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </ThreadSidebarShell>
    );
  }

  const { threadMessages, ...message } = thread;

  return (
    <ThreadSidebarShell onClose={() => setCurrentThreadMessage(null)}>
      <div className="flex-1 min-h-0 min-w-0 flex flex-col">
        <div className="space-y-2 min-w-0">
          <div className="border-b bg-sidebar/40">
            <Message
              message={{ ...message, reactions: [], replyCount: 0 }}
              compact
            />
          </div>
          <span className="text-muted-foreground text-sm font-medium px-6 w-full">
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
    </ThreadSidebarShell>
  );
};

const ThreadSidebarShell = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  return (
    <div className="border-l w-130 shrink-0 flex flex-col min-h-0 overflow-x-hidden">
      <div className="px-5 h-16 border-b flex items-center justify-between min-w-0">
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
            onClick={onClose}
          >
            <XIcon />
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};
