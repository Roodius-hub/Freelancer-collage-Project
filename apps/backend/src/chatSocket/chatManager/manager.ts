import { CustomWebSocket } from "../types";

export class ChatManger  {
    private static instance:ChatManger;
    private rooms = new Map<string, Set<CustomWebSocket>>();

    private constructor() {
        this.rooms = new Map<string, Set<CustomWebSocket>>();
    }
    
    public static getInstance():ChatManger {
        if (!ChatManger.instance) {
            ChatManger.instance = new ChatManger();
        }
        return ChatManger.instance;
    }

    // join room
    public joinRoom(conversationId: string, ws: CustomWebSocket):void {        
        if (!this.rooms.has(conversationId)) {
          this.rooms.set(conversationId, new Set())
        };

        this.rooms.get(conversationId)?.add(ws);
        if (!ws.conversation) {
            ws.conversation = new Set()
        }
        ws.conversation.add(conversationId);
    }

    // leaving room
    public leaveRoom(conversationId:string, ws:CustomWebSocket):void {
        const room = this.rooms.get(conversationId);
        if (room) {
            room.delete(ws);
            if (room.size == 0) {
                this.rooms.delete(conversationId);
            }
        }
        ws.conversation?.delete(conversationId);
    } 


    // broadcast  message
    public broadcastToConversation(conversationId: string, message: any, exclude?: CustomWebSocket):void {
        const room = this.rooms.get(conversationId);
        if (!room) return;

        const data = JSON.stringify(message);
        for (const client of room) {
            if (client !== exclude && client.readyState === WebSocket.OPEN)
                client.send(data);
        }
    }

    //  auto  cleanup
    public registerSocket(ws: CustomWebSocket): void {
        ws.conversation = new Set();

        ws.on('close' ,() => {
            ws.conversation?.forEach((convId) => {
                this.leaveRoom(convId as string, ws);
            });
            ws.conversation?.clear();
        })
        
    }
}



/*
rooms = {

  "conversation_abc" => Set(
      ws1,
      ws2
  ),

  "conversation_xyz" => Set(
      ws3,
      ws4
  )

}
*/