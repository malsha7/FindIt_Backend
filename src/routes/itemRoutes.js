const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");

// public routes
router.get("/", itemController.getAllItems);
router.get("/:id", itemController.getItemById);

// protected routes
router.post("/", authMiddleware, itemController.createItem);

router.put("/:id", authMiddleware, itemController.updateItem);

router.delete("/:id", authMiddleware, itemController.deleteItem);

router.patch("/:id/status", authMiddleware, itemController.updateStatus);

router.get("/my/reports", authMiddleware, itemController.getMyReports);

module.exports = router;