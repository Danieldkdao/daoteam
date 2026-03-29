import { WorkspaceIdView } from "@/components/workspace/workspace-id-view";

const WorkspacePage = (props: { params: Promise<{ workspaceId: string }> }) => {
  return <WorkspaceIdView {...props} />;
};

export default WorkspacePage;
