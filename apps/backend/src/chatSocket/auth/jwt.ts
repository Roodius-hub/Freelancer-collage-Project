
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

export const GenerateTokenForChat = async (
  req: Request,
  res: Response
) => {
  try {
    const nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    if (!nextAuthToken?.sub) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const websocketToken = jwt.sign(
      { id: nextAuthToken.sub },
      secret,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      WebsocketToken: websocketToken,
    });
  } catch (error) {
    console.error("WebSocket token generation failed:", error);

    return res.status(500).json({
      message: "Error while generating WebSocket token",
    });
  }
};
