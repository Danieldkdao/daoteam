import { MainLayoutShell } from "@/components/main/main-layout-shell";
import { ChannelListSidebar } from "@/components/main/sidebars/channel-list/channel-list-sidebar";
import { WorkspaceListSidebar } from "@/components/main/sidebars/workspace-list/workspace-list-sidebar";
import { ReactNode } from "react";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <MainLayoutShell
      desktopSidebars={
        <>
          <WorkspaceListSidebar />
          <ChannelListSidebar />
        </>
      }
      mobileSidebar={
        <>
          <WorkspaceListSidebar className="w-24 sm:w-28" />
          <ChannelListSidebar className="min-w-0 flex-1 border-r-0" />
        </>
      }
    >
      {children}
    </MainLayoutShell>
  );
};

export default MainLayout;
