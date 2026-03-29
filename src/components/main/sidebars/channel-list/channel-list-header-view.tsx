"use client";

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
  return <div>loading</div>;
};

const ChannelListHeaderError = () => {
  return <div>error</div>;
};
