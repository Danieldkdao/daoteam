"use client";

import { CreateChannelButton } from "@/components/channel/create-channel-button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ChannelList } from "./channel-list";

export const ChannelListView = () => {
  const {
    workspaceId,
    channelId,
  }: { workspaceId: string | undefined; channelId: string | undefined } =
    useParams();
  const trpc = useTRPC();
  const {
    data: channels,
    isPending,
    isError,
  } = useQuery(trpc.channel.getMany.queryOptions({ workspaceId }));

  if (isPending) return <ChannelListLoading />;
  if (isError) return <ChannelListError />;

  return (
    <div className="p-5 space-y-4 flex-1 flex flex-col min-h-0">
      <CreateChannelButton />
      <ChannelList channels={channels ?? []} />
    </div>
  );
};

export const ChannelListLoading = () => {
  return <div>loading</div>;
};

export const ChannelListError = () => {
  return <div>error</div>;
};
