const mongoose = require("mongoose");
const Item = require("../models/Item");

//create Item
const createItem = async (data, userId) => {
    const item = await Item.create({
        ...data,
        owner: userId
    });

    return item;
};

// get all Items
const getAllItems = async (query) => {
    const filter = {};

    if (query.category) {
        filter.category = query.category;
    }

    if (query.type) {
        filter.type = query.type;
    }

    if (query.status) {
        filter.status = query.status;
    }

    if (query.location) {
        filter.location = {
            $regex: query.location,
            $options: "i"
        };
    }

    if (query.keyword) {
        filter.$or = [
            {
                title: {
                    $regex: query.keyword,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: query.keyword,
                    $options: "i"
                }
            }
        ];
    }

    return await Item.find(filter)
        .populate("owner", "name email")
        .sort({ createdAt: -1 });
};

// get Item By ID
const getItemById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid item ID");
    }

    const item = await Item.findById(id).populate(
        "owner",
        "name email"
    );

    if (!item) {
        throw new Error("Item not found");
    }

    return item;
};

// update Item
const updateItem = async (id, data, userId) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid item ID");
    }

    const item = await Item.findById(id);

    if (!item) {
        throw new Error("Item not found");
    }

    if (item.owner.toString() !== userId.toString()) {
        throw new Error("Unauthorized");
    }

    Object.assign(item, data);

    await item.save();

    return item;
};

//delete Item
const deleteItem = async (id, userId) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid item ID");
    }

    const item = await Item.findById(id);

    if (!item) {
        throw new Error("Item not found");
    }

    if (item.owner.toString() !== userId.toString()) {
        throw new Error("Unauthorized");
    }

    await Item.findByIdAndDelete(id);
};

// update Item Status
const updateStatus = async (id, status, userId) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid item ID");
    }

    if (!["Open", "Returned"].includes(status)) {
        throw new Error("Invalid status");
    }

    const item = await Item.findById(id);

    if (!item) {
        throw new Error("Item not found");
    }

    if (item.owner.toString() !== userId.toString()) {
        throw new Error("Unauthorized");
    }

    item.status = status;

    await item.save();

    return item;
};

// get my Reports
const getMyReports = async (userId) => {
    return await Item.find({
        owner: userId
    })
        .populate("owner", "name email")
        .sort({ createdAt: -1 });
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