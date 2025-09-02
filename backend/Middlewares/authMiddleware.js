const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User deleted or inactive" });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized Access");
    }
  }
  if (!token) {
    throw new Error("Unauthorized Access");
  }
});

const admin = (req, res, next) => {
  if (
    (req.user && req.user.role === "admin") ||
    (req.user && req.user.role === "master_admin")
  ) {
    next();
  } else {
    res.status(401);
    throw new Error("Admin access only");
  }
};

module.exports = { protect, admin };
