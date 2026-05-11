import { reqresTypes } from "../types/userTypes"
import { db } from "../db/db"
import { jwtVerify } from "jose";
import { NextFunction } from "express";
import type { Request, Response } from "express";
import { getToken } from "next-auth/jwt"
import env from "dotenv"

env.config();

// const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
// console.log(process.env.NEXTAUTH_SECRET)


// middleware
export const checkUserExisi = async (req:Request,res:Response,next:NextFunction) => {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    })
        console.log("URL:", req.originalUrl);
        console.log("params:", req.params);
        console.log(req.cookies);
        console.log(req.headers.cookie);
        // const token = req.cookies["next-auth.session-token"] ||
        //               req.cookies["__Secure-next-auth.session-token"] ||
        //               req.cookies["__Host-next-auth.session-token"]; 
        console.log(token)
        console.log(token?.sub);
        if (!token || !token.sub) {
            return res.status(401).json({message: "Unautherized !"});
        }

        // verfify 
        console.log(req.user);
        req.user = {
            id: token.uid as string,  //user.id
        };

        next();   
}
