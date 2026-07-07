const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Phone",
                "Laptop",
                "Wallet",
                "Keys",
                "ID Card",
                "Bag",
                "Books",
                "Electronics",
                "Clothing",
                "Other"
            ]
        },

        type: {
            type: String,
            required: true,
            enum: ["Lost", "Found"]
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["Open", "Returned"],
            default: "Open"
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Item", itemSchema);