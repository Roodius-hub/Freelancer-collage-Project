
import { Request, Response, NextFunction } from "express";
import { getToken } from "next-auth/jwt";

type Role = "CLIENT" | "FREELANCER";

export const checkRole = (...allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET!,
      });

      if (!token) {
        return res.status(401).json({
          message: "Unauthorized. Please login.",
        });
      }

      const userRole = token.role as Role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "You don't have permission to perform this action.",
        });
      }

      next();
    } catch (error) {
      console.error("Role middleware error:", error);

      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }
  };
};
