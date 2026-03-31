import { Suspense } from "react";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { organization } from "@/db/schema";
import { Skeleton } from "../ui/skeleton";
import { BanIcon } from "lucide-react";

type WorkspaceIdProps = {
  params: Promise<{ workspaceId: string }>;
};

export const WorkspaceIdView = (props: WorkspaceIdProps) => {
  return (
    <Suspense fallback={<WorkspaceIdLoading />}>
      <WorkspaceIdSuspense {...props} />
    </Suspense>
  );
};

const WorkspaceIdLoading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="flex w-full max-w-100 flex-col items-center gap-4 rounded-lg border-2 border-dashed bg-card p-10">
        <div className="rounded-full bg-primary/10 p-3">
          <Skeleton className="size-10 rounded-full" />
        </div>
        <div className="flex w-full flex-col items-center gap-3">
          <Skeleton className="h-8 w-52 rounded-lg" />
          <Skeleton className="h-4 w-72 max-w-full rounded-md" />
          <Skeleton className="h-4 w-80 max-w-full rounded-md" />
          <Skeleton className="h-4 w-64 max-w-full rounded-md" />
        </div>
        <div className="mt-2 flex w-full justify-center gap-3">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
};

const WorkspaceIdSuspense = async ({ params }: WorkspaceIdProps) => {
  const { workspaceId } = await params;
  const existingWorkspace = await db.query.organization.findFirst({
    where: eq(organization.id, workspaceId),
  });

  if (!existingWorkspace) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex w-full max-w-120 flex-col gap-2 rounded-lg border border-dashed border-destructive/35 bg-destructive/8 p-10">
          <h1 className="text-2xl font-bold text-destructive">
            Workspace Not Found
          </h1>
          <p className="text-sm font-medium text-destructive/80">
            We couldn&apos;t find the workspace that you were looking for. Try
            refreshing or choosing another workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center">
        <div className="p-10 border-2 border-dashed flex flex-col items-center gap-2 w-100 bg-card rounded-lg">
          <div className="bg-primary/20 rounded-full p-2">
            <BanIcon className="text-primary size-10" />
          </div>
          <h1 className="text-2xl font-bold text-center">
            No Channel Selected
          </h1>
          <p className="text-sm font-medium text-muted-foreground w-full max-w-100 text-center">
            Begin or resume your conversations by selecting a channel from the
            list on the left. If you don&apos;t see any, you can create a new one to
            get started.
          </p>
        </div>
      </div>
    </div>
  );
};
