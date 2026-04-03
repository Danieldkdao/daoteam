"use client";

import { useChannelSocket } from "@/hooks/use-channel-socket";
import { SOCKET_EVENT } from "@/lib/ws/events";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MessageHeader } from "../messages/message-header";
import { MessageSkeleton } from "../messages/message-skeleton";
import { MessagesList } from "../messages/messages-list";
import { SendMessageField } from "../messages/send-message";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { ThreadSidebar } from "../messages/thread-sidebar";

type ChannelIdViewProps = {
  workspaceId: string;
  channelId: string;
};

export const ChannelIdView = (props: ChannelIdViewProps) => {
  return (
    <Suspense fallback={<ChannelIdLoading />}>
      <ErrorBoundary
        fallbackRender={() => (
          <ChannelIdError workspaceId={props.workspaceId} />
        )}
      >
        <ChannelIdSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ChannelIdLoading = () => {
  return (
    <div className="flex h-full min-w-0 overflow-hidden w-full">
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <div className="flex h-16 min-w-0 items-center gap-2 border-b px-4 md:gap-4 md:px-5">
          <Skeleton className="size-9 rounded-md xl:hidden" />
          <Skeleton className="h-8 min-w-0 flex-1 rounded-lg" />
          <div className="hidden items-center gap-2 xl:flex">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
          </div>
          <div className="flex shrink-0 items-center gap-2 xl:hidden">
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
          </div>
        </div>
        <div className="flex-1 h-full w-full min-h-0 max-h-full space-y-2 overflow-auto p-5">
          <MessageSkeleton />
          <MessageSkeleton lines={3} />
          <MessageSkeleton align="end" />
          <MessageSkeleton lines={4} />
          <MessageSkeleton />
        </div>
        <div className="border-t p-4">
          <div className="w-full rounded-lg border bg-sidebar shadow-xs">
            <div className="flex flex-wrap items-center gap-3 border-b px-3 py-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="size-8 rounded-md" />
              ))}
              <Skeleton className="ml-2 h-9 w-28 rounded-full" />
            </div>
            <div className="space-y-3 px-4 py-4">
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-3">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChannelIdError = ({
  workspaceId,
}: Pick<ChannelIdViewProps, "workspaceId">) => {
  return (
    <div className="flex h-full min-w-0 overflow-hidden">
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <div className="flex h-16 min-w-0 items-center gap-2 border-b px-4 md:gap-4 md:px-5">
          <Skeleton className="size-9 rounded-md xl:hidden" />
          <Skeleton className="h-8 min-w-0 flex-1 rounded-lg" />
          <div className="hidden items-center gap-2 xl:flex">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="size-10 rounded-md" />
          </div>
          <div className="flex shrink-0 items-center gap-2 xl:hidden">
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="size-9 rounded-md" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-5">
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircleIcon className="size-7" />
            </div>
            <div className="mt-4 space-y-2">
              <h2 className="text-xl font-semibold">
                Couldn&apos;t load channel
              </h2>
              <p className="text-sm text-muted-foreground">
                Something went wrong while loading this channel. Try again, or
                go back to your workspace and reopen it.
              </p>
            </div>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <Button onClick={() => window.location.reload()}>
                <RefreshCwIcon />
                Try Again
              </Button>
              <Link href={`/workspace/${workspaceId}`}>
                <Button variant="outline" className="w-full sm:w-auto">
                  Back to Workspace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChannelIdSuspense = ({ workspaceId, channelId }: ChannelIdViewProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const messageQueryOptions = trpc.message.getMany.queryOptions({
    channelId,
    workspaceId,
  });
  useChannelSocket(channelId, workspaceId, (event) => {
    if (
      event.type === SOCKET_EVENT.MEMBER_ADDED ||
      event.type === SOCKET_EVENT.WORKSPACE_PRESENCE_SYNC
    ) {
      return;
    }

    if (event.channelId !== channelId) return;

    if (event.type === SOCKET_EVENT.MESSAGE_CREATED_EDITED) {
      void queryClient.invalidateQueries(messageQueryOptions);
    } else if (event.type === SOCKET_EVENT.THREAD_MESSAGE_CREATED) {
      void queryClient.invalidateQueries(
        trpc.message.getThread.queryOptions({
          channelId,
          workspaceId,
          messageId: event.messageId,
        }),
      );
      void queryClient.invalidateQueries(messageQueryOptions);
    }
  });
  const { data } = useSuspenseQuery(messageQueryOptions);
  const channel = data.channel;
  const messages = data.messages;

  return (
    <div className="flex h-full min-w-0 overflow-hidden">
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <MessageHeader channelSlug={channel.slug} workspaceId={workspaceId} />
        <MessagesList messages={messages} />
        <div className="p-4 border-t">
          <SendMessageField channelId={channelId} workspaceId={workspaceId} />
        </div>
      </div>
      <ThreadSidebar channelId={channelId} workspaceId={workspaceId} />
    </div>
  );
};
