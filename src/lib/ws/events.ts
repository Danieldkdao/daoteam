export const SOCKET_EVENT = {
  READY: "socket.ready",
  MESSAGE_CREATED_EDITED: "message.created-edited",
  THREAD_MESSAGE_CREATED: "thread.message.created",
  MEMBER_ADDED: "member.added",
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

export type ServerSocketEvent =
  | SocketReadyEvent
  | MessageCreatedEditedEvent
  | MemberAddedEvent;

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

  return false;
};
