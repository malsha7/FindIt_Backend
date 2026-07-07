const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register user
const register = async (userData) => {
    const { name, studentId, email, password } = userData;

    // validate required fields
    if (!name || !studentId || !email || !password) {
        throw new Error("All fields are required");
    }

    // check existing email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    // check existing student ID
    const existingStudent = await User.findOne({ studentId });

    if (existingStudent) {
        throw new Error("Student ID already exists");
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

    // remove password before returning
    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
};

// login user
const login = async (userData) => {
    const { email, password } = userData;

    // validate required fields
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // generate JWT
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
        user: {
            id: user._id,
            name: user.name,
            studentId: user.studentId,
            email: user.email,
            profileImage: user.profileImage
        }
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

    // only allow to these fields to be updated
    const updateData = {
        name: data.name,
        studentId: data.studentId,
        email: data.email,
        profileImage: data.profileImage
    };

    const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};