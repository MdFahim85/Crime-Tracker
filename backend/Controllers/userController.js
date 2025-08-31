const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Report = require("../models/reportModel");
const { cloudinary } = require("../cloudinary");

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill out all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    image: { url: req.file?.path, fileName: req.file?.filename } || "",
    role: "user",
    date: new Date(),
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      image: user.image,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Missing credentials");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user._id,
    username: user.username,
    image: user.image,
    role: user.role,
    token: generateToken(user._id),
  });
});

// Get Current User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    username: user.username,
    email: user.email,
    image: user.image,
    role: user.role,
    date: user.date,
  });
});

// Update User Profile
const updateUser = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id);
  if (!currentUser) {
    res.status(404);
    throw new Error("User not found");
  }

  const { username, oldPassword, password } = req.body;

  if (!username) {
    res.status(400);
    throw new Error("Please provide username");
  }

  // If changing password, check old password
  let updatedPassword = currentUser.password;
  if (password) {
    if (!oldPassword) {
      res.status(400);
      throw new Error("Old password is required to change password");
    }
    const match = await bcrypt.compare(oldPassword, currentUser.password);
    if (!match) {
      res.status(401);
      throw new Error("Old password does not match");
    }
    if (oldPassword === password) {
      res.status(400);
      throw new Error("New password cannot be same as old password");
    }
    updatedPassword = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      username,
      password: updatedPassword,
      image: req.file
        ? { url: req.file.path, fileName: req.file.filename }
        : currentUser.image,
    },
    { new: true }
  );

  res.json({
    message: "User updated successfully",
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    image: updatedUser.image,
  });
});

// Get all users (Admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const { next, prev } = res.paginatedData;
  const users = res.paginatedData.results;

  res.status(200).json({ users, next, prev });
});

// Get all reports of a individual user
const getUserAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ user: req.params.id });
  if (!reports) {
    res.status(404).json({ message: "No reports found for this user" });
  }
  res.json({ reports });
});

// Update user info / role (Admin)
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  const actingUser = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent changing your own role
  if (user._id.toString() === req.user.id.toString()) {
    res.status(403);
    throw new Error("You cannot change your own role");
  }

  // MASTER ADMIN can change any role
  if (actingUser.role === "master_admin") {
    if (user.role === "master_admin") {
      return res
        .status(403)
        .json({ message: "Cannot change master admin role" });
    }
    user.role = role || user.role;
    await user.save();
    return res
      .status(200)
      .json({ message: "User role updated successfully", user });
  }

  // ADMIN rules
  if (actingUser.role === "admin") {
    if (user.role === "master_admin") {
      return res
        .status(403)
        .json({ message: "You cannot change master admin role" });
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admins cannot demote other admins" });
    }

    // Only promote user -> admin
    if (user.role === "user" && role === "admin") {
      user.role = "admin";
      await user.save();
      return res.status(200).json({ message: "User promoted to admin", user });
    }

    return res
      .status(403)
      .json({ message: "Admins can only promote users to admin" });
  }

  res.status(403).json({ message: "Not authorized to update roles" });
});

// Delete user (Admin)
const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const actingUser = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent deleting yourself
  if (user._id.toString() === req.user.id.toString()) {
    return res.status(403).json({ message: "You cannot delete yourself" });
  }

  // MASTER ADMIN can delete anyone except another master admin
  if (actingUser.role === "master_admin") {
    if (user.role === "master_admin") {
      return res
        .status(403)
        .json({ message: "You cannot delete master admin" });
    }

    user.image.fileName &&
      (await cloudinary.uploader.destroy(user.image.fileName));
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  }
  // ADMIN rules
  if (actingUser.role === "admin") {
    if (user.role === "master_admin" || user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admins cannot delete other admins or master admin" });
    }

    await cloudinary.uploader.destroy(user.image.fileName);

    await user.deleteOne();
    return res.status(200).json({ message: "User deleted successfully" });
  }

  res.status(403).json({ message: "Not authorized to delete users" });
});

// JWT Token Generation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "5d" });
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  getAllUsers,
  getUserAllReports,
  updateUserByAdmin,
  deleteUserByAdmin,
};
