"use client";

import { useChannelSocket } from "@/hooks/use-channel-socket";
import { SOCKET_EVENT } from "@/lib/ws/events";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MessageHeader } from "../messages/message-header";
import { MessageSkeleton } from "../messages/message-skeleton";
import { MessagesList } from "../messages/messages-list";
import { SendMessageField } from "../messages/send-message";
import { Skeleton } from "../ui/skeleton";

type ChannelIdViewProps = {
  workspaceId: string;
  channelId: string;
};

export const ChannelIdView = (props: ChannelIdViewProps) => {
  return (
    <Suspense fallback={<ChannelIdLoading />}>
      <ErrorBoundary fallback={<ChannelIdError />}>
        <ChannelIdSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ChannelIdLoading = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-4 border-b px-5">
        <Skeleton className="h-8 w-40 rounded-lg" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="size-10 rounded-md" />
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden p-5">
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
  );
};

const ChannelIdError = () => {
  return <div>error</div>;
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
      event.type !== SOCKET_EVENT.MESSAGE_CREATED_EDITED ||
      event.channelId !== channelId
    ) {
      return;
    }

    void queryClient.invalidateQueries(messageQueryOptions);
  });
  const { data } = useSuspenseQuery(messageQueryOptions);
  const channel = data.channel;
  const messages = data.messages;

  return (
    <div className="flex flex-col h-full">
      <MessageHeader channelSlug={channel.slug} />
      <MessagesList messages={messages} />
      <div className="p-4 border-t">
        <SendMessageField channelId={channelId} workspaceId={workspaceId} />
      </div>
    </div>
  );
};
