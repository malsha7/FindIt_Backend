const notificationService = require("../services/notificationService");

// get Notifications
const getNotifications = async (req, res) => {
    try {

        const notifications = await notificationService.getNotifications(
            req.user.id
        );

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// mark Notification as Read
const markAsRead = async (req, res) => {
    try {

        const notification = await notificationService.markAsRead(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

// mark All Notifications as Read
const markAllAsRead = async (req, res) => {
    try {

        await notificationService.markAllAsRead(req.user.id);

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// delete a Notification
const deleteNotification = async (req, res) => {
    try {

        await notificationService.deleteNotification(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};