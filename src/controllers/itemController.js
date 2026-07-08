const itemService = require("../services/itemService");

// create Item
const createItem = async (req, res) => {
    try {
        const item = await itemService.createItem(
            req.body,
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: "Item reported successfully",
            data: item
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

// get all Items
const getAllItems = async (req, res) => {
    try {

        const items = await itemService.getAllItems(req.query);

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// get Item By ID
const getItemById = async (req, res) => {
    try {

        const item = await itemService.getItemById(req.params.id);

        res.status(200).json({
            success: true,
            data: item
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }
};

// update Item
const updateItem = async (req, res) => {
    try {

        const item = await itemService.updateItem(
            req.params.id,
            req.body,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Item updated successfully",
            data: item
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

// delete Item
const deleteItem = async (req, res) => {
    try {

        await itemService.deleteItem(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Item deleted successfully"
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

// update Item Status
const updateStatus = async (req, res) => {
    try {

        const item = await itemService.updateStatus(
            req.params.id,
            req.body.status,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Item status updated successfully",
            data: item
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

// get my Reports
const getMyReports = async (req, res) => {
    try {

        const items = await itemService.getMyReports(req.user.id);

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
    updateStatus,
    getMyReports
};