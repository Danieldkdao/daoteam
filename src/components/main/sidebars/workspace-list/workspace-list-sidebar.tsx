import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CreateWorkspaceButton } from "./create-workspace-button";
import { UserProfileSection } from "./user-profile-section";
import { Suspense } from "react";
import { WorkspaceListView } from "./workspace-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const WorkspaceListSidebar = async ({
  mobile = false,
  className,
}: {
  mobile?: boolean;
  className?: string;
}) => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.workspace.getMany.queryOptions());

  if (mobile) {
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="border-b bg-sidebar px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-sm font-medium text-muted-foreground">
                Workspaces
              </span>
              <p className="text-base font-semibold">Switch Workspace</p>
            </div>
            <Suspense fallback={<UserProfileSectionLoading mobile />}>
              <UserProfileSection mobile />
            </Suspense>
          </div>
          <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
            <WorkspaceListView mobile />
            <CreateWorkspaceButton mobile />
          </div>
        </div>
      </HydrationBoundary>
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div
        className={cn(
          "h-full w-28 border-r bg-sidebar p-4 flex flex-col gap-2",
          className,
        )}
      >
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

const UserProfileSectionLoading = ({ mobile = false }: { mobile?: boolean }) => {
  if (mobile) {
    return <Skeleton className="size-11 rounded-full" />;
  }

  return (
    <div className="w-full h-20 rounded-lg border bg-card p-4 flex items-center justify-center">
      <Skeleton className="size-11 rounded-full" />
    </div>
  );
};
