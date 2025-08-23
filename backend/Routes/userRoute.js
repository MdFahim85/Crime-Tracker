const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
} = require("../controllers/userController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public routes
router.route("/users").post(registerUser);
router.route("/users/login").post(loginUser);

// User Routes
router.route("/users/profile").get(protect, getUser).put(protect, updateUser);

// Admin Routes

router.route("/users").get(protect, admin, getAllUsers);
router
  .route("/users/:id")
  .put(protect, admin, updateUserByAdmin)
  .delete(protect, admin, deleteUserByAdmin);

module.exports = router;
