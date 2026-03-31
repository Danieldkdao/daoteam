"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { isServerSocketEvent, type ServerSocketEvent } from "@/lib/ws/events";

export const useChannelSocket = (
  channelId: string,
  workspaceId: string,
  onEvent?: (event: ServerSocketEvent) => void,
) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<
    "idle" | "connecting" | "open" | "closed"
  >("idle");
  const handleEvent = useEffectEvent((event: ServerSocketEvent) => {
    onEvent?.(event);
  });

  useEffect(() => {
    let cancelled = false;

    const connect = async () => {
      setStatus("connecting");

      await fetch("/api/socket", {
        method: "GET",
        credentials: "include",
      });

      const url = new URL("/api/ws", window.location.origin);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      url.searchParams.set("channelId", channelId);
      url.searchParams.set("workspaceId", workspaceId);

      const socket = new WebSocket(url.toString());
      socketRef.current = socket;

      socket.onopen = () => {
        if (!cancelled) setStatus("open");
      };

      socket.onclose = () => {
        if (!cancelled) setStatus("closed");
      };

      socket.onerror = () => {
        if (!cancelled) setStatus("closed");
      };

      socket.onmessage = (event) => {
        try {
          const data: unknown = JSON.parse(event.data);

          if (isServerSocketEvent(data)) {
            handleEvent(data);
          }
        } catch {
          return;
        }
      };
    };

    void connect();

    return () => {
      cancelled = true;
      socketRef.current?.close(1000, "leaving channel");
      socketRef.current = null;
    };
  }, [channelId, workspaceId]);

  return {
    status,
    send: (payload: unknown) => {
      if (socketRef.current?.readyState !== WebSocket.OPEN) return;

      socketRef.current.send(JSON.stringify(payload));
    },
  };
};
