
import { WebSocket } from "ws";

export interface CustomWebSocket extends WebSocket {
    userId?: string;
    userRole?: "client" | "freelancer";
    conversation?: Set<string>;
}

export interface IncomingMessage {
    type: string;
    payload: any;
    requestId?: string;
}

export interface ChatManager {
    joinRoom(conversationId: string, ws: CustomWebSocket): void;
    leaveRoom(conversationId: string, ws: CustomWebSocket): void;

    joinUserRoom(userId: string, ws: CustomWebSocket): void;

    broadcastToConversation(
        conversationId: string,
        message: unknown,
        exclude?: CustomWebSocket
    ): void;

    broadcastToUser(userId: string, message: unknown): void;

    registerSocket(ws: CustomWebSocket): void;
}
