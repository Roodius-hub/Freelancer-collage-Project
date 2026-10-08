import express from "express";
import cors from "cors";
import cookieParser  from "cookie-parser";
import type { Request, Response } from "express";
import  userRouter  from "./routes/user"
import jobsRouter from "./routes/job";
export const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));  

app.use(cookieParser());
app.use("/user", userRouter);
app.use("/jobs", jobsRouter)

app.get("/", (req:Request, res:Response) => {
    return res.status(200).json({
      message:"Server Running You nigga !"
    })
})