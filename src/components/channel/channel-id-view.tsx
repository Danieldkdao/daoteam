import { Suspense } from "react";

type ChannelIdViewProps = {
  params: Promise<{ workspaceId: string; channelId: string }>;
};

export const ChannelIdView = (props: ChannelIdViewProps) => {
  return (
    <Suspense fallback={<ChannelIdLoading />}>
      <ChannelIdSuspense {...props} />
    </Suspense>
  );
};

const ChannelIdLoading = () => {
  return <div>loading</div>;
};

const ChannelIdSuspense = async ({ params }: ChannelIdViewProps) => {
  const { workspaceId, channelId } = await params;

  return (
    <div>
      {workspaceId}, {channelId}
    </div>
  );
};
