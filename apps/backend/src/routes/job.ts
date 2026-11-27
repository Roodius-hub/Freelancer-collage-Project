import express from "express";
import { checkUserExisi } from "../middlewares/user";
import { createJobs, deleteJob, getAllJob_ofCurrentUser, getJobById, getJobs, jobStatus, updateJob } from "../controllers/jobController";
import { checkRole } from "../middlewares/role";

const router = express.Router();

// post jobs
router.post("/create", checkUserExisi, checkRole('CLIENT') , createJobs);

// update jobs
router.patch("/update/:id", checkUserExisi, checkRole('CLIENT'), updateJob);

// get all jobs list
router.get("/alljobs", getJobs);

//delete jobs 
router.delete("/delete/:id", checkUserExisi,checkRole('CLIENT') , deleteJob);

//update job
router.patch("/jobstatus/:id", checkUserExisi, checkRole('CLIENT'), jobStatus);

router.get("/getjobs/:id", checkUserExisi, getJobById);

// specific user all jobs
router.get("/my-jobs", checkUserExisi, getAllJob_ofCurrentUser);

export default router;