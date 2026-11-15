
import { Router } from "express";
import { sendEmailOTP, verifyEmailOTP } from "../controllers/verification.controller";
import { checkUserExisi } from "../middlewares/user";

const router = Router();

router.post("/send-email-otp", checkUserExisi, sendEmailOTP);
router.post("/email-verify", checkUserExisi, verifyEmailOTP);
export default router;
