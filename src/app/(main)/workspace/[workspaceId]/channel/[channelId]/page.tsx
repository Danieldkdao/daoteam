import { ChannelIdView } from "@/components/channel/channel-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const ChannelIdPage = async ({
  params,
}: {
  params: Promise<{ workspaceId: string; channelId: string }>;
}) => {
  const props = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.message.getMany.queryOptions(props));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChannelIdView {...props} />
    </HydrationBoundary>
  );
};

export default ChannelIdPage;
