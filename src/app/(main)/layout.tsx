import { ChannelListSidebar } from "@/components/main/sidebars/channel-list/channel-list-sidebar";
import { WorkspaceListSidebar } from "@/components/main/sidebars/workspace-list/workspace-list-sidebar";
import { ReactNode } from "react";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full h-svh overflow-hidden">
      <div className="flex h-full">
        <WorkspaceListSidebar />
        <ChannelListSidebar />
      </div>
      <div className="flex-1 w-full h-full overflow-y-auto">{children}</div>
    </div>
  );
};

export default MainLayout;
