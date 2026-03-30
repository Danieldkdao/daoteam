"use client";

import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { MessageHeader } from "../messages/message-header";
import { TextEditor } from "../editor/editor";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { MessagesList } from "../messages/messages-list";

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
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-5xl space-y-8 rounded-3xl border bg-card p-8">
        <div className="space-y-3">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-12 w-2/5 rounded-2xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 rounded-2xl" />
          ))}
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
  const { data } = useSuspenseQuery(
    trpc.message.getMany.queryOptions({
      channelId,
      workspaceId,
    }),
  );
  const channel = data.channel;
  const messages = data.messages;

  return (
    <div className="flex flex-col h-full">
      <MessageHeader channelSlug={channel.slug} />
      <MessagesList messages={messages} />
      <div className="p-4 border-t">
        <TextEditor workspaceId={workspaceId} channelId={channelId} />
      </div>
    </div>
  );
};
