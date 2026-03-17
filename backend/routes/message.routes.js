const express = require("express");
const { startConversation, getUserConversations, markMessagesAsRead, acceptConversation, rejectConversation, getConversationMessages, sendMessage } = require("../controllers/message.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const { readLimiter, writeLimiter } = require("../middleware/ratelimit");

const router = express.Router();

// Conversation routes
router.post("/conversations", authMiddleware, writeLimiter, startConversation);
router.get("/conversations", authMiddleware, readLimiter, getUserConversations);
router.put(
  "/read/:conversationId",
  authMiddleware,
  writeLimiter,
  markMessagesAsRead,
);
router.put(
  "/conversations/:id/accept",
  authMiddleware,
  writeLimiter,
  acceptConversation,
);
router.put(
  "/conversations/:id/reject",
  authMiddleware,
  writeLimiter,
  rejectConversation,
);

// Message routes
router.post("/send", authMiddleware, writeLimiter, sendMessage);
router.get(
  "/:conversationId",
  authMiddleware,
  readLimiter,
  getConversationMessages,
);

module.exports = router;
