import express from "express";
import { checkUserExisi } from "../middlewares/user";

const router = express.Router();


//place bid // freelancerId
router.post("/jobs/:jobId/bids", checkUserExisi, );


//Only client should see all bids
router.get("jobs/:jobId/bids")

//Accept bid 
// bid.status → ACCEPTED
// job.status → IN_PROGRESS
router.patch("/bids/:id/accept" ,);

//Reject bid
router.post("/bids/:id/reject", );

export default router;