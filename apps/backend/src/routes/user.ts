import express from "express";
import { CreateSkill, getUser, updateUser, UserAddress, DeleteAccount, getUserSkill, getUserBypost, getAddress } from "../controllers/userController";
import { checkUserExisi } from "../middlewares/user";

const router = express.Router();

//get
router.get("/get", checkUserExisi ,getUser);

// get  user by post 
router.get("/get/:id", checkUserExisi, getUserBypost);

//update
router.patch("/update",checkUserExisi ,updateUser );


// address 
router.post("/address", checkUserExisi, UserAddress);
router.get("/get-address", checkUserExisi , getAddress);

// skills
router.post("/skills", checkUserExisi, CreateSkill);

router.get("/getskills", checkUserExisi, getUserSkill);

router.delete("/deleteprofile", checkUserExisi, DeleteAccount);

export default router;

