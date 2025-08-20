const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// User registration
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill out all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hashSync(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid user data");
  }
});

// User login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401);
    throw new Error("Missing credentials");
  }
  const user = await User.findOne({ email });
  if (user && email != user.email) {
    res.status(401);
    throw new Error("Invalid email");
  }
  const match = await bcrypt.compare(password, user.password);
  if (user && match) {
    res.json({
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// User details
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ id: user._id, name: user.name, email: user.email });
});

// User Profile Update
const updateUser = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user.id);
  const { name, email, oldPassword, password } = req.body;
  if (!name || !email) {
    res.status(400);
    throw new Error("Please complete all the fields");
  }

  if (!currentUser) {
    res.status(404);
    throw new Error("No User Found");
  }
  const match = await bcrypt.compare(password, process.env.JWT_SECRET);
  if (!match) {
    res.status(400);
    throw new Error("Password doesn't match");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    name,
    email,
    hashedPassword,
  });
  if (updateUser) {
    res.json({ message: "User updated successfully", updatedUser });
  } else {
    res.status(404);
    throw new Error("Something went wrong");
  }
});

// JWT token generation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
};

module.exports = { registerUser, loginUser, getUser, updateUser };
