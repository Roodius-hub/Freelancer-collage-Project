
import jwt, { JwtPayload } from "jsonwebtoken";
import type { IncomingMessage } from "http";

interface ChatTokenPayload extends JwtPayload {
  id: string;
}

export const verifyToken = (req: IncomingMessage): ChatTokenPayload | null => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const token = url.searchParams.get("token");

    if (!token) return null;

    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "string"
    ) {
      return null;
    }

    return decoded as ChatTokenPayload;
  } catch {
    return null;
  }
};
