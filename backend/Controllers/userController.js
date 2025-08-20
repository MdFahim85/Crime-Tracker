const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Models/userModel");

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
  console.log(user);
  res.json({ id: user._id, name: user.name, email: user.email });
});

// JWT token generation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
};

module.exports = { registerUser, loginUser, getUser };
