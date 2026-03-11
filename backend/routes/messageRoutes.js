const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/send", messageController.sendMessage);
router.get("/conversations", messageController.getConversations);
router.get("/:conversationId", messageController.getMessages);

module.exports = router;
