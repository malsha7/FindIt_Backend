const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

// all chat routes require authentication

// send a message
router.post("/", authMiddleware, chatController.sendMessage);

// get chat list for logged-in user
router.get("/list", authMiddleware, chatController.getChatList);

// get conversation with another user for a specific item
router.get(
    "/:itemId/:userId",
    authMiddleware,
    chatController.getConversation
);

module.exports = router;