import { CustomWebSocket } from "./types";
import { ChatManager } from "./chatManager/manager";
import { MessageHandler } from "./handlers/MessageHandler"
import { IncomingMessage } from "./types";
import { handler } from "next/dist/build/templates/app-page";

const handlers = new Map<string, (ws: CustomWebSocket,req:Request, payload: any, requestId?: string) => void>();


handlers.set('send_message', (ws, req, payload, requestId) => {
    const manager = ChatManager.getInstance();
    new MessageHandler().handleMessage(ws, req, manager, payload)
});
    // join conversation , place_bid 

    export default function dispatchMessage(ws: CustomWebSocket, rawData: string): void {
        let msg: IncomingMessage;
        try {
            msg = JSON.parse(rawData);
        } catch (error) {
            ws.send(JSON.stringify({ type: 'error', paylaod: { message: 'Invalid Json' } }))
            return;
        }

        const { type, payload, requestId } = msg;
        const handle = handlers.get(type);

        if (!handler) {
            ws.send(JSON.stringify({ type: 'error', payload: { message: `Unknown event: ${type}` }, requestId }));
            return;
        }

        try {
            handler(ws, payload, requestId);
        } catch (error:any) {
          ws.send(JSON.stringify({ type: 'error', payload: { message: error.message }, requestId }));
        }
    }
    
