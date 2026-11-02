import express from "express";
import { checkUserExisi } from "../middlewares/user";
import { checkRole } from "../middlewares/role";
import { placeBid } from "../controllers/bidController";

const router = express.Router();


//place bid // freelancerId
router.post("/jobs/:jobId", checkRole('FREELANCER'),checkUserExisi, placeBid);


//Only client should see all bids
// router.get("jobs/:jobId/bids")

//Accept bid 
// bid.status → ACCEPTED
// job.status → IN_PROGRESS
// router.patch("/bids/:id/accept" ,);

//Reject bid
// router.post("/bids/:id/reject", );

export default router;