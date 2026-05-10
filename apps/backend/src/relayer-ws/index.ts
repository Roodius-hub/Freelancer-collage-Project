import  { WebSocketServer, WebSocket } from "ws";
import  { Events }  from "../../src/chatSocket/event";
import rooms from "../chatSocket/chatManager/manager";
// web socket server
const wss = new WebSocketServer({port :3002 });

const servers: WebSocket[] = [];

wss.on('connection', (ws) => {
    ws.on('error', console.error);
  
    servers.push(ws);

    ws.on('message', (data:string) => {
        servers.map((socket) => {
            socket.send(data);
      })
    })
      
        
});