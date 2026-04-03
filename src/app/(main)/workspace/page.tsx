export const dynamic = "force-dynamic";

import { NoWorkspacesYet } from "@/components/workspace/no-workspaces-yet";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const WorkspacePage = () => {
  return <WorkspaceSuspense />;
};

export default WorkspacePage;

const WorkspaceSuspense = async () => {
  const workspaces = await auth.api.listOrganizations({
    headers: await headers(),
  });
  if (workspaces[0]?.id) return redirect(`/workspace/${workspaces[0].id}`);

  return <NoWorkspacesYet />;
};
