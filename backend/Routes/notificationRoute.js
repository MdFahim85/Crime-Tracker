const express = require("express");
const router = express.Router();

const {
  getNotifications,
  deleteNotification,
  readNotification,
} = require("../Controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");

router.route("/notifications").get(protect, getNotifications);
router
  .route("/notifications/:id")
  .put(protect, readNotification)
  .delete(protect, deleteNotification);

module.exports = router;
