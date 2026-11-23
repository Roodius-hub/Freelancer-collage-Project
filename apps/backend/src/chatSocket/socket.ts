
import { WebSocketServer, WebSocket } from "ws";
import type { CustomWebSocket, IncomingMessage } from "./types";
import server from "../../server";
import { db } from "../db/db";
import { ChatManager } from "./chatManager/manager";
import { Events } from "./event";
import { verifyToken } from "./auth/verrifyToken";

const wss = new WebSocketServer({ server });

const rooms = ChatManager.getInstance();

wss.on("connection", async (socket, req) => {
    const ws = socket as CustomWebSocket;

    // 1. Authenticate the WebSocket connection
    const decoded = verifyToken(req);

    if (!decoded) {
        ws.close(1008, "Unauthorized");
        return;
    }

    // Identity comes from the verified JWT
    ws.userId = decoded.id;

    // 2. Register socket and join user's notification room
    rooms.registerSocket(ws);

    console.log(`WebSocket connected: ${ws.userId}`);

    // 3. Listen for incoming events
    ws.on("message", async (rawData) => {
        try {
            const message = JSON.parse(rawData.toString()) as IncomingMessage;

            switch (message.type) {

                // Join a conversation
                case Events.JOIN_CONVERSATION: {
                    const { conversationId } = message.payload ?? {};

                    if (
                        typeof conversationId !== "string" ||
                        !conversationId.trim()
                    ) {
                        return;
                    }

                    // Verify this user belongs to the conversation
                    const conversation = await db.conversation.findFirst({
                        where: {
                            id: conversationId,
                            OR: [
                                { clientId: ws.userId },
                                { freelancerId: ws.userId },
                            ],
                        },
                        select: { id: true },
                    });

                    if (!conversation) {
                        ws.send(JSON.stringify({
                            type: "error",
                            payload: {
                                message: "You cannot access this conversation",
                            },
                        }));
                        return;
                    }

                    rooms.joinRoom(conversationId, ws);
                    console.log("USER JOINED ROOM:", {
                      userId: ws.userId,
                      conversationId,
                    });
                    console.log(
                        `${ws.userId} joined conversation ${conversationId}`
                    );

                    break;
                }

                // Leave a conversation
                case Events.LEAVE_CONVERSATION: {
                    const { conversationId } = message.payload ?? {};

                    if (typeof conversationId === "string") {
                        rooms.leaveRoom(conversationId, ws);
                    }

                    break;
                }

                // Typing indicator
                case Events.TYPING: {
                    const { conversationId, isTyping } = message.payload ?? {};

                    if (
                        typeof conversationId !== "string" ||
                        typeof isTyping !== "boolean"
                    ) {
                        return;
                    }

                    // Only allow typing events in joined rooms
                    if (!ws.conversation?.has(conversationId)) {
                        return;
                    }

                    rooms.broadcastToConversation(
                        conversationId,
                        {
                            type: Events.TYPING,
                            payload: {
                                conversationId,
                                userId: ws.userId,
                                isTyping,
                            },
                        },
                        ws
                    );

                    break;
                }

                default:
                    console.log("Unknown WebSocket event:", message.type);
            }
        } catch (error) {
            console.error("WebSocket message error:", error);
        }
    });

    ws.on("close", () => {
        console.log(`WebSocket disconnected: ${ws.userId}`);
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

console.log("WebSocket server initialized");
