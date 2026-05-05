import express from "express";
import { checkUserExisi } from "../middlewares/user";
import { createJobs, deleteJob, getJobs, jobStatus, updateJob } from "../controllers/jobController";

const router = express.Router();

// post jobs
router.post("/create", checkUserExisi,  createJobs);

// update jobs
router.patch("/update/:id", checkUserExisi, updateJob);

// get all jobs list
router.get("/alljobs", getJobs);

//delete jobs 
router.delete("/delete/:id", checkUserExisi, deleteJob);

router.patch("/jobstatus/:id", checkUserExisi, jobStatus);

export default router;