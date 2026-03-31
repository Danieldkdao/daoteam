export const SOCKET_EVENT = {
  READY: "socket.ready",
  MESSAGE_CREATED: "message.created",
} as const;

export type SocketReadyEvent = {
  type: typeof SOCKET_EVENT.READY;
  channelId: string;
};

export type MessageCreatedEvent = {
  type: typeof SOCKET_EVENT.MESSAGE_CREATED;
  channelId: string;
  messageId: string;
};

export type ServerSocketEvent = SocketReadyEvent | MessageCreatedEvent;

export const isServerSocketEvent = (
  value: unknown,
): value is ServerSocketEvent => {
  if (typeof value !== "object" || value === null) return false;

  const event = value as Partial<ServerSocketEvent>;

  if (event.type === SOCKET_EVENT.READY) {
    return typeof event.channelId === "string";
  }

  if (event.type === SOCKET_EVENT.MESSAGE_CREATED) {
    return (
      typeof event.channelId === "string" &&
      typeof event.messageId === "string"
    );
  }

  return false;
};
