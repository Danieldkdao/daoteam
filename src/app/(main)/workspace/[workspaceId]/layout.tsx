import { WorkspaceRealtimeBoundary } from "@/components/workspace/workspace-realtime-boundary";
import { ReactNode } from "react";

const WorkspaceIdLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) => {
  const { workspaceId } = await params;
  return (
    <>
      <WorkspaceRealtimeBoundary workspaceId={workspaceId} />
      {children}
    </>
  );
};

export default WorkspaceIdLayout;
