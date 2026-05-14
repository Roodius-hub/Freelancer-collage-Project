import { WebSocket } from "ws";

export interface CustomWebSocket extends WebSocket {
    userId?: string;
    userRole?: 'client' | 'freelancer';
    conversation?: Set<String>; // conversation room
}

export interface IncomingMessage  {
    type: string;
    payload: any;
    requestId?: string;   // ACK ID
}

export interface ChatManager {
    joinRoom(conversationId: string, ws: CustomWebSocket): void;
    leaveRoom(conversationId: string, ws: CustomWebSocket): void;
    broadcastToConversation(conversationId: string, message: any, exclude?: CustomWebSocket): void;
    registerSocket(ws: CustomWebSocket): void;
}