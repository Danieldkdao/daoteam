"use client";

import { useTRPC } from "@/trpc/client";
import { ChannelList } from "./channel-list";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreateChannelButton } from "@/components/channel/create-channel-button";
import { ErrorBoundary } from "react-error-boundary";

export const ChannelListView = () => {
  return (
    <Suspense fallback={<ChannelListLoading />}>
      <ErrorBoundary fallback={<ChannelListError />}>
        <ChannelListSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const ChannelListLoading = () => {
  return <div>loading</div>;
};

export const ChannelListError = () => {
  return <div>error</div>;
};

export const ChannelListSuspense = () => {
  const {
    workspaceId,
    channelId,
  }: { workspaceId: string | undefined; channelId: string | undefined } =
    useParams();
  const trpc = useTRPC();
  const { data: channels } = useSuspenseQuery(
    trpc.channel.getMany.queryOptions({ workspaceId }),
  );

  return (
    <div className="p-5 space-y-4 flex-1 flex flex-col min-h-0">
      <CreateChannelButton />
      <ChannelList channels={channels} />
    </div>
  );
};
