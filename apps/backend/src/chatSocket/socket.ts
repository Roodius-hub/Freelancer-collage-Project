import { WebSocketServer, WebSocket as WebSocketWsType } from "ws";
import server from "../../server";
import  { Events }  from "./event";
import {ChatManager} from "./chatManager/manager";
// web socket server
const wss = new WebSocketServer({server});  //attaches WebSocket support to your existing HTTP server

const relayer_URL = "ws://localhost:3001/ws";
const relayerSocket = new WebSocket(relayer_URL);

const rooms =  ChatManager.getInstance();  
/*
    rooms

conversation-1
   │
   ├── WebSocket client A
   ├── WebSocket client B
   └── WebSocket client C

conversation-2
   │
   ├── WebSocket client D
   └── WebSocket client E
*/

//When the relayer server sends me a message, execute this function
// relayerSocket.onmessage = ({data}) => {
//   console.log("Recieved: ", data.toString());
//   const parsed = JSON.parse(data.toString())

//   const  {type, payload} = parsed;

//   // join conversation
//   if(type === Events.JOIN_CONVERSATION) {
//       const { conversationId, text } = payload;

//       if(!rooms.has(conversationId, )) {  // If conversation 123 doesn't exist, create it.
//           rooms.set(conversationId, new Set());  
//       }
      
//       rooms.get(conversationId)?.add(wss); //Add this WebSocket client to conversation 123.
//       console.log(rooms);
//       console.log(`Joined room conversationId: ${conversationId}`);
//   }

//   // send message 
//   if(type === Events.SEND_MESSAGE) {
//       const {conversationId, text} = payload;

//       const room = rooms.get(conversationId);

//       room?.forEach((client) => {
//           if(client.readyState === WebSocket.OPEN) {
//               client.send(JSON.stringify({
//                   type:Events.NEW_MESSAGE,
//                   payload: {
//                       text
//                   }
//               }))
//           }
//       })
//   }
// }

relayerSocket.onmessage = ({ data }) => {
    const { type, payload } = JSON.parse(data.toString());

    if (type === Events.SEND_MESSAGE) {
        const { conversationId, text } = payload;

        const room = rooms.get(conversationId);

        room?.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: Events.NEW_MESSAGE,
                    payload: {
                        conversationId,
                        text
                    }
                }));
            }
        });
    }
};

let count = 0;
// wss.on('connection' , (ws) => {
//     console.log("client connected !")
//     count++;
//     console.log(count)
//     ws.on('message', (data) => {
//       relayerSocket.send(data)
//     })

//     ws.on('close', () => {
//             console.log("Client disconnected");
//     })

// })  

wss.on("connection", (ws) => {
    count++;
    console.log(count)
    ws.on("message", (data) => {
        const message = JSON.parse(data.toString());

        if (message.type === Events.JOIN_CONVERSATION) {
            const { conversationId } = message.payload;

            if (!rooms.has(conversationId)) {
                rooms.set(conversationId, new Set());
            }

            rooms.get(conversationId)?.add(ws);

            console.log(`Joined: ${conversationId}`);
        }

        if (message.type === Events.SEND_MESSAGE) {
            relayerSocket.send(data);
        }
    });
});