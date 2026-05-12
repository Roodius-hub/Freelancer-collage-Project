export class ChatManger  {
    private static instance:ChatManger;
    private rooms = new Map<string, Set<WebSocket>>();

    constructor() {
        this.rooms = new Map<string, Set<WebSocket>>();
    }
    
    public getInstance():ChatManger {
        if (!ChatManger.instance) {
            ChatManger.instance = new ChatManger();
        }
        return ChatManger.instance;
    }
      
    public joinRoom(conversationId: string, ws: WebSocket) {
        if (!this.rooms.has(conversationId)) {
          this.rooms.set(conversationId, new Set())
        };

        this.rooms.get(conversationId)?.add(ws);
    }

    public leaveRoom(conversationId:string, ws:WebSocket) {
        if (this.rooms.has(conversationId)) {
            this.rooms.delete(conversationId);
        }
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