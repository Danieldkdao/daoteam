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
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-5xl space-y-8 rounded-3xl border bg-card p-8">
        <div className="space-y-3">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-12 w-1/3 rounded-2xl" />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-2xl" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))}
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
            We couldn't find the workspace that you were looking for. Try
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
            list on the left. If you don't see any, you can create a new one to
            get started.
          </p>
        </div>
      </div>
    </div>
  );
};
