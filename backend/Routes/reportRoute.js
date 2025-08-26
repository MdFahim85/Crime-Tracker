const express = require("express");
const {
  getReports,
  setReport,
  updateReport,
  deleteReport,
  getReportDetails,
  getUserReports,
  updateReportSuggestion,
} = require("../controllers/reportController");
const { protect, admin } = require("../middlewares/authMiddleware");
const {
  getComments,
  setComment,
  deleteComment,
} = require("../controllers/commentController");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudinary");
const { reportPagination } = require("../middlewares/pagination");
const upload = multer({ storage });

// Report Routes
router
  .route("/reports")
  .get(reportPagination, getReports)
  .post(protect, upload.single("image"), setReport);
router.route("/reports/my").get(protect, getUserReports);
router
  .route("/reports/:id")
  .get(getReportDetails)
  .put(protect, upload.single("image"), updateReport)
  .delete(protect, deleteReport);
router.route("/reports/:id").delete(protect, admin, deleteReport);
router
  .route("/reports/:id/status")
  .patch(protect, admin, updateReportSuggestion);

// Comment Routes
router
  .route("/reports/:id/comments")
  .get(getComments)
  .post(protect, setComment);

router.route("/reports/:id/comments/:commentId").delete(protect, deleteComment);

module.exports = router;
