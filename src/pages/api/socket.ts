import type { Socket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  initWebSocketServer,
  isAllowedWsOrigin,
  type SocketServer,
} from "@/lib/ws/server";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: SocketServer;
  };
};

const applyCors = (res: NextApiResponse, origin?: string | null) => {
  if (!origin || !isAllowedWsOrigin(origin)) return;

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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
  initWebSocketServer(res.socket.server);

  res.status(200).json({
    ok: true,
    wsPath: "/api/ws",
  });
}
