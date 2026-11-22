import express from "express";
import cors from "cors";
import cookieParser  from "cookie-parser";
import type { Request, Response } from "express";
import  userRouter  from "./routes/user"
import jobsRouter from "./routes/job";
import bidRouter from "./routes/bid";
import resendRouter from "./routes/verification";
import conversationRouter from "./routes/conversation.routes";

export const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));  

app.use(cookieParser());
app.use("/user", userRouter);
app.use("/jobs", jobsRouter);
app.use("/bids",bidRouter);
app.use("/verify-user", resendRouter);
app.use("/conversations", conversationRouter);

app.get("/", (req:Request, res:Response) => {
    return res.status(200).json({
      message:"Server Running You nigga !"
    })
})