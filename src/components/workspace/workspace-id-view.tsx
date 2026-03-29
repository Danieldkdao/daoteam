import { Suspense } from "react";
import { Button } from "../ui/button";

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

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-2 w-full max-w-120 p-10 bg-card border-2 border-dashed rounded-lg">
        <h1 className="text-2xl font-bold">No Channels Yet</h1>
        <p className="text-sm font-medium text-muted-foreground">
          Start your first channel to begin your collaboration with your
          teammates and have engaging discussions.
        </p>
        <Button className="mt-4">Create Channel</Button>
      </div>
    </div>
  );
};
