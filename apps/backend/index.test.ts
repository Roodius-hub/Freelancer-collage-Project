import { test, describe, expect } from "bun:test";

describe("Message Sent from room  1  reaches  another particepent in room 1", async () => {
    const ws1 = new WebSocket("ws://localhost:3001");
    const ws2 = new WebSocket("ws://localhost:3001");


    // First Promise
    await new Promise<void>((resolve, rejecct) => {
        let count = 0;
      ws1.onopen = () => {
          count++;
          if (count === 2) {
              resolve();
          }
      }   
  
      ws2.onopen = () => {
          count++;
          if (count === 2) {
              resolve();
          }
      }

    })
    
    console.log("hi there")    
    ws1.send(JSON.stringify({
        type: "Join-room",
        payload: {
            text: "Hi there from Freelancer"
        }
    }))

    ws2.send(JSON.stringify({
        type: "join-room",
        payload: {
            text :"hi from client"
        }
    }))

    // new Promise
    await new Promise<void>((resolve) => {
        ws2.onmessage = ({ data }) => {
            const parseData = JSON.parse(data);
            expect(parseData.type == 'send_message');
            expect(parseData.payload.text == 'hi there');
            resolve();
        }
      
        ws1.send(JSON.stringify({
            type: "send_message",
            payload: {
                text: "hi there"
            }
        })); 
    });
    
})
