import { CreateWorkspaceButton } from "./create-workspace-button";
import { UserProfileSection } from "./user-profile-section";
import { Suspense } from "react";

export const WorkspaceListSidebar = () => {
  return (
    <div className="w-28 bg-sidebar h-full border-r p-4 flex flex-col gap-2">
      <div className="flex-1 h-full flex flex-col gap-2">
        <div className="space-y-2 overflow-auto">
          <div className="rounded-lg bg-card w-full h-20 border flex items-center justify-center ">
            <span className="text-3xl font-bold">G</span>
          </div>
          <div className="rounded-lg bg-card w-full h-20 border flex items-center justify-center ">
            <span className="text-3xl font-bold">G</span>
          </div>
        </div>
        <CreateWorkspaceButton />
      </div>
      <Suspense>
        {/* todo: add loading skeleton */}
        <UserProfileSection />
      </Suspense>
    </div>
  );
};
