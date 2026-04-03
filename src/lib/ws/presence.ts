export type WorkspacePresenceState = {
  workspaceId: string;
  userIds: string[];
};

export const workspacePresenceQueryKey = (workspaceId: string) =>
  ["workspace-presence", workspaceId] as const;

export const emptyWorkspacePresenceState = (
  workspaceId: string,
): WorkspacePresenceState => ({
  workspaceId,
  userIds: [],
});
