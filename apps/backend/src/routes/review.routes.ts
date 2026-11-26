
import { Router } from "express";
import { allReviewsOfSpecificUser, createReview } from "../controllers/review.controller";
import { checkUserExisi } from "../middlewares/user";

const router = Router();

router.post("/:jobId", checkUserExisi, createReview);


router.get(
  "/freelancer/:freelancerId", checkUserExisi,
  allReviewsOfSpecificUser
);

export default router;
