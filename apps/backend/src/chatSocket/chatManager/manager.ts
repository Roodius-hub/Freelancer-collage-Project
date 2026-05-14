import { Events } from "../event";

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
      
    public joinRoom(data:any) {
      console.log("Recieved: ", data.toString());
      const parsed = JSON.parse(data.toString())
    
      const  {type, payload} = parsed;
    
      // join conversation
      if(type === Events.JOIN_CONVERSATION) {
          const { conversationId, text, ws } = payload;

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