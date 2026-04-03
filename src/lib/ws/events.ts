export const SOCKET_EVENT = {
  READY: "socket.ready",
  MESSAGE_CREATED_EDITED: "message.created-edited",
  THREAD_MESSAGE_CREATED: "thread.message.created",
  MEMBER_ADDED: "member.added",
  WORKSPACE_PRESENCE_SYNC: "workspace.presence.sync",
} as const;

export type SocketReadyEvent = {
  type: typeof SOCKET_EVENT.READY;
  channelId: string;
};

export type MessageCreatedEditedEvent = {
  type:
    | typeof SOCKET_EVENT.MESSAGE_CREATED_EDITED
    | typeof SOCKET_EVENT.THREAD_MESSAGE_CREATED;
  channelId: string;
  messageId: string;
};

export type MemberAddedEvent = {
  type: typeof SOCKET_EVENT.MEMBER_ADDED;
  workspaceId: string;
};

export type WorkspacePresenceSyncEvent = {
  type: typeof SOCKET_EVENT.WORKSPACE_PRESENCE_SYNC;
  workspaceId: string;
  userIds: string[];
};

export type ServerSocketEvent =
  | SocketReadyEvent
  | MessageCreatedEditedEvent
  | MemberAddedEvent
  | WorkspacePresenceSyncEvent;

export const isServerSocketEvent = (
  value: unknown,
): value is ServerSocketEvent => {
  if (typeof value !== "object" || value === null) return false;

  const event = value as Partial<ServerSocketEvent>;

  if (event.type === SOCKET_EVENT.READY) {
    return typeof event.channelId === "string";
  }

  if (
    event.type === SOCKET_EVENT.MESSAGE_CREATED_EDITED ||
    event.type === SOCKET_EVENT.THREAD_MESSAGE_CREATED
  ) {
    return (
      typeof event.channelId === "string" && typeof event.messageId === "string"
    );
  }

  if (event.type === SOCKET_EVENT.MEMBER_ADDED) {
    return typeof event.workspaceId === "string";
  }

  if (event.type === SOCKET_EVENT.WORKSPACE_PRESENCE_SYNC) {
    return (
      typeof event.workspaceId === "string" &&
      Array.isArray(event.userIds) &&
      event.userIds.every((userId) => typeof userId === "string")
    );
  }

  return false;
};
