"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ChannelList } from "./channel-list";

export const ChannelListView = () => {
  const { workspaceId } = useParams() as { workspaceId: string | undefined };
  const trpc = useTRPC();
  const {
    data: channels,
    isPending,
    isError,
  } = useQuery(trpc.channel.getMany.queryOptions({ workspaceId }));

  if (isPending) return <ChannelListLoading />;
  if (isError) return <ChannelListError />;

  return <ChannelList channels={channels ?? []} />;
};

export const ChannelListLoading = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-5">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="size-4 rounded-full" />
      </div>
      <div className="mt-4 space-y-1.5 overflow-hidden">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="rounded-md px-2 py-1.5">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-5 w-4 rounded-sm" />
              <Skeleton
                className="h-5 rounded-md"
                style={{
                  width: `${Math.max(40, 82 - index * 7)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChannelListError = () => {
  return (
    <div className="flex flex-1 p-5">
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
