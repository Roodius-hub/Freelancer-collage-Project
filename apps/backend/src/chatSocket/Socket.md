###
A real‑time messaging server where:

A client and a freelancer can chat in a conversation (like a project‑specific chat).

Users authenticate using a JWT token.

The server manages "rooms" per conversation, so messages are delivered instantly to all online participants.

The code is split into:

ChatManager – a singleton that handles room membership (join, leave, broadcast).

Handlers – separate modules for each event type (e.g., MessageHandler for sending messages).

A dispatcher – routes incoming messages to the correct handler.


#### src/
```
  websocket/
    ChatManager.ts          // singleton, rooms, broadcast
    auth/
      jwt.ts   // create jwt
      verify.jwt // verify jwt
    handlers/
      MessageHandler.ts     // send_message, typing, read receipts
      BidHandler.ts         // place_bid, award_job
      NotificationHandler.ts // mark_as_read, etc.
    dispatcher.ts           // maps event type → handler
    types.ts                // shared interfaces
    ```