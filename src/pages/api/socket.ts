import type { IncomingMessage, Server as HTTPServer } from "http";
import type { Socket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import { WebSocket, WebSocketServer } from "ws";
import { auth } from "@/lib/auth/auth";
import { envServer } from "@/data/env/server";

type ChannelSocket = WebSocket & {
  userId: string;
  channelId: string;
};

type SocketServer = HTTPServer & {
  wss?: WebSocketServer;
  wsInitialized?: boolean;
  wsRooms: Map<string, Set<ChannelSocket>>;
};

type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: SocketServer;
  };
};

const allowedOrigins = [envServer.WS_ALLOWED_ORIGINS];

const isAllowedOrigin = (origin?: string | null) => {
  return !!origin && allowedOrigins.includes(origin);
};

const applyCors = (res: NextApiResponse, origin?: string | null) => {
  if (!origin || !isAllowedOrigin) return;

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const toHeaders = (req: IncomingMessage) => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
      continue;
    }
    if (value) headers.set(key, value);
  }

  return headers;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket,
) {
  const origin = req.headers.origin;

  if (req.method === "OPTIONS") {
    applyCors(res, origin);
    res.status(204).end();
    return;
  }

  applyCors(res, origin);

  const server = res.socket.server;

  if (!server.wsInitialized) {
    server.wsInitialized = true;
    server.wsRooms = new Map();

    const wss = new WebSocketServer({ noServer: true });
    server.wss = wss;

    server.on("upgrade", async (request, socket, head) => {
      try {
        const url = new URL(
          request.url ?? "",
          `http://${request.headers.host}`,
        );

        if (url.pathname !== "/api/ws") return;

        if (!isAllowedOrigin(request.headers.origin)) {
          socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
          socket.destroy();
          return;
        }

        const session = await auth.api.getSession({
          headers: toHeaders(request),
        });

        if (!session?.user) {
          socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
          socket.destroy();
          return;
        }

        const channelId = url.searchParams.get("channelId");

        if (!channelId) {
          socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
          socket.destroy();
          return;
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
          const client = ws as ChannelSocket;
          client.userId = session.user.id;
          client.channelId = channelId;
          wss.emit("connection", client, request);
        });
      } catch (error) {
        socket.destroy();
      }
    });

    wss.on("connection", (rawWs) => {
      const ws = rawWs as ChannelSocket;
      const room =
        server.wsRooms?.get(ws.channelId) ?? new Set<ChannelSocket>();

      room.add(ws);
      server.wsRooms?.set(ws.channelId, room);

      ws.send(
        JSON.stringify({
          type: "socket.ready",
          channelId: ws.channelId,
        }),
      );

      ws.on("message", (buffer) => {
        const payload = buffer.toString();

        for (const client of room) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "message.echo",
                channelId: ws.channelId,
                fromUserId: ws.userId,
                payload,
              }),
            );
          }
        }
      });

      ws.on("close", () => {
        room.delete(ws);
        if (room.size === 0) {
          server.wsRooms?.delete(ws.channelId);
        }
      });
    });
  }

  res.status(200).json({
    ok: true,
    wsPath: "/api/ws",
  });
}
