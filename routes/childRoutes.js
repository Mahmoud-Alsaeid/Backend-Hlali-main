const express = require("express");
const router = express.Router();
const {
  getChild,
  setChild,
  updateChild,
  deleteChild,
  loginChild,
  getChildById,
} = require("../controllers/childController");
const { protect } = require("../middleware/authMiddleware");

router.route("/child/:id").get(getChildById);
router.route("/").get(getChild).post(protect, setChild);
router
  .route("/:id")
  .delete(protect, deleteChild)
  .put(protect, updateChild)
  .get(protect, loginChild);

module.exports = router;
