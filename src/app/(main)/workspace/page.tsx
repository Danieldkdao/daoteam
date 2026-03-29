import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const WorkspacePage = () => {
  return (
    <Suspense>
      <WorkspaceSuspense />
    </Suspense>
  );
};

export default WorkspacePage;

const WorkspaceSuspense = async () => {
  const workspaces = await auth.api.listOrganizations({
    headers: await headers(),
  });
  if (workspaces[0]?.id) return redirect(`/workspace/${workspaces[0].id}`);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-2 w-full max-w-120 p-10 bg-card border-2 border-dashed rounded-lg">
        <h1 className="text-2xl font-bold">No Workspaces Yet</h1>
        <p className="text-sm font-medium text-muted-foreground">
          Create your first workspace to begin inviting members of your team to
          join and collaborate.
        </p>
        <Button className="mt-4">Create Workspace</Button>
      </div>
    </div>
  );
};
