const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");


const app = express();

// enable cross-Origin resource Sharing
app.use(cors());

// parse incoming JSON requests
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// testing Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to FindIt Backend API"
    });
});

module.exports = app;