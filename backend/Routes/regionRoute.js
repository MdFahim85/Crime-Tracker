const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middlewares/authMiddleware");
const {
  getAllRegions,
  setRegion,
  updateRegion,
  deleteRegion,
} = require("../Controllers/regionController");
const { regionPagination } = require("../middlewares/pagination");

router
  .route("/regions")
  .get(regionPagination, getAllRegions)
  .post(protect, admin, setRegion);
router
  .route("/regions/:id")
  .put(protect, admin, updateRegion)
  .delete(protect, admin, deleteRegion);

module.exports = router;
