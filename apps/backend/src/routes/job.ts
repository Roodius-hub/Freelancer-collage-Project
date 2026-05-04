import express from "express";
import { checkUserExisi } from "../middlewares/user";
import { createJobs, deleteJob, getJobs, updateJob } from "../controllers/jobController";

const router = express.Router();

// post jobs
router.post("/create", checkUserExisi,  createJobs);

// update jobs
router.patch("/update/:id", checkUserExisi, updateJob);

// get all jobs list
router.get("/alljobs", checkUserExisi, getJobs);

//delete jobs 
router.delete("/:id", checkUserExisi, deleteJob);

export default router;