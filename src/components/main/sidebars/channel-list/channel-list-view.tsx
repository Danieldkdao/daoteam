"use client";

import { CreateChannelButton } from "@/components/channel/create-channel-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ChannelList } from "./channel-list";

export const ChannelListView = () => {
  const { workspaceId }: { workspaceId: string | undefined } = useParams();
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
  return (
    <div className="p-5 space-y-4 flex-1 flex flex-col min-h-0">
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="space-y-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-lg px-3 py-2"
          >
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="h-5 flex-1 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChannelListError = () => {
  return (
    <div className="p-5 flex-1">
      <div className="rounded-lg border border-dashed border-destructive/35 bg-destructive/8 p-4">
        <h2 className="text-sm font-semibold text-destructive">
          Unable to load channels
        </h2>
        <p className="mt-1 text-sm text-destructive/80">
          Something went wrong while loading this workspace&apos;s channels.
          Please refresh and try again.
        </p>
      </div>
    </div>
  );
};
