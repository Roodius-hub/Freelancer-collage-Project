import { CustomWebSocket } from "../types"
import url from "url";
import { db } from "../../db/db";
import type { ChatManager } from "../chatManager/manager";

export class MessageHandler {    
    async handleMessage(ws: CustomWebSocket, req:Request, ChatManager: ChatManager, payload: any, requestId?: string): Promise<void> {
      const queryObject = url.parse(req.url, true).query;
        const token = queryObject.token;
        console.log(token);
        
        const { conversationId, text } = payload;

        if (!conversationId || !text) {
            ws.send(JSON.stringify({type:'error', payload: {message: "conversationId and Text Required"}}))
        }

        // 2. Authorization: check that the sender is a participant (you'll query your DB)

        const Savedmessage = {
            id: token?.user.userId, 
            senderId: ws.userId,
            conversationId,
            text,
            timestamp: new Date().toString()
        }

        // save message in Db

        ChatManager.broadcastToConversation(conversationId, {
            type: 'new_message',
            payload: Savedmessage
        })

        // ack the sender
        if (requestId) {
            ws.send(JSON.stringify({ type: 'send_message_ack', payload: { messageId: Savedmessage.id }, requestId }));
        }
    }
}