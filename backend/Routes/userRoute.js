const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  getUserAllReports,
  googleLogin,
} = require("../Controllers/userController");
const { protect, admin } = require("../Middlewares/authMiddleware");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudinary");
const { userPagination } = require("../Middlewares/pagination");
const upload = multer({ storage });

// Public routes
router.route("/users").post(upload.single("image"), registerUser);
router.route("/users/login").post(loginUser);

// Google Login/Register
router.route("/users/googleLogin").post(googleLogin);

// User Routes
router
  .route("/users/profile")
  .get(protect, getUser)
  .put(protect, upload.single("image"), updateUser);

// Admin Routes

router.route("/users").get(protect, admin, userPagination, getAllUsers);
router
  .route("/users/:id")
  .get(protect, admin, getUserAllReports)
  .patch(protect, admin, updateUserByAdmin)
  .delete(protect, admin, deleteUserByAdmin);

module.exports = router;
