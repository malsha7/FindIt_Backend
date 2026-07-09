const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.get("/", itemController.getAllItems);

// Protected routes
router.get("/my/reports", authMiddleware, itemController.getMyReports);

router.post("/", authMiddleware, itemController.createItem);

router.put("/:id", authMiddleware, itemController.updateItem);

router.delete("/:id", authMiddleware, itemController.deleteItem);

router.patch("/:id/status", authMiddleware, itemController.updateStatus);

// public route (must come after "/my/reports")
router.get("/:id", itemController.getItemById);

module.exports = router;