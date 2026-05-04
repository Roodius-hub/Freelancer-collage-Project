import express from "express";
import cors from "cors";
import cookieParser  from "cookie-parser";

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