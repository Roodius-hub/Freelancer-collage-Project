import express from "express";
import { CreateSkill, getUser, updateUser, UserAddress, DeleteAccount } from "../controllers/userController";
import { checkUserExisi } from "../middlewares/user";

const router = express.Router();

//get
router.post("/get", checkUserExisi ,getUser);


//update
router.patch("/update",checkUserExisi ,updateUser );


// address 
router.post("/address", checkUserExisi , UserAddress);

// skills
router.post("/skills", checkUserExisi, CreateSkill);

router.delete("/deleteprofile", checkUserExisi, DeleteAccount);

export default router;

