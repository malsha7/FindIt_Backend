const chatService = require("../services/chatService");

// send Message
const sendMessage = async (req, res) => {
    try {

        const message = await chatService.sendMessage(
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

// get Conversation
const getConversation = async (req, res) => {
    try {

        const messages = await chatService.getConversation(
            req.user.id,
            req.params.userId,
            req.params.itemId
        );

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

// get Chat List
const getChatList = async (req, res) => {
    try {

        const chats = await chatService.getChatList(req.user.id);

        res.status(200).json({
            success: true,
            count: chats.length,
            data: chats
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    sendMessage,
    getConversation,
    getChatList
};