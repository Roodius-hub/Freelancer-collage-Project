import { WebSocketServer, WebSocket as WebSocketWsType } from "ws";
import server from "../../server";
import  { Events }  from "./event";
import rooms from "./chatManager/manager";
// web socket server
const wss = new WebSocketServer({server});

const relayer_URL = "ws://localhost:3002";
const relayerSocket = new WebSocket(relayer_URL);

relayerSocket.onmessage = ({data}) => {
  console.log("Recieved: ", data.toString());
  const parsed = JSON.parse(data.toString())

  const  {type, payload} = parsed;

  // join conversation
  if(type === Events.JOIN_CONVERSATION) {
      const { conversationId, text } = payload;

      if(!rooms.has(conversationId)) {
          rooms.set(conversationId, new Set());
      }
      
      rooms.get(conversationId)?.add(ws);

      console.log(`Joined room conversationId: ${conversationId}`);
  }

  // send message 
  if(type === Events.SEND_MESSAGE) {
      const {conversationId, text} = payload;

      const room = rooms.get(conversationId);

      room?.forEach((client) => {
          if(client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                  type:Events.NEW_MESSAGE,
                  payload: {
                      text
                  }
              }))
          }
      })
  }
}

wss.on('connection' , (ws) => {
    console.log("client connected !")

    ws.on('message', (data) => {
      relayerSocket.send(data)
    })

    ws.on('close', () => {
            console.log("Client disconnected");
    })

})  