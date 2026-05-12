import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
import type { Request } from "express";
console.log(secret);


export const verifyToken = (ws:WebSocket, req:Request) => {
    const url = new URL(req.url!, "http://localhost");

    try {
      const token = url.searchParams.get("token");
  
      const decoded = jwt.verify(token!, secret as string);

        if (decoded) {
            return true;
        }
        
    } catch (error) {
        console.log(error);
        ws.close();
    }
}