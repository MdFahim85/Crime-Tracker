const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Enter your username"],
    },
    email: {
      type: String,
      required: [true, "Enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Enter your password"],
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
