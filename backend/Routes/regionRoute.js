const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middlewares/authMiddleware");
const {
  getAllRegions,
  setRegion,
  updateRegion,
  deleteRegion,
} = require("../controllers/regionController");

router.route("/regions").get(getAllRegions).post(protect, admin, setRegion);
router
  .route("/regions/:id")
  .put(protect, admin, updateRegion)
  .delete(protect, admin, deleteRegion);

module.exports = router;
