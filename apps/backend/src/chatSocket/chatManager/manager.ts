
import { WebSocket } from "ws";
import { CustomWebSocket } from "../types";

export class ChatManager {
    private static instance: ChatManager;

    private rooms = new Map<string, Set<CustomWebSocket>>();
    private userRooms = new Map<string, Set<CustomWebSocket>>();

    private constructor() {}

    public static getInstance(): ChatManager {
        if (!ChatManager.instance) {
            ChatManager.instance = new ChatManager();
        }

        return ChatManager.instance;
    }

    // Join a conversation room
    public joinRoom(conversationId: string, ws: CustomWebSocket): void {
        if (!this.rooms.has(conversationId)) {
            this.rooms.set(conversationId, new Set());
        }

        this.rooms.get(conversationId)?.add(ws);

        if (!ws.conversation) {
            ws.conversation = new Set<string>();
        }

        ws.conversation.add(conversationId);
    }

    // Leave a conversation room
    public leaveRoom(conversationId: string, ws: CustomWebSocket): void {
        const room = this.rooms.get(conversationId);

        if (room) {
            room.delete(ws);

            if (room.size === 0) {
                this.rooms.delete(conversationId);
            }
        }

        ws.conversation?.delete(conversationId);
    }

    // Join a user's notification room
    public joinUserRoom(userId: string, ws: CustomWebSocket): void {
        if (!this.userRooms.has(userId)) {
            this.userRooms.set(userId, new Set());
        }

        this.userRooms.get(userId)?.add(ws);
    }

    // Broadcast to everyone in a conversation
    public broadcastToConversation(
        conversationId: string,
        message: unknown,
        exclude?: CustomWebSocket
    ): void {
        const room = this.rooms.get(conversationId);

        if (!room) return;

        const data = JSON.stringify(message);
        console.log("BROADCAST TO ROOM:", {
          conversationId,
          connectedClients: room?.size ?? 0,
        });
        for (const client of room) {
            if (
                client !== exclude &&
                client.readyState === WebSocket.OPEN
            ) {
                console.log("SENDING TO USER:", client.userId);
                client.send(data);
            }
        }
    }

    // Notify all connections belonging to a user
    public broadcastToUser(userId: string, message: unknown): void {
        const room = this.userRooms.get(userId);

        if (!room) return;

        const data = JSON.stringify(message);

        for (const client of room) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        }
    }

    // Register a newly authenticated socket
    public registerSocket(ws: CustomWebSocket): void {
        ws.conversation = new Set<string>();

        if (ws.userId) {
            this.joinUserRoom(ws.userId, ws);
        }

        ws.on("close  ", () => {
            for (const conversationId of [...(ws.conversation ?? [])]) {
                this.leaveRoom(conversationId, ws);
            }

            if (ws.userId) {
                const userRoom = this.userRooms.get(ws.userId);

                userRoom?.delete(ws);

                if (userRoom?.size === 0) {
                    this.userRooms.delete(ws.userId);
                }
            }
        });
    }
}
