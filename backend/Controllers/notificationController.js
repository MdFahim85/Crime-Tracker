const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({
    timestamp: -1,
  });
  if (!notifications) {
    res.status(404).json({ message: "You have no new notifications" });
  }
  res.json({ notifications });
});

const readNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404).json("Could not find result");
  }
  notification.isRead = true;
  await notification.save();
  res.json({ message: "Notification updated" });
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404).json("Could not find result");
  }
  await notification.deleteOne();
  res.json({ message: "Notification has been deleted" });
});

module.exports = { getNotifications, readNotification, deleteNotification };
