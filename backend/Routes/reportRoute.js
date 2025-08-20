const express = require("express");
const {
  getReports,
  setReport,
  updateReport,
  deleteReport,
  getReportDetails,
  getUserReports,
} = require("../controllers/reportController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/reports").get(getReports).post(protect, setReport);
router
  .route("/reports/:id")
  .get(getReportDetails)
  .put(protect, updateReport)
  .delete(protect, deleteReport);
router.route("/reports/my").get(protect, getUserReports);

module.exports = router;
