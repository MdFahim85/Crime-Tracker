const express = require("express");
const {
  getReports,
  setReport,
  updateReport,
  deleteReport,
  getReportDetails,
} = require("../Controllers/reportController");
const { protect } = require("../Middlewares/authMiddleware");
const router = express.Router();

router.route("/reports").get(getReports).post(protect, setReport);
router
  .route("/reports/:id")
  .get(getReportDetails)
  .put(protect, updateReport)
  .delete(protect, deleteReport);

module.exports = router;
