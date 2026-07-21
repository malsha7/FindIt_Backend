const mongoose = require("mongoose");

const Notification = require("../models/Notification");

// get all notifications for the logged-in user
const getNotifications = async (userId) => {

    const notifications = await Notification.find({
        receiver: userId
    })
        .populate("sender", "name email")
        .populate("item", "title category type")
        .sort({ createdAt: -1 });

    return notifications;

};

// mark a notification as read
const markAsRead = async (notificationId, userId) => {

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        throw new Error("Invalid notification ID");
    }

    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            receiver: userId
        },
        {
            isRead: true
        },
        {
            new: true
        }
    )
        .populate("sender", "name email")
        .populate("item", "title category type");

    if (!notification) {
        throw new Error("Notification not found");
    }

    return notification;

};

// mark all notifications as read
const markAllAsRead = async (userId) => {

    await Notification.updateMany(
        {
            receiver: userId,
            isRead: false
        },
        {
            isRead: true
        }
    );

    return;

};

// delete a notification
const deleteNotification = async (notificationId, userId) => {

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        throw new Error("Invalid notification ID");
    }

    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        receiver: userId
    });

    if (!notification) {
        throw new Error("Notification not found");
    }

    return;

};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};