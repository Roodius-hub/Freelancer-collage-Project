import type { NextFunction, Request, Response } from "express";
import  "express";

export interface reqresTypes {
    req:Request,
    res:Response, 
    next:NextFunction
}


declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id : string;
            email?: string;
        }
    }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}