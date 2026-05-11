import { db } from "../../src/db/db";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt"
import type { Request, Response } from "express";
const secret = process.env.JWT_SECRET;
console.log(secret);

  
export const GenerateTokenForChat = async (req:Request, res:Response) => {
    const token = await getToken({
        req, 
        secret:process.env.NEXTAUTH_SECRET
    });
    
    console.log(token);
    console.log(token)
    console.log(token?.sub);
    if (!token || !token.sub) {
        return res.status(401).json({message: "Unautherized !"});
    }
    try {
      const SignedTokenForWebsocket = jwt.sign({id: token.sub}, secret as string, {expiresIn: "1d"});
        console.log(SignedTokenForWebsocket);

        return res.status(200).json({
            "WebsocketToken" : SignedTokenForWebsocket
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while generating token"
        })
    }
    
    
    
}