import type { IncomingMessage, Server as HTTPServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { auth } from "@/lib/auth/auth";
import { envServer } from "@/data/env/server";
import { SOCKET_EVENT, type ServerSocketEvent } from "./events";
import {
  checkExistingChannel,
  checkExistingUser,
  checkExistingWorkspaceMember,
} from "../checks";

type ChannelSocket = WebSocket & {
  type: "channel";
  userId: string;
  isAlive: boolean;
  channelId: string;
};

type WorkspaceSocket = WebSocket & {
  type: "workspace";
  isAlive: boolean;
  workspaceId: string;
  userId: string;
};

type ManagedSocket = ChannelSocket | WorkspaceSocket;

export type SocketServer = HTTPServer & {
  wss?: WebSocketServer;
  wsInitialized?: boolean;
};

type WsChannelState = {
  rooms: Map<string, Set<ChannelSocket>>;
};

type WsWorkspaceState = {
  rooms: Map<string, Set<WorkspaceSocket>>;
};

type UpgradeSocket = {
  write: (chunk: string) => unknown;
  destroy: () => unknown;
};

const globalForWs = globalThis as typeof globalThis & {
  __daoteamWsState?: {
    channelRooms: WsChannelState["rooms"];
    workspaceRooms: WsWorkspaceState["rooms"];
  };
};

const getWsState = () => {
  const channelRoomMap = new Map<string, Set<ChannelSocket>>();
  const workspaceRoomMap = new Map<string, Set<WorkspaceSocket>>();
  if (!globalForWs.__daoteamWsState) {
    globalForWs.__daoteamWsState = {
      channelRooms: channelRoomMap,
      workspaceRooms: workspaceRoomMap,
    };
  }
  if (!globalForWs.__daoteamWsState.channelRooms) {
    globalForWs.__daoteamWsState.channelRooms = channelRoomMap;
  }
  if (!globalForWs.__daoteamWsState.workspaceRooms) {
    globalForWs.__daoteamWsState.workspaceRooms = workspaceRoomMap;
  }

  return globalForWs.__daoteamWsState;
};

const allowedOrigins = envServer.WS_ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const isAllowedWsOrigin = (origin?: string | null) => {
  return !!origin && allowedOrigins.includes(origin);
};

const toHeaders = (req: IncomingMessage) => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item);
      }
      continue;
    }

    if (value) {
      headers.set(key, value);
    }
  }

  return headers;
};

const rejectUpgrade = (
  socket: UpgradeSocket,
  status: 400 | 401 | 403,
  statusText: "Bad Request" | "Unauthorized" | "Forbidden",
) => {
  socket.write(`HTTP/1.1 ${status} ${statusText}\r\n\r\n`);
  socket.destroy();
};

const getWorkspacePresenceUserIds = (workspaceId: string) => {
  const room = getWsState().workspaceRooms.get(workspaceId);
  if (!room) return [];

  return [...new Set(Array.from(room, (client) => client.userId))];
};

const broadcastWorkspacePresence = (workspaceId: string) => {
  const room = getWsState().workspaceRooms.get(workspaceId);
  if (!room?.size) return;

  broadcastToWorkspace(workspaceId, {
    type: SOCKET_EVENT.WORKSPACE_PRESENCE_SYNC,
    workspaceId,
    userIds: getWorkspacePresenceUserIds(workspaceId),
  });
};

export const broadcastToChannel = (
  channelId: string,
  event: ServerSocketEvent,
) => {
  const room = getWsState().channelRooms.get(channelId);
  if (!room) return;

  const payload = JSON.stringify(event);

  for (const client of room) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
};

export const broadcastToWorkspace = (
  workspaceId: string,
  event: ServerSocketEvent,
) => {
  const room = getWsState().workspaceRooms.get(workspaceId);
  if (!room) return;

  const payload = JSON.stringify(event);

  for (const client of room) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
};

export const initWebSocketServer = (server: SocketServer) => {
  if (server.wsInitialized && server.wss) {
    return server.wss;
  }

  const state = getWsState();
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (request, socket, head) => {
    try {
      const url = new URL(
        request.url ?? "",
        `http://${request.headers.host ?? "localhost"}`,
      );

      if (url.pathname !== "/api/ws") return;

      if (!isAllowedWsOrigin(request.headers.origin)) {
        rejectUpgrade(socket, 403, "Forbidden");
        return;
      }

      const session = await auth.api.getSession({
        headers: toHeaders(request),
      });

      if (!session?.user) {
        rejectUpgrade(socket, 401, "Unauthorized");
        return;
      }

      const channelId = url.searchParams.get("channelId");
      const workspaceId = url.searchParams.get("workspaceId");

      if (!workspaceId) {
        rejectUpgrade(socket, 400, "Bad Request");
        return;
      }

      const userCheck = await checkExistingUser(session.user.id);
      if (userCheck.message === "NOUSER") {
        rejectUpgrade(socket, 403, "Forbidden");
        return;
      }

      const orgMemberCheck = await checkExistingWorkspaceMember({
        userId: userCheck.user.id,
        workspaceId,
      });
      if (
        orgMemberCheck.message === "NOMEMBER" ||
        orgMemberCheck.message === "NOORG"
      ) {
        rejectUpgrade(socket, 403, "Forbidden");
        return;
      }

      if (channelId) {
        const channelCheck = await checkExistingChannel({
          channelId,
          workspaceId: orgMemberCheck.org.id,
        });

        if (channelCheck.message === "NOCHANNEL") {
          rejectUpgrade(socket, 403, "Forbidden");
          return;
        }
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        if (!channelId) {
          const client = ws as WorkspaceSocket;
          client.type = "workspace";
          client.userId = session.user.id;
          client.workspaceId = orgMemberCheck.org.id;
          wss.emit("connection", client, request);
          return;
        }

        const client = ws as ChannelSocket;
        client.type = "channel";
        client.userId = session.user.id;
        client.channelId = channelId;
        wss.emit("connection", client, request);
      });
    } catch {
      socket.destroy();
    }
  });

  wss.on("connection", (rawWs) => {
    const ws = rawWs as ManagedSocket;

    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    if (ws.type === "channel") {
      const room =
        state.channelRooms.get(ws.channelId) ?? new Set<ChannelSocket>();

      room.add(ws);
      state.channelRooms.set(ws.channelId, room);

      ws.send(
        JSON.stringify({
          type: SOCKET_EVENT.READY,
          channelId: ws.channelId,
        } satisfies ServerSocketEvent),
      );

      ws.on("close", () => {
        room.delete(ws);

        if (room.size === 0) {
          state.channelRooms.delete(ws.channelId);
        }
      });

      return;
    }

    const room =
      state.workspaceRooms.get(ws.workspaceId) ?? new Set<WorkspaceSocket>();

    room.add(ws);
    state.workspaceRooms.set(ws.workspaceId, room);
    broadcastWorkspacePresence(ws.workspaceId);

    ws.on("close", () => {
      room.delete(ws);

      if (room.size === 0) {
        state.workspaceRooms.delete(ws.workspaceId);
        return;
      }

      broadcastWorkspacePresence(ws.workspaceId);
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      const ws = client as ManagedSocket;
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => clearInterval(interval));

  server.wss = wss;
  server.wsInitialized = true;

  return wss;
};
