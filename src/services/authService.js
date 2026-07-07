const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register user
const register = async (userData) => {

    const { name, studentId, email, password } = userData;

    // check existing email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await User.create({
        name,
        studentId,
        email,
        password: hashedPassword
    });

    return user;
};

// login user
const login = async (userData) => {

    const { email, password } = userData;

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return {
        token,
        user
    };
};

// get profile
const getProfile = async (userId) => {

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

// update profile
const updateProfile = async (userId, data) => {

    const user = await User.findByIdAndUpdate(
        userId,
        data,
        {
            new: true
        }
    ).select("-password");

    return user;
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};