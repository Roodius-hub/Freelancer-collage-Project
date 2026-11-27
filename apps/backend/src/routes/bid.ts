import express from "express";
import { checkUserExisi } from "../middlewares/user";
import { checkRole } from "../middlewares/role";
import { evaluateJobProposals, getAllBids_ofSpecificJob, getNotifications, getSpeceficBids, placeBid, updateBidStatus } from "../controllers/bidController";

const router = express.Router();


//place bid // freelancerId
router.post("/jobs/:jobId", checkRole('FREELANCER'),checkUserExisi, placeBid);

// get bids for notifications 
router.get("/notifications-bids", checkUserExisi, getNotifications);


// get  specefic bid now 
router.get("/get-bids/:bidId", checkUserExisi, getSpeceficBids);

// update bid status
router.patch("/:bidId/status", checkRole('CLIENT'), checkUserExisi, updateBidStatus);

// get all bids of specific job
router.get(
  "/:jobId/bids",
  checkUserExisi,
  getAllBids_ofSpecificJob
);

//Ai evaluation
router.post(
  "/:jobId/evaluate",
  checkUserExisi,
  evaluateJobProposals
);

export default router;