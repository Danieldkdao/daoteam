"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const ChannelListHeaderView = () => {
  const params = useParams();
  const { workspaceId } = params as { workspaceId: string | undefined };
  const trpc = useTRPC();
  const {
    data: workspaceData,
    isPending,
    isError,
  } = useQuery(trpc.workspace.getOne.queryOptions({ workspaceId }));

  if (isPending) return <ChannelListHeaderLoading />;
  if (isError) return <ChannelListHeaderError />;

  return (
    <div className="px-5 py-6 border-b">
      <div className="w-full overflow-x-auto">
        <h1 className="text-3xl font-bold whitespace-nowrap">
          {workspaceData?.name ?? "Channels"}
        </h1>
      </div>
    </div>
  );
};

const ChannelListHeaderLoading = () => {
  return (
    <div className="px-5 py-6 border-b">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-9 w-40 rounded-xl" />
      </div>
    </div>
  );
};

const ChannelListHeaderError = () => {
  return (
    <div className="px-5 py-4 border-b">
      <div className="rounded-lg border border-dashed border-destructive/35 bg-destructive/8 p-4">
        <h2 className="text-sm font-semibold text-destructive">
          Unable to load workspace
        </h2>
        <p className="mt-1 text-sm text-destructive/80">
          Something went wrong while loading the workspace header. Please
          refresh and try again.
        </p>
      </div>
    </div>
  );
};
