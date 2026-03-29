import { ChannelIdView } from "@/components/channel/channel-id-view";

const ChannelIdPage = (props: {
  params: Promise<{ workspaceId: string; channelId: string }>;
}) => {
  return <ChannelIdView {...props} />;
};

export default ChannelIdPage;
