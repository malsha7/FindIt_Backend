const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// all notification routes require authentication

// get all notifications
router.get(
    "/",
    authMiddleware,
    notificationController.getNotifications
);

// mark a notification as read
router.patch(
    "/:id/read",
    authMiddleware,
    notificationController.markAsRead
);

// mark all notifications as read
router.patch(
    "/read-all",
    authMiddleware,
    notificationController.markAllAsRead
);

// delete a notification
router.delete(
    "/:id",
    authMiddleware,
    notificationController.deleteNotification
);

module.exports = router;