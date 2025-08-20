const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
} = require("../Controllers/userController");
const { protect } = require("../Middlewares/authMiddleware");
const { getUserReports } = require("../Controllers/reportController");
const router = express.Router();

router.route("/users/register").post(registerUser);
router.route("/users/login").post(loginUser);
router.route("/myprofile").get(protect, getUser);
router.route("/myprofile/myreports").get(protect, getUserReports);

module.exports = router;
