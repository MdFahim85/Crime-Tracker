const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  updateUser,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/users").post(registerUser);
router.route("/users/login").post(loginUser);
router.route("/users/profile").get(protect, getUser).post(updateUser);

module.exports = router;
