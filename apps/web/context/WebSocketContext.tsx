
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
    useCallback,
} from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";

interface WebSocketEvent {
    type: string;
    payload: any;
}

type EventListener = (event: WebSocketEvent) => void;

interface WebSocketContextType {
    ws: WebSocket | null;
    isConnected: boolean;
    sendMessage: (data: unknown) => void;
    subscribe: (listener: EventListener) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
    undefined
);

export function WebSocketProvider({ children }: { children: ReactNode }) {
    const { status } = useSession();

    const wsRef = useRef<WebSocket | null>(null);
    const listeners = useRef<Set<EventListener>>(new Set());

    const [isConnected, setIsConnected] = useState(false);

    // Subscribe to WebSocket events
    const subscribe = useCallback((listener: EventListener) => {
      listeners.current.add(listener);
    
      return () => {
        listeners.current.delete(listener);
      };
    }, []);

    // Send WebSocket events
    const sendMessage = useCallback((data: unknown) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(data));
      } else {
        console.warn("WebSocket is not connected");
      }
    }, []);

    useEffect(() => {
        if (status !== "authenticated") return;

        let socket: WebSocket | null = null;
        let cancelled = false;

        const connect = async () => {
            try {
                // 1. Generate WebSocket JWT
                const response = await api.get("/chat/token");

                const token = response.data.WebsocketToken;

                if (!token || cancelled) return;

                // 2. Connect to backend
                socket = new WebSocket(
                    `ws://localhost:3001?token=${encodeURIComponent(token)}`
                );

                wsRef.current = socket;

                socket.onopen = () => {
                    if (cancelled) {
                        socket?.close();
                        return;
                    }

                    console.log("WebSocket connected");
                    setIsConnected(true);
                };

                // 3. Receive events
                socket.onmessage = (event) => {
                    try {
                        const data: WebSocketEvent = JSON.parse(event.data);

                        console.log("WebSocket event:", data);

                        listeners.current.forEach((listener) => {
                            listener(data);
                        });
                    } catch (error) {
                        console.error("Invalid WebSocket event:", error);
                    }
                };

                socket.onclose = () => {
                    console.log("WebSocket disconnected");
                    setIsConnected(false);

                    if (wsRef.current === socket) {
                        wsRef.current = null;
                    }
                };

                socket.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };

            } catch (error) {
                console.error("WebSocket connection failed:", error);
            }
        };

        connect();

        return () => {
            cancelled = true;
            socket?.close();

            if (wsRef.current === socket) {
                wsRef.current = null;
            }

            setIsConnected(false);
        };
    }, [status]);

    return (
        <WebSocketContext.Provider
            value={{
                ws: wsRef.current,
                isConnected,
                sendMessage,
                subscribe,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const context = useContext(WebSocketContext);

    if (!context) {
        throw new Error(
            "useWebSocket must be used inside WebSocketProvider"
        );
    }

    return context;
}
