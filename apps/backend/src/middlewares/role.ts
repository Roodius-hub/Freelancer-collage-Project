import { Request, Response, NextFunction } from "express";

type Role = "CLIENT" | "FREELANCER";

export const checkRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized. Please login.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You don't have permission to perform this action.",
      });
    }

    next();
  };
};