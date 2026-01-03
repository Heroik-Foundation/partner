import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getActiveSession } from "@/lib/session";
import { useQueryClient } from "@tanstack/react-query";

type WebSocketHook = {
  markNotificationsAsRead: (notificationId: string) => void;
  markConversationAsRead: (conversationId: string) => void;
};

export function useWebSocket(): WebSocketHook {
  const socketRef = useRef<Socket | null>(null);
  const session = getActiveSession();
  const sessionToken = session?.sessionToken;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!sessionToken) return;

    const socket = io("https://staging.hiroek.io", {
      auth: {
        token: sessionToken,
      },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected with id:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionToken]);

  const markNotificationsAsRead = (notificationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("notification-opened", { notificationId });
      queryClient.invalidateQueries({
        queryKey: ["user-notifications-list"],
      });
    } else {
      console.error("Node reference unavailable");
    }
  };

  const markConversationAsRead = (conversationId: string) => {
    if (socketRef.current) {
      socketRef.current?.emit("conversation-opened", { conversationId });

      queryClient.invalidateQueries({
        queryKey: ["user-event-conversations"],
      });
    } else {
      console.error("Node reference unavailable");
    }
  };

  return {
    markNotificationsAsRead,
    markConversationAsRead,
  };
}
