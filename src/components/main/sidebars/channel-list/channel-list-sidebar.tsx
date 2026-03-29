import { ChannelList } from "./channel-list";
import { MembersList } from "./members-list";

export const ChannelListSidebar = () => {
  return (
    <div className="w-80 bg-sidebar border-r flex flex-col h-full min-h-0">
      <div className="px-5 py-6 border-b">
        <h1 className="text-3xl font-bold">DaoTeam Main</h1>
      </div>
      <ChannelList />
      <MembersList />
    </div>
  );
};
