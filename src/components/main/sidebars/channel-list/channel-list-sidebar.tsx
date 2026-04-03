import { cn } from "@/lib/utils";
import { ChannelListHeaderView } from "./channel-list-header-view";
import { ChannelListView } from "./channel-list-view";
import { MembersListView } from "./members-list";

export const ChannelListSidebar = ({
  mobile = false,
  className,
}: {
  mobile?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-sidebar flex flex-col min-h-0",
        mobile ? "h-full w-full flex-1" : "h-full w-80 border-r",
        className,
      )}
    >
      <ChannelListHeaderView />
      <ChannelListView />
      <MembersListView />
    </div>
  );
};
