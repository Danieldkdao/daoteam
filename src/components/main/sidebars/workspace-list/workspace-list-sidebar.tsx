import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CreateWorkspaceButton } from "./create-workspace-button";
import { UserProfileSection } from "./user-profile-section";
import { Suspense } from "react";
import { WorkspaceList } from "./workspace-list";
import { getQueryClient, trpc } from "@/trpc/server";

export const WorkspaceListSidebar = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.workspace.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
    </HydrationBoundary>
  );
};
