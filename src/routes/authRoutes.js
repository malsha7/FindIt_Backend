const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// public routes - login and register
router.post("/register", authController.register);
router.post("/login", authController.login);

// protected routes - get and update user profile
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);

module.exports = router;