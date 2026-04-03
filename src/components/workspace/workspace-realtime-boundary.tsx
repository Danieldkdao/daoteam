"use client";

import { useWorkspaceSocket } from "@/hooks/use-workspace-socket";
import { SOCKET_EVENT } from "@/lib/ws/events";
import {
  emptyWorkspacePresenceState,
  workspacePresenceQueryKey,
} from "@/lib/ws/presence";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const WorkspaceRealtimeBoundary = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(
      workspacePresenceQueryKey(workspaceId),
      emptyWorkspacePresenceState(workspaceId),
    );

    return () => {
      queryClient.removeQueries({
        queryKey: workspacePresenceQueryKey(workspaceId),
        exact: true,
      });
    };
  }, [queryClient, workspaceId]);

  useWorkspaceSocket(workspaceId, (event) => {
    if (event.type === SOCKET_EVENT.MEMBER_ADDED) {
      void queryClient.invalidateQueries(
        trpc.workspace.getMembers.queryOptions({ workspaceId }),
      );
      return;
    }

    if (event.type === SOCKET_EVENT.WORKSPACE_PRESENCE_SYNC) {
      queryClient.setQueryData(workspacePresenceQueryKey(workspaceId), {
        workspaceId: event.workspaceId,
        userIds: event.userIds,
      });
    }
  });
  return null;
};
