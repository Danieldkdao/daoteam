import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CreateWorkspaceButton } from "./create-workspace-button";
import { UserProfileSection } from "./user-profile-section";
import { Suspense } from "react";
import { WorkspaceListView } from "./workspace-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { Skeleton } from "@/components/ui/skeleton";

export const WorkspaceListSidebar = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.workspace.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-28 bg-sidebar h-full border-r p-4 flex flex-col gap-2">
        <div className="flex-1 h-full flex flex-col gap-2">
          <WorkspaceListView />

          <CreateWorkspaceButton />
        </div>
        <Suspense fallback={<UserProfileSectionLoading />}>
          <UserProfileSection />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
};

const UserProfileSectionLoading = () => {
  return (
    <div className="w-full h-20 rounded-lg border bg-card p-4 flex items-center justify-center">
      <Skeleton className="size-11 rounded-full" />
    </div>
  );
};
