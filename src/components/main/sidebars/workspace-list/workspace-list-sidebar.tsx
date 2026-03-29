import { CreateWorkspaceButton } from "./create-workspace-button";
import { UserProfileSection } from "./user-profile-section";
import { Suspense } from "react";
import { WorkspaceList } from "./workspace-list";

export const WorkspaceListSidebar = () => {
  return (
    <div className="w-28 bg-sidebar h-full border-r p-4 flex flex-col gap-2">
      <div className="flex-1 h-full flex flex-col gap-2">
        <Suspense>
          <WorkspaceList />
        </Suspense>

        <CreateWorkspaceButton />
      </div>
      <Suspense>
        {/* todo: add loading skeleton */}
        <UserProfileSection />
      </Suspense>
    </div>
  );
};
