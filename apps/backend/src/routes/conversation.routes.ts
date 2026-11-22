
import { Router } from "express";
import { createOrGetConversation ,getConversationMessages,getUserConversations, sendMessage } from "../controllers/conversation.controller";
import { checkUserExisi } from "../middlewares/user";

const router = Router();

router.post("/:bidId", checkUserExisi, createOrGetConversation);

router.get("/", checkUserExisi, getUserConversations);

router.get(
  "/:conversationId/messages",
  checkUserExisi,
  getConversationMessages
);

router.post(
  "/:conversationId/messages",
  checkUserExisi,
  sendMessage
);

export default router;
