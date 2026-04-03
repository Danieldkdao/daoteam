"use client";

import {
  emptyWorkspacePresenceState,
  workspacePresenceQueryKey,
} from "@/lib/ws/presence";
import { useQuery } from "@tanstack/react-query";

export const useWorkspacePresence = (workspaceId: string | undefined) => {
  const normalizedWorkspaceId = workspaceId ?? "";

  return useQuery({
    queryKey: workspacePresenceQueryKey(normalizedWorkspaceId),
    queryFn: async () => emptyWorkspacePresenceState(normalizedWorkspaceId),
    initialData: emptyWorkspacePresenceState(normalizedWorkspaceId),
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
  });
};
