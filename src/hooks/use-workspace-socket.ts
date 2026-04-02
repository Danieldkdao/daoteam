"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { isServerSocketEvent, type ServerSocketEvent } from "@/lib/ws/events";

export const useWorkspaceSocket = (
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
    const controller = new AbortController();
    let socket: WebSocket | null = null;

    const connect = async () => {
      setStatus("connecting");

      try {
        await fetch("/api/socket", {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });
      } catch {
        if (!cancelled) setStatus("closed");
        return;
      }

      if (cancelled) return;

      const url = new URL("/api/ws", window.location.origin);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      url.searchParams.set("workspaceId", workspaceId);

      socket = new WebSocket(url.toString());
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
      controller.abort();
      socket?.close(1000, "leaving workspace");
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
      socketRef.current?.close(1000, "leaving workspace");
      socketRef.current = null;
    };
  }, [workspaceId]);

  return {
    status,
    send: (payload: unknown) => {
      if (socketRef.current?.readyState !== WebSocket.OPEN) return;

      socketRef.current.send(JSON.stringify(payload));
    },
  };
};
