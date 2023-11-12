const express = require("express");
const router = express.Router();
const {
  getChild,
  setChild,
  updateChild,
  deleteChild,
} = require("../controllers/childController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getChild).post(protect, setChild);
router.route("/:id").delete(protect, deleteChild).put(protect, updateChild);

module.exports = router;
