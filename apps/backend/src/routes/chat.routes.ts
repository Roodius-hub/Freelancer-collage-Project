import { Router } from "express";
import { GenerateTokenForChat } from "../chatSocket/auth/jwt";

const router = Router();

router.get("/token",GenerateTokenForChat);

export default router;