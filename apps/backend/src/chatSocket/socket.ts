import { WebSocketServer, WebSocket as WebSocketWsType } from "ws";
import server from "../../server";
import  { Events }  from "./event";
import {ChatManger} from "./chatManager/manager";
import { string } from "zod/v3";
// web socket server
const wss = new WebSocketServer({server});

const relayer_URL = "ws://localhost:3002";
const relayerSocket = new WebSocket(relayer_URL);
const rooms = new ChatManger();
relayerSocket.onmessage = ({data}) => {
    rooms.joinRoom(data);
      console.log(`Joined room conversationId: ${data.payload.conversationId}`);
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