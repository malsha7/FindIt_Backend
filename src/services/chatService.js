const mongoose = require("mongoose");

const Chat = require("../models/Chat");
const User = require("../models/User");
const Item = require("../models/Item");
const Notification = require("../models/Notification");

// send a message
const sendMessage = async (senderId, data) => {
    const { receiver, item, message } = data;

    if (!receiver || !item || !message) {
        throw new Error("Receiver, item and message are required");
    }

    if (!mongoose.Types.ObjectId.isValid(receiver)) {
        throw new Error("Invalid receiver ID");
    }

    if (!mongoose.Types.ObjectId.isValid(item)) {
        throw new Error("Invalid item ID");
    }

    if (senderId === receiver) {
        throw new Error("You cannot send a message to yourself");
    }

    const receiverUser = await User.findById(receiver);

    if (!receiverUser) {
        throw new Error("Receiver not found");
    }

    const itemExists = await Item.findById(item);

    if (!itemExists) {
        throw new Error("Item not found");
    }

    // ensure the message receiver is the owner of the item
    if (itemExists.owner.toString() !== receiver) {
        throw new Error("Receiver must be the owner of the item");
    }

    const chat = await Chat.create({
        sender: senderId,
        receiver,
        item,
        message
    });

    const sender = await User.findById(senderId);

    await Notification.create({
        receiver,
        sender: senderId,
        item,
        type: "MESSAGE",
        title: "New Message",
        message: `${sender.name} sent you a message about "${itemExists.title}".`
    });

    return await Chat.findById(chat._id)
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .populate("item", "title category type");
};

// get conversation for one item
const getConversation = async (userId, otherUserId, itemId) => {

    await Chat.updateMany(
        {
            sender: otherUserId,
            receiver: userId,
            item: itemId,
            isRead: false
        },
        {
            isRead: true
        }
    );

    const messages = await Chat.find({
        item: itemId,
        $or: [
            {
                sender: userId,
                receiver: otherUserId
            },
            {
                sender: otherUserId,
                receiver: userId
            }
        ]
    })
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .sort({ createdAt: 1 });

    return messages;
};

// get latest chats for logged-in user
const getChatList = async (userId) => {

    const chats = await Chat.aggregate([
        {
            $match: {
                $or: [
                    { sender: new mongoose.Types.ObjectId(userId) },
                    { receiver: new mongoose.Types.ObjectId(userId) }
                ]
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $group: {
                _id: {
                    item: "$item",
                    sender: "$sender",
                    receiver: "$receiver"
                },
                latestMessage: {
                    $first: "$$ROOT"
                }
            }
        },
        {
            $replaceRoot: {
                newRoot: "$latestMessage"
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    return await Chat.populate(chats, [
        {
            path: "sender",
            select: "name email"
        },
        {
            path: "receiver",
            select: "name email"
        },
        {
            path: "item",
            select: "title category type status"
        }
    ]);
};

module.exports = {
    sendMessage,
    getConversation,
    getChatList
};