import { ChannelListHeaderView } from "./channel-list-header-view";
import { ChannelListView } from "./channel-list-view";
import { MembersListView } from "./members-list";

export const ChannelListSidebar = () => {
  return (
    <div className="w-80 bg-sidebar border-r flex flex-col h-full min-h-0">
      <ChannelListHeaderView />
      <ChannelListView />
      <MembersListView />
    </div>
  );
};
