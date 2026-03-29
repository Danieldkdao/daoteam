import { NoWorkspacesYet } from "@/components/workspace/no-workspaces-yet";
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

  return <NoWorkspacesYet />;
};
