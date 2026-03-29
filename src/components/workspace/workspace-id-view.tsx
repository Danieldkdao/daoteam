import { Suspense } from "react";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { organization } from "@/db/schema";

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
  return <div>loading</div>;
};

const WorkspaceIdSuspense = async ({ params }: WorkspaceIdProps) => {
  const { workspaceId } = await params;
  const existingWorkspace = await db.query.organization.findFirst({
    where: eq(organization.id, workspaceId),
  });

  if (!existingWorkspace) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col gap-2 w-full max-w-120 p-10 bg-card border-2 border-dashed rounded-lg">
          <h1 className="text-2xl font-bold">Workspace Not Found</h1>
          <p className="text-sm font-medium text-muted-foreground">
            We couldn't find the workspace that you were looking for. Try
            refreshing or choosing another workspace.
          </p>
        </div>
      </div>
    );
  }

  return <div>{/* todo: implement messages view */}</div>;
};
