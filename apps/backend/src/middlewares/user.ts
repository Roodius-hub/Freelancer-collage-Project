import { reqresTypes } from "../types/userTypes"
import { db } from "../db/db"
import { jwtVerify } from "jose";
import { NextFunction } from "express";
import type { Request, Response } from "express";
import { getToken } from "next-auth/jwt"
import env from "dotenv"

env.config();

// const secret = new TextEncoder().enx`code(process.env.NEXTAUTH_SECRET);
// console.log(process.env.NEXTAUTH_SECRET)


// middleware
export const    checkUserExisi = async (req:Request,res:Response,next:NextFunction) => {
     try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET!,
        });

        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        req.user = {
            id: token.uid as string,
        };

        next();

    } catch (error) {
        console.error("Auth error:", error);
         res.status(401).json({
            message: "Invalid authentication",
        });
    }
}
