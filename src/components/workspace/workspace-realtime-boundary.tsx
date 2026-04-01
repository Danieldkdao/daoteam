"use client";

import { useWorkspaceSocket } from "@/hooks/use-workspace-socket";
import { SOCKET_EVENT } from "@/lib/ws/events";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

export const WorkspaceRealtimeBoundary = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  useWorkspaceSocket(workspaceId, (event) => {
    if (event.type === SOCKET_EVENT.MEMBER_ADDED) {
      void queryClient.invalidateQueries(
        trpc.workspace.getMembers.queryOptions({ workspaceId }),
      );
    }
  });
  return null;
};
