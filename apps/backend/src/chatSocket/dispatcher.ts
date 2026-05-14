import { CustomWebSocket } from "./types";
import { ChatManager } from "./chatManager/manager";
import { MessageHandler } from "./handlers/MessageHandler"


const handlers = new Map<string, (ws: CustomWebSocket, payload: any, requestId?: string) => void>();


handlers.set('send_message', () => {
    
})