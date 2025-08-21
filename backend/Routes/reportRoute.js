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
const { protect } = require("../middlewares/authMiddleware");
const {
  getComments,
  setComment,
  deleteComment,
} = require("../controllers/commentController");
const router = express.Router();

// Report Routes
router.route("/reports").get(getReports).post(protect, setReport);
router
  .route("/reports/:id")
  .get(getReportDetails)
  .put(protect, updateReport)
  .delete(protect, deleteReport);
router.route("/reports/:id/status").patch(protect, updateReportSuggestion);
router.route("/reports/my").get(protect, getUserReports);

// Comment Routes
router
  .route("/reports/:id/comments")
  .get(getComments)
  .post(protect, setComment);

router.route("/reports/:id/comments/:commentId").delete(deleteComment);

module.exports = router;
