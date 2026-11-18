import express from "express";
import { checkUserExisi } from "../middlewares/user";
import { checkRole } from "../middlewares/role";
import { getBids, getSpeceficBids, placeBid } from "../controllers/bidController";

const router = express.Router();


//place bid // freelancerId
router.post("/jobs/:jobId", checkRole('FREELANCER'),checkUserExisi, placeBid);

// get bids for notifications 
router.get("/notifications-bids", checkRole('CLIENT'), checkUserExisi, getBids);


// get  specefic bid now 
router.get("/get-bids/:bidId", checkRole('CLIENT'), checkUserExisi, getSpeceficBids);

//Only client should see all bids
// router.get("jobs/:jobId/bids")

//Accept bid 
// bid.status → ACCEPTED
// job.status → IN_PROGRESS
// router.patch("/bids/:id/accept" ,);

//Reject bid
// router.post("/bids/:id/reject", );

export default router;